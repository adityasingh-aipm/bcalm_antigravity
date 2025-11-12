import { SiLinkedin, SiX, SiInstagram } from "react-icons/si";
import { Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">AI Product Manager Launchpad</h3>
            <p className="text-sm text-muted-foreground">
              Transform into an AI Product Manager in 30 days with industry leaders.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-terms">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-privacy">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-contact">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-linkedin">
                <SiLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                <SiX className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
            <div className="flex gap-4">
              <a href="mailto:info@aipmlaunchpad.com" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm" data-testid="link-email">
                <Mail className="h-4 w-4" />
                Email
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 text-sm" data-testid="link-whatsapp">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 AI Product Manager Launchpad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
