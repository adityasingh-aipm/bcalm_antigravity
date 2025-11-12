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

interface ScheduleCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ScheduleCallDialog({ open, onOpenChange }: ScheduleCallDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    phone: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Schedule call submission:", formData);
    toast({
      title: "Call scheduled!",
      description: "Our team will reach out to you within 24 hours.",
    });
    onOpenChange(false);
    setFormData({ name: "", email: "", college: "", phone: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Call</DialogTitle>
          <DialogDescription>
            Speak with our team to learn more about the program and ask any questions.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="call-name">Full Name</Label>
            <Input
              id="call-name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              data-testid="input-call-name"
            />
          </div>
          <div>
            <Label htmlFor="call-email">Email</Label>
            <Input
              id="call-email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              data-testid="input-call-email"
            />
          </div>
          <div>
            <Label htmlFor="call-college">College/University</Label>
            <Input
              id="call-college"
              placeholder="e.g., IIT Delhi, BITS Pilani"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              required
              data-testid="input-call-college"
            />
          </div>
          <div>
            <Label htmlFor="call-phone">Phone Number</Label>
            <Input
              id="call-phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              data-testid="input-call-phone"
            />
          </div>
          <Button type="submit" className="w-full" data-testid="button-submit-call">
            Request Call
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
