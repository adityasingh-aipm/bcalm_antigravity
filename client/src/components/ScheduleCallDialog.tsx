import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";

// TypeScript declaration for Calendly API
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

interface ScheduleCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScheduleCallDialog({ open, onOpenChange }: ScheduleCallDialogProps) {
  const [isCalendlyReady, setIsCalendlyReady] = useState(false);

  const openCalendly = () => {
    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: 'https://calendly.com/aditya-singh-bcalm/30min'
      });
    }
  };

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => {
      setIsCalendlyReady(true);
    };
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      // Defensive cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Call</DialogTitle>
          <DialogDescription>
            Book a 30-minute consultation with our team to learn more about the AI PM Launchpad program.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">What to expect:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Program overview and curriculum details</li>
              <li>Career support and outcomes discussion</li>
              <li>Q&A about your specific background</li>
              <li>Next steps and enrollment process</li>
            </ul>
          </div>
          
          <Button
            onClick={openCalendly}
            className="w-full"
            disabled={!isCalendlyReady}
            data-testid="button-open-calendly"
          >
            {isCalendlyReady ? (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Select a Time Slot
              </>
            ) : (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading booking...
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
