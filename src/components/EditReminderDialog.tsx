import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { Edit, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Reminder } from "@/types";

interface EditReminderDialogProps {
  reminder: Reminder;
  onSuccess: () => void;
}

export function EditReminderDialog({ reminder, onSuccess }: EditReminderDialogProps) {
  const [open, setOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState(
    new Date(reminder.reminderTime).toISOString().slice(0, 16)
  );
  const [email, setEmail] = useState(reminder.email || "");

  const updateReminder = trpc.reminders.update.useMutation({
    onSuccess: () => {
      toast.success("Đã cập nhật lời nhắc");
      setOpen(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTime) {
      toast.error("Vui lòng chọn thời gian nhắc");
      return;
    }

    updateReminder.mutate({
      id: reminder.id,
      reminderTime: new Date(reminderTime).toISOString(),
      email: email.trim() || undefined,
    });
  };

  const handleOpen = () => {
    setReminderTime(new Date(reminder.reminderTime).toISOString().slice(0, 16));
    setEmail(reminder.email || "");
    setOpen(true);
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleOpen}>
        <Edit className="h-4 w-4" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Chỉnh sửa lời nhắc
              </DialogTitle>
              <DialogDescription>
                Cập nhật thời gian và email nhận thông báo
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reminder-time">Thời gian nhắc *</Label>
                <Input
                  id="reminder-time"
                  type="datetime-local"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email nhận thông báo</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email nhận thông báo"
                />
                <p className="text-xs text-muted-foreground">
                  Để trống để sử dụng email mặc định
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateReminder.isPending}>
                {updateReminder.isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
