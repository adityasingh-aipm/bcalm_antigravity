import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { trackEvent, getUtmParams, getPagePath } from "@/lib/analytics";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Mail, KeyRound, UserCircle } from "lucide-react";

async function getBackendToken(supabaseAccessToken: string, supabaseUserId: string, email: string, name?: string) {
  const response = await apiRequest("POST", "/api/resources/auth/supabase", {
    supabaseAccessToken,
    supabaseUserId,
    email,
    name,
  });
  return response.json();
}

type AuthView = "email" | "otp" | "profile";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (user: { id: string; email: string; name?: string }) => void;
  redirectPath?: string;
}

const ROLE_OPTIONS = [
  { value: "student", label: "Student" },
  { value: "recent_graduate", label: "Recent Graduate" },
  { value: "product_manager", label: "Product Manager" },
  { value: "product_analyst", label: "Product Analyst" },
  { value: "developer", label: "Developer" },
  { value: "qa", label: "QA" },
];

export function AuthModal({ open, onOpenChange, onSuccess, redirectPath }: AuthModalProps) {
  const { toast } = useToast();
  
  const [authView, setAuthView] = useState<AuthView>("email");
  const [pendingEmail, setPendingEmail] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [profileData, setProfileData] = useState({
    fullName: "",
    collegeCompany: "",
    role: "",
  });

  const resetModal = () => {
    setAuthView("email");
    setPendingEmail("");
    setIsNewUser(false);
    setEmail("");
    setOtpCode("");
    setProfileData({ fullName: "", collegeCompany: "", role: "" });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetModal();
    }
    onOpenChange(newOpen);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: { 
          shouldCreateUser: true,
        },
      });

      if (error) {
        throw error;
      }

      setPendingEmail(email);
      setAuthView("otp");
      
      toast({
        title: "Code sent!",
        description: `We've sent a 6-digit code to ${email}`,
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: otpCode,
        type: "email",
      });

      if (error) {
        throw error;
      }

      const currentUser = data.user;
      
      if (!currentUser) {
        throw new Error("No user returned after verification");
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
      }

      if (!profile) {
        setIsNewUser(true);
        setAuthView("profile");
      } else {
        const backendAuth = await getBackendToken(
          data.session?.access_token || "",
          currentUser.id,
          currentUser.email || "",
          profile.full_name
        );
        
        localStorage.setItem("resources_token", backendAuth.token);
        localStorage.setItem("resources_user", JSON.stringify({
          id: backendAuth.user.id,
          email: backendAuth.user.email,
          name: backendAuth.user.name,
        }));

        const utmParams = getUtmParams();
        const pagePath = getPagePath();
        
        trackEvent("user_login", {
          email: currentUser.email,
          pagePath: pagePath,
          utm: utmParams,
          navigationSource: null,
        });

        toast({
          title: "Welcome back!",
          description: `Signed in as ${backendAuth.user.name || currentUser.email}`,
        });

        onSuccess?.({
          id: backendAuth.user.id,
          email: backendAuth.user.email,
          name: backendAuth.user.name,
        });

        handleOpenChange(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid or expired code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error("No authenticated user");
      }

      const { error } = await supabase.from("profiles").upsert({
        id: currentUser.id,
        full_name: profileData.fullName.trim(),
        college_company: profileData.collegeCompany.trim() || null,
        role: profileData.role || null,
      });

      if (error) {
        throw error;
      }

      const { data: { session } } = await supabase.auth.getSession();

      const backendAuth = await getBackendToken(
        session?.access_token || "",
        currentUser.id,
        currentUser.email || "",
        profileData.fullName
      );
      
      localStorage.setItem("resources_token", backendAuth.token);
      localStorage.setItem("resources_user", JSON.stringify({
        id: backendAuth.user.id,
        email: backendAuth.user.email,
        name: backendAuth.user.name,
      }));

      const utmParams = getUtmParams();
      const pagePath = getPagePath();

      trackEvent("user_signup", {
        name: profileData.fullName,
        email: currentUser.email,
        role: profileData.role,
        collegeCompany: profileData.collegeCompany,
        pagePath: pagePath,
        utm: utmParams,
        navigationSource: null,
      });

      toast({
        title: "Welcome to Bcalm!",
        description: `Your account is ready, ${profileData.fullName}`,
      });

      onSuccess?.({
        id: backendAuth.user.id,
        email: backendAuth.user.email,
        name: backendAuth.user.name,
      });

      handleOpenChange(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: pendingEmail,
        options: { shouldCreateUser: true },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Code resent",
        description: `A new code has been sent to ${pendingEmail}`,
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast({
        title: "Error",
        description: "Failed to resend code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailView = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <Mail className="h-5 w-5 text-primary" />
          <DialogTitle>Sign in or create an account</DialogTitle>
        </div>
        <DialogDescription>
          Use your email to get a login code. No password needed.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleEmailSubmit} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            autoComplete="email"
            autoFocus
            data-testid="input-auth-email"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
          data-testid="button-auth-continue"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            "Continue"
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Already have an account? You'll sign in automatically.
          <br />
          New here? We'll create your account after you enter the code.
        </p>
      </form>
    </>
  );

  const renderOtpView = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <KeyRound className="h-5 w-5 text-primary" />
          <DialogTitle>Enter the 6-digit code</DialogTitle>
        </div>
        <DialogDescription>
          We sent a code to <span className="font-medium">{pendingEmail}</span>
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleOtpSubmit} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            autoComplete="one-time-code"
            autoFocus
            className="text-center text-lg tracking-widest"
            data-testid="input-auth-otp"
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || otpCode.length !== 6}
          data-testid="button-auth-verify"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading}
            className="text-sm text-primary hover:underline disabled:opacity-50"
            data-testid="button-auth-resend"
          >
            Didn't receive a code? Resend
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setAuthView("email");
            setOtpCode("");
          }}
          className="text-xs text-muted-foreground hover:underline w-full text-center"
          data-testid="button-auth-back"
        >
          Use a different email
        </button>
      </form>
    </>
  );

  const renderProfileView = () => (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <UserCircle className="h-5 w-5 text-primary" />
          <DialogTitle>Complete your profile</DialogTitle>
        </div>
        <DialogDescription>
          One last step towards your AI PM journey
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleProfileSubmit} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="fullName">Name *</Label>
          <Input
            id="fullName"
            type="text"
            value={profileData.fullName}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            placeholder="Your full name"
            autoFocus
            data-testid="input-auth-name"
          />
        </div>

        <div>
          <Label htmlFor="collegeCompany">College / Company</Label>
          <Input
            id="collegeCompany"
            type="text"
            value={profileData.collegeCompany}
            onChange={(e) => setProfileData({ ...profileData, collegeCompany: e.target.value })}
            placeholder="Where do you study or work?"
            data-testid="input-auth-college"
          />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select 
            value={profileData.role} 
            onValueChange={(value) => setProfileData({ ...profileData, role: value })}
          >
            <SelectTrigger data-testid="select-auth-role">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-testid={`option-role-${option.value}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || !profileData.fullName.trim()}
          data-testid="button-auth-complete"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </form>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent data-testid="dialog-auth" className="sm:max-w-md">
        {authView === "email" && renderEmailView()}
        {authView === "otp" && renderOtpView()}
        {authView === "profile" && renderProfileView()}
      </DialogContent>
    </Dialog>
  );
}
