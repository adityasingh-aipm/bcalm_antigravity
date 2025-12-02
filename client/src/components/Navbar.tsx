import { Link } from "wouter";
import { Upload } from "lucide-react";
import bcalmLogo from "@assets/Bcalm-logo-Nobackground_1764679699958.png";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '74px',
        background: 'linear-gradient(to right, #20004F, #0C0F2A)',
      }}
    >
      <div className="container mx-auto max-w-6xl h-full">
        <div className="flex items-center justify-between px-4 md:px-6 gap-4 h-full">
          <Link href="/" className="flex-shrink-0">
            <img 
              src={bcalmLogo} 
              alt="Bcalm - Crack Any Interview in 30 Days"
              className="select-none cursor-pointer h-12 md:h-14 w-auto"
              style={{
                objectFit: 'contain',
                objectPosition: 'left center'
              }}
              data-testid="logo-bcalm"
            />
          </Link>
          
          <Link 
            href="/coming-soon/upload-resume"
            className="font-medium transition-all duration-300 flex-shrink-0 whitespace-nowrap text-sm flex items-center gap-2"
            style={{
              padding: '12px 20px',
              backgroundColor: '#6A0DFF',
              color: '#FFFFFF',
              textDecoration: 'none',
              borderRadius: '8px',
              fontFamily: 'Inter, Poppins, sans-serif',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#7B27FF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#6A0DFF';
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
