import { Link } from "wouter";
import bcalmLogo from "@assets/Bcalm-logo-Nobackground_1764679699958.png";

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between px-3 md:px-6 gap-4">
          <Link href="/" className="py-3 md:py-4 flex-shrink-0">
            <img 
              src={bcalmLogo} 
              alt="Bcalm - AI Product Manager Launchpad"
              className="select-none cursor-pointer h-10 md:h-16 w-auto"
              style={{
                objectFit: 'contain',
                objectPosition: 'left center'
              }}
              data-testid="logo-bcalm"
            />
          </Link>
          
          <Link 
            href="/resources"
            className="rounded-full font-medium transition-all duration-200 flex-shrink-0 whitespace-nowrap text-xs md:text-sm"
            style={{
              padding: '6px 12px',
              backgroundColor: '#f5f3ff',
              color: '#6c47ff',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ebe4ff';
              e.currentTarget.style.color = '#5a38f0';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f3ff';
              e.currentTarget.style.color = '#6c47ff';
              e.currentTarget.style.boxShadow = '';
            }}
            data-testid="link-free-resources"
          >
            Free Resources
          </Link>
        </div>
      </div>
    </nav>
  );
}
