import { Link } from "wouter";
import { Upload } from "lucide-react";
import bcalmLogo from "@assets/Bcalm-logo-Nobackground_1764679699958.png";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between px-3 md:px-6 gap-4">
          <Link href="/" className="py-3 md:py-4 flex-shrink-0">
            <img 
              src={bcalmLogo} 
              alt="Bcalm - Crack Any Interview in 30 Days"
              className="select-none cursor-pointer h-20 md:h-28 w-auto"
              style={{
                objectFit: 'contain',
                objectPosition: 'left center'
              }}
              data-testid="logo-bcalm"
            />
          </Link>
          
          <Link 
            href="/coming-soon/upload-resume"
            className="rounded-full font-medium transition-all duration-300 flex-shrink-0 whitespace-nowrap text-xs md:text-sm flex items-center gap-2"
            style={{
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#ffffff',
              textDecoration: 'none',
              border: '1.5px solid rgba(255, 255, 255, 0.7)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.color = '#1a0b2e';
              e.currentTarget.style.borderColor = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
            }}
            data-testid="button-upload-resume-nav"
          >
            <Upload className="h-4 w-4" />
            Upload Resume
          </Link>
        </div>
      </div>
    </nav>
  );
}
