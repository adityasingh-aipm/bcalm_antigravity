import { useState } from "react";
import WaitlistDialog from '../WaitlistDialog';
import { Button } from "@/components/ui/button";

export default function WaitlistDialogExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Waitlist Dialog</Button>
      <WaitlistDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
