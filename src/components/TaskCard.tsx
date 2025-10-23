import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useAuth } from "@/contexts/AuthContext";
import { Bell, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EditTaskDialog } from "./EditTaskDialog";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  
  const { user } = useAuth();

  const markDone = trpc.tasks.update.useMutation({
    onSuccess: () => {
      onUpdate();
      toast.success(task.completed ? "Đánh dấu chưa hoàn thành" : "Đã hoàn thành!");
    },
  });

  const deleteTask = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      onUpdate();
      toast.success("Đã xóa công việc");
    },
  });

  const createReminder = trpc.reminders.create.useMutation({
    onSuccess: () => {
      setShowReminderDialog(false);
      setReminderTime("");
      toast.success("Đã đặt lời nhắc");
    },
  });

  const handleToggleDone = () => {
    markDone.mutate({ 
      id: task.id, 
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : undefined
    });
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc muốn xóa công việc này?")) {
      deleteTask.mutate({ id: task.id });
    }
  };

  const handleSetReminder = () => {
    if (!reminderTime) {
      toast.error("Vui lòng chọn thời gian nhắc");
      return;
    }

    createReminder.mutate({
      taskId: task.id,
      reminderTime,
      email: customEmail.trim() || undefined,
    });
  };

  // Format due date
  const formatDueDate = () => {
    if (!task.dueDate) return null;

    const due = new Date(task.dueDate);
    const formatted = due.toLocaleString("vi-VN", {
      timeZone: "Asia/Singapore",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    let variant: "default" | "destructive" | "secondary" = "secondary";
    let label = "";

    if (diffDays < 0) {
      variant = "destructive";
      label = `Quá hạn ${Math.abs(diffDays)} ngày`;
    } else if (diffDays === 0) {
      variant = "destructive";
      label = "Hạn hôm nay";
    } else if (diffDays <= 3) {
      variant = "default";
      label = `Còn ${diffDays} ngày`;
    } else {
      variant = "secondary";
      label = `Còn ${diffDays} ngày`;
    }

    return { formatted, variant, label };
  };

  const dueInfo = formatDueDate();

  return (
    <>
      <div className="p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleDone}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div
              className={`font-medium ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </div>

            {task.notes && (
              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.notes}
              </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
              {dueInfo && (
                <div className="text-sm text-muted-foreground">
                  📅 {dueInfo.formatted}
                </div>
              )}
              <div className="flex items-center gap-2 flex-wrap">
                {dueInfo && (
                  <Badge variant={dueInfo.variant} className="text-xs">
                    {dueInfo.label}
                  </Badge>
                )}
                {task.rolloverCount > 0 && (
                  <Badge variant="outline" className="text-xs">
                    🔄 Rollover: {task.rolloverCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <EditTaskDialog task={task} onSuccess={onUpdate} />
              <DropdownMenuItem onClick={() => setShowReminderDialog(true)}>
                <Bell className="mr-2 h-4 w-4" />
                Đặt lời nhắc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đặt lời nhắc</DialogTitle>
            <DialogDescription>
              Chọn thời gian bạn muốn nhận email nhắc nhở về công việc này
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Thời gian nhắc</Label>
              <Input
                id="reminder-time"
                type="datetime-local"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="custom-email">Email nhận thông báo (tùy chọn)</Label>
              <Input
                id="custom-email"
                type="email"
                placeholder={user?.email || "Nhập email..."}
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Mặc định: {user?.email || "Email đăng ký"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSetReminder} disabled={createReminder.isPending}>
              {createReminder.isPending ? "Đang đặt..." : "Đặt lời nhắc"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
