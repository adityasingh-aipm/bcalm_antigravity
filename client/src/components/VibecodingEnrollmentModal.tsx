import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const enrollmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian phone number"),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

interface VibecodingEnrollmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VibecodingEnrollmentModal({ open, onOpenChange }: VibecodingEnrollmentModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentSchema),
  });

  const onSubmit = async (data: EnrollmentFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          source: "vibecoding",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit enrollment");
      }

      toast({
        title: "Success!",
        description: "Your enrollment request has been received. We'll contact you soon!",
      });

      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit enrollment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1a0000] border-orange-500/20 text-white">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">Join Vibecoding</DialogTitle>
          <DialogDescription className="text-white/70">
            Get started on your 14-day journey to master web development
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              {...register("name")}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={isSubmitting}
              data-testid="input-enrollment-name"
            />
            {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">
              Phone Number
            </Label>
            <Input
              id="phone"
              placeholder="Enter your 10-digit phone number"
              {...register("phone")}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={isSubmitting}
              data-testid="input-enrollment-phone"
            />
            {errors.phone && <p className="text-sm text-red-400">{errors.phone.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full font-semibold"
            style={{
              background: isSubmitting ? "rgba(255, 107, 53, 0.5)" : "linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFA500 100%)",
              border: "1px solid rgba(255, 107, 53, 0.3)",
            }}
            data-testid="button-submit-enrollment"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Enroll Now"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
