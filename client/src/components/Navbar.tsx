import { Link } from "wouter";
import { GraduationCap, LogOut, Loader2, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, isLoading, isAuthenticated } = useAuth();

  const scrollToForm = () => {
    const formCard = document.getElementById('cv-form-card');
    if (formCard) {
      const navbarHeight = 60;
      const offset = 20;
      const elementPosition = formCard.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.charAt(0) || "";
    const last = user.lastName?.charAt(0) || "";
    return (first + last) || user.email?.charAt(0)?.toUpperCase() || "U";
  };

  return (
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
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer" data-testid="button-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <button 
                onClick={scrollToForm}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                data-testid="button-get-cv-score"
              >
                Get Free CV Score
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
