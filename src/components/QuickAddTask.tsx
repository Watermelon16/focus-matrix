import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DateTimePicker } from "./DateTimePicker";

interface QuickAddTaskProps {
  priority: "UI" | "UNI" | "NUI" | "NUNI";
  onSuccess: () => void;
}

export function QuickAddTask({ priority, onSuccess }: QuickAddTaskProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");

  const createTask = trpc.tasks.create.useMutation({
    onSuccess: () => {
      setTitle("");
      setNotes("");
      setDueDate("");
      setIsAdding(false);
      onSuccess();
      toast.success("Đã thêm công việc");
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

    createTask.mutate({
      title: title.trim(),
      notes: notes.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
    });
  };

  const handleCancel = () => {
    setTitle("");
    setNotes("");
    setDueDate("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full border-dashed"
        onClick={() => setIsAdding(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Thêm nhanh
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-white rounded-lg border">
      <Input
        autoFocus
        placeholder="Tên công việc..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={createTask.isPending}
      />
      
      <Textarea
        placeholder="Ghi chú (tùy chọn)..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={createTask.isPending}
        rows={2}
      />

      <div>
        <label className="text-sm font-medium mb-1 block">Hạn hoàn thành</label>
        <DateTimePicker
          value={dueDate}
          onChange={setDueDate}
          placeholder="Chọn ngày & giờ deadline"
          disabled={createTask.isPending}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          size="sm"
          className="flex-1"
          disabled={createTask.isPending}
        >
          {createTask.isPending ? "Đang thêm..." : "Thêm"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={createTask.isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
