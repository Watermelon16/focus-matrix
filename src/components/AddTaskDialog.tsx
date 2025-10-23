import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DateTimePicker } from "./DateTimePicker";

const PRIORITY_OPTIONS = [
  { value: "UI", label: "🔴 Khẩn cấp & Quan trọng" },
  { value: "UNI", label: "🟡 Quan trọng nhưng không khẩn cấp" },
  { value: "NUI", label: "🟢 Khẩn cấp nhưng không quan trọng" },
  { value: "NUNI", label: "🔵 Không khẩn cấp & không quan trọng" },
];

export function AddTaskDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"UI" | "UNI" | "NUI" | "NUNI">("UNI");

  const createTask = trpc.tasks.create.useMutation({
    onSuccess: () => {
      toast.success("Đã thêm công việc");
      setOpen(false);
      resetForm();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  const resetForm = () => {
    setTitle("");
    setNotes("");
    setDueDate("");
    setPriority("UNI");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên công việc");
      return;
    }

    createTask.mutate({
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm công việc
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm công việc mới</DialogTitle>
            <DialogDescription>
              Tạo công việc mới và phân loại theo ma trận Eisenhower
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
             <Label htmlFor="due-date">Hạn hoàn thành (tùy chọn)</Label>
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
            <Button type="submit" disabled={createTask.isPending}>
              {createTask.isPending ? "Đang thêm..." : "Thêm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
