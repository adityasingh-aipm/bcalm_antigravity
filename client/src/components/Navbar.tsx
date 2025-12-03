import { Link } from "wouter";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
  const scrollToForm = () => {
    const formCard = document.getElementById('cv-form-card');
    if (formCard) {
      formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
          
          <button 
            onClick={scrollToForm}
            className="text-white/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
            data-testid="link-login"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
