import { useState } from "react";
import { Link, useLocation } from "wouter";
import { GraduationCap, LogOut, Loader2, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import AuthModal from "@/components/AuthModal";

export default function Navbar() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleGetCvScore = () => {
    navigate("/start");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last) || user.email?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          height: '60px',
          background: 'rgba(17, 0, 34, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container mx-auto max-w-6xl h-full">
          <div className="flex items-center justify-between px-4 md:px-6 gap-4 h-full">
            <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl tracking-tight">BCALM</span>
            </Link>
            
            <div className="flex items-center gap-3">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white/60" />
              ) : isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 hover:opacity-80 transition-opacity" data-testid="button-user-menu">
                        <Avatar className="h-8 w-8 border border-white/20">
                          <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                          <AvatarFallback className="bg-primary/50 text-white text-xs">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:block text-white/80 text-sm font-medium">
                          {user.firstName || user.email?.split('@')[0]}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer" data-testid="button-dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" data-testid="button-logout">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setAuthModalOpen(true)}
                    className="text-white/60 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                    data-testid="button-signin"
                  >
                    Sign in
                  </button>
                  <button 
                    onClick={handleGetCvScore}
                    className="text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    data-testid="button-get-cv-score-nav"
                  >
                    Get My Free CV Score
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
