import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface WaitlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WaitlistDialog({ open, onOpenChange }: WaitlistDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    phone: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Waitlist submission:", formData);
    toast({
      title: "Welcome to the waitlist!",
      description: "We'll be in touch soon with next steps.",
    });
    onOpenChange(false);
    setFormData({ name: "", email: "", college: "", phone: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join the Waitlist</DialogTitle>
          <DialogDescription>
            Be among the first to join our next cohort. Limited seats available.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              data-testid="input-email"
            />
          </div>
          <div>
            <Label htmlFor="college">College/University</Label>
            <Input
              id="college"
              placeholder="e.g., IIT Delhi, BITS Pilani"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              required
              data-testid="input-college"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              data-testid="input-phone"
            />
          </div>
          <Button type="submit" className="w-full" data-testid="button-submit-waitlist">
            Join Waitlist
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
