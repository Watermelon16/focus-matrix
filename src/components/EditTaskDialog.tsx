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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DateTimePicker } from "./DateTimePicker";
import type { Task } from "@/types";

const PRIORITY_OPTIONS = [
  { value: "UI", label: "🔴 Khẩn cấp & Quan trọng" },
  { value: "UNI", label: "🟡 Quan trọng nhưng không khẩn cấp" },
  { value: "NUI", label: "🟢 Khẩn cấp nhưng không quan trọng" },
  { value: "NUNI", label: "🔵 Không khẩn cấp & không quan trọng" },
];

interface EditTaskDialogProps {
  task: Task;
  onSuccess: () => void;
}

export function EditTaskDialog({ task, onSuccess }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [priority, setPriority] = useState<"UI" | "UNI" | "NUI" | "NUNI">(task.priority);

  const updateTask = trpc.tasks.update.useMutation({
    onSuccess: () => {
      toast.success("Đã cập nhật công việc");
      setOpen(false);
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên công việc");
      return;
    }

    updateTask.mutate({
      id: task.id,
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
    });
  };

  const handleOpen = () => {
    setTitle(task.title);
    setNotes(task.notes || "");
    setDueDate(task.dueDate || "");
    setPriority(task.priority);
    setOpen(true);
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={handleOpen}>
        <Edit className="h-4 w-4" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa công việc</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin công việc
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tên công việc *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Hoàn thành báo cáo"
                  autoFocus
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Thêm mô tả chi tiết..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due-date">Hạn hoàn thành</Label>
                <DateTimePicker
                  value={dueDate}
                  onChange={setDueDate}
                  placeholder="Chọn ngày & giờ deadline"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Mức độ ưu tiên *</Label>
                <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Button type="submit" disabled={updateTask.isPending}>
                {updateTask.isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
