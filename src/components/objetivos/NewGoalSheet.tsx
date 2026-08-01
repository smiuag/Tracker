"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GoalForm } from "./GoalForm";

export function NewGoalSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button className="gap-1.5" />}>
        <Plus className="size-4" />
        Nuevo objetivo
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Nuevo objetivo</SheetTitle>
        </SheetHeader>
        <div className="px-4">
          <GoalForm onSaved={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
