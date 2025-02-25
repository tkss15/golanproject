"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TrashIcon, PencilIcon } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface Milestone {
  id?: number;
  name: string;
  date: Date;
}

export default function MilestonesDialog() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [open, setOpen] = useState(false);

  const addMilestone = () => {
    setMilestones([...milestones, { name: "אבן דרך חדשה", date: new Date() }]);
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: any) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  const deleteMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // כאן תוכל להוסיף את הלוגיקה לשמירת אבני הדרך
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">ניהול אבני דרך</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>ניהול אבני דרך</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={addMilestone}>הוסף אבן דרך</Button>
          </div>

          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-4">
                <Input
                  value={milestone.name}
                  onChange={(e) => updateMilestone(index, "name", e.target.value)}
                  placeholder="שם אבן הדרך"
                />
                <DatePicker
                  date={milestone.date}
                  setDate={(date) => updateMilestone(index, "date", date)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMilestone(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleSave}>שמור שינויים</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
