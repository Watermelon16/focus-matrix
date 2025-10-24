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
import { Plus, Bell } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DateTimePicker } from "./DateTimePicker";
import { Checkbox } from "@/components/ui/checkbox";

const PRIORITY_OPTIONS = [
  { value: "UI", label: "🔴 Khẩn cấp & Quan trọng" },
  { value: "UNI", label: "🟡 Quan trọng nhưng không khẩn cấp" },
  { value: "NUI", label: "🟢 Khẩn cấp nhưng không quan trọng" },
  { value: "NUNI", label: "🔵 Không khẩn cấp & không quan trọng" },
];

const TASK_TYPES = [
  { value: "work", label: "💼 Công việc" },
  { value: "personal", label: "👤 Cá nhân" },
  { value: "health", label: "🏥 Sức khỏe" },
  { value: "learning", label: "📚 Học tập" },
  { value: "family", label: "👨‍👩‍👧‍👦 Gia đình" },
  { value: "other", label: "📝 Khác" },
];

export function AddTaskDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"UI" | "UNI" | "NUI" | "NUNI">("UNI");
  const [taskType, setTaskType] = useState("work");
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderEmail, setReminderEmail] = useState("");
  const [autoClassify, setAutoClassify] = useState(true);

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
    setTaskType("work");
    setEnableReminder(false);
    setReminderTime("");
    setReminderEmail("");
    setAutoClassify(true);
  };

  // Auto-classify function
  const autoClassifyTask = (dueDate: string, taskType: string) => {
    if (!autoClassify) return priority;
    
    const now = new Date();
    const due = dueDate ? new Date(dueDate) : null;
    
    // Check if urgent (within 24 hours or overdue)
    const isUrgent = due && (due.getTime() - now.getTime()) <= 24 * 60 * 60 * 1000;
    
    // Check if important based on task type
    const importantTypes = ['work', 'health', 'family'];
    const isImportant = importantTypes.includes(taskType);
    
    if (isUrgent && isImportant) return "UI";
    if (!isUrgent && isImportant) return "UNI";
    if (isUrgent && !isImportant) return "NUI";
    return "NUNI";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên công việc");
      return;
    }

    if (enableReminder && !reminderTime) {
      toast.error("Vui lòng chọn thời gian nhắc nhở");
      return;
    }

    const finalPriority = autoClassify ? autoClassifyTask(dueDate, taskType) : priority;

    createTask.mutate({
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueDate: dueDate || undefined,
      priority: finalPriority,
      taskType,
      reminder: enableReminder ? {
        time: reminderTime,
        email: reminderEmail || undefined
      } : undefined
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
              <Label htmlFor="task-type">Loại công việc</Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger id="task-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
             <Label htmlFor="due-date">Hạn hoàn thành (tùy chọn)</Label>
            <DateTimePicker
              value={dueDate}
              onChange={setDueDate}
              placeholder="Chọn ngày & giờ deadline"
            />
            </div>
            
            {/* Auto-classify toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auto-classify" 
                checked={autoClassify}
                onCheckedChange={(checked) => setAutoClassify(checked as boolean)}
              />
              <Label htmlFor="auto-classify" className="text-sm">
                Tự động phân loại theo deadline và loại công việc
              </Label>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="priority">Mức độ ưu tiên {autoClassify ? "(tự động)" : "*"}</Label>
              <Select 
                value={priority} 
                onValueChange={(v: any) => setPriority(v)}
                disabled={autoClassify}
              >
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
            
            {/* Reminder section */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="enable-reminder" 
                  checked={enableReminder}
                  onCheckedChange={(checked) => setEnableReminder(checked as boolean)}
                />
                <Label htmlFor="enable-reminder" className="text-sm font-medium">
                  <Bell className="inline mr-1 h-4 w-4" />
                  Đặt lời nhắc
                </Label>
              </div>
              
              {enableReminder && (
                <div className="space-y-3 pl-6">
                  <div className="grid gap-2">
                    <Label htmlFor="reminder-time">Thời gian nhắc nhở</Label>
                    <DateTimePicker
                      value={reminderTime}
                      onChange={setReminderTime}
                      placeholder="Chọn thời gian nhắc nhở"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reminder-email">Email nhắc nhở (tùy chọn)</Label>
                    <Input
                      id="reminder-email"
                      type="email"
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
              )}
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
