import { useState } from "react";
import ScheduleCallDialog from '../ScheduleCallDialog';
import { Button } from "@/components/ui/button";

export default function ScheduleCallDialogExample() {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Schedule Call Dialog</Button>
      <ScheduleCallDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
