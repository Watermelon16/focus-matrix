import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { QuickAddTask } from "./QuickAddTask";

interface EisenhowerMatrixProps {
  tasks: Task[];
  onRefresh: () => void;
}

const PRIORITY_CONFIG = {
  UI: {
    icon: "🔴",
    label: "Khẩn cấp & Quan trọng",
    color: "bg-red-50 border-red-200",
    badgeColor: "bg-red-500",
    iconColor: "text-red-500",
  },
  UNI: {
    icon: "🟡",
    label: "Quan trọng nhưng không khẩn cấp",
    color: "bg-yellow-50 border-yellow-200",
    badgeColor: "bg-yellow-500",
    iconColor: "text-yellow-500",
  },
  NUI: {
    icon: "🟢",
    label: "Khẩn cấp nhưng không quan trọng",
    color: "bg-green-50 border-green-200",
    badgeColor: "bg-green-500",
    iconColor: "text-green-500",
  },
  NUNI: {
    icon: "🔵",
    label: "Không khẩn cấp & không quan trọng",
    color: "bg-blue-50 border-blue-200",
    badgeColor: "bg-blue-500",
    iconColor: "text-blue-500",
  },
};

export function EisenhowerMatrix({ tasks, onRefresh }: EisenhowerMatrixProps) {
  const groupedTasks = {
    UI: tasks.filter((t) => t.priority === "UI"),
    UNI: tasks.filter((t) => t.priority === "UNI"),
    NUI: tasks.filter((t) => t.priority === "NUI"),
    NUNI: tasks.filter((t) => t.priority === "NUNI"),
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
        <Card key={priority} className={`${config.color} border-2`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="text-lg">{config.icon}</span>
              {config.label}
              <Badge variant="outline" className="ml-auto">
                {groupedTasks[priority as keyof typeof groupedTasks].length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {groupedTasks[priority as keyof typeof groupedTasks].length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Không có công việc
                </p>
              ) : (
                groupedTasks[priority as keyof typeof groupedTasks].map((task) => (
                  <TaskCard key={task.id} task={task} onUpdate={onRefresh} />
                ))
              )}
              <QuickAddTask
                priority={priority as "UI" | "UNI" | "NUI" | "NUNI"}
                onSuccess={onRefresh}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
