"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Button from "@/components/atom/Button";
import EmailBroadcast from "./EmailBroadcast";

export default function EmailBroadcastDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button format="primary">Account Email</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <EmailBroadcast />
      </DialogContent>
    </Dialog>
  );
}
