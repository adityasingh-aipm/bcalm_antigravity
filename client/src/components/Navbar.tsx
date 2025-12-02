import { Link } from "wouter";
import { Upload } from "lucide-react";
import bcalmLogo from "@assets/Bcalm-logo-Nobackground_1764679699958.png";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: '#E8D5F2',
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between px-3 md:px-6 gap-4">
          <Link href="/" className="py-2 md:py-2 flex-shrink-0 -ml-6 md:-ml-12">
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
              backgroundColor: '#6c47ff',
              color: '#ffffff',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(108, 71, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5a38f0';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(108, 71, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6c47ff';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(108, 71, 255, 0.3)';
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
