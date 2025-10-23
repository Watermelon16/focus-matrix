import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  CalendarDays,
  CalendarRange
} from "lucide-react";
import { useState } from "react";
import type { Task, Reminder } from "@/types";

interface SmartDashboardProps {
  tasks: Task[];
  reminders: Reminder[];
  onRefresh: () => void;
}

export function SmartDashboard({ tasks, reminders }: SmartDashboardProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  
  // Tính toán thống kê theo thời gian
  const getTimeRangeData = () => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;
    
    switch (timeRange) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }
    
    return { startDate, endDate };
  };

  const { startDate, endDate } = getTimeRangeData();
  
  // Lọc tasks theo thời gian
  const tasksInRange = tasks.filter(task => {
    const taskDate = new Date(task.createdAt);
    return taskDate >= startDate && taskDate <= endDate;
  });
  
  const completedInRange = tasksInRange.filter(t => t.completed).length;
  const totalInRange = tasksInRange.length;
  const completionRate = totalInRange > 0 ? Math.round((completedInRange / totalInRange) * 100) : 0;

  // Thống kê theo priority
  const priorityStats = {
    UI: tasks.filter(t => t.priority === 'UI').length,
    UNI: tasks.filter(t => t.priority === 'UNI').length,
    NUI: tasks.filter(t => t.priority === 'NUI').length,
    NUNI: tasks.filter(t => t.priority === 'NUNI').length,
  };

  // Thống kê hôm nay
  const today = new Date().toISOString().split('T')[0];
  const completedToday = tasks.filter(t => 
    t.completed && 
    t.completedAt && 
    t.completedAt.split('T')[0] === today
  ).length;
  
  const dueToday = tasks.filter(t => 
    !t.completed &&
    t.dueDate &&
    t.dueDate.split('T')[0] === today
  ).length;

  // Thống kê tuần này
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  
  const completedThisWeek = tasks.filter(t => 
    t.completed && 
    t.completedAt && 
    new Date(t.completedAt) >= weekStart &&
    new Date(t.completedAt) <= weekEnd
  ).length;

  // Thống kê quá hạn
  const overdueTasks = tasks.filter(t => 
    !t.completed &&
    t.dueDate &&
    new Date(t.dueDate) < new Date()
  ).length;

  // Thống kê rollover
  const rolloverTasks = tasks.filter(t => t.rolloverCount > 0).length;
  const totalRollovers = tasks.reduce((sum, t) => sum + t.rolloverCount, 0);

  // Thống kê reminders
  const activeReminders = reminders.length;
  const remindersToday = reminders.filter(r => 
    new Date(r.reminderTime).toISOString().split('T')[0] === today
  ).length;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Thống kê theo thời gian</h3>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Hôm nay</SelectItem>
            <SelectItem value="week">Tuần này</SelectItem>
            <SelectItem value="month">Tháng này</SelectItem>
            <SelectItem value="year">Năm này</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Header với tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Tổng công việc</p>
                <p className="text-3xl font-bold">{totalInRange}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Đã hoàn thành</p>
                <p className="text-3xl font-bold">{completedInRange}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Tỷ lệ hoàn thành</p>
                <p className="text-3xl font-bold">{completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-violet-500 to-violet-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-violet-100 text-sm">Lời nhắc</p>
                <p className="text-3xl font-bold">{activeReminders}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ma trận Priority */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Phân bố theo ưu tiên
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-red-500">🔴</span>
                  <span className="text-sm">Khẩn cấp & Quan trọng</span>
                </div>
                <Badge variant="destructive">{priorityStats.UI}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">🟡</span>
                  <span className="text-sm">Quan trọng nhưng không khẩn cấp</span>
                </div>
                <Badge variant="outline" className="border-yellow-200 text-yellow-600">{priorityStats.UNI}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">🟢</span>
                  <span className="text-sm">Khẩn cấp nhưng không quan trọng</span>
                </div>
                <Badge variant="outline" className="border-green-200 text-green-600">{priorityStats.NUI}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">🔵</span>
                  <span className="text-sm">Không ưu tiên</span>
                </div>
                <Badge variant="outline" className="border-blue-200 text-blue-600">{priorityStats.NUNI}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thống kê thời gian */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-cyan-600" />
              </div>
              Thống kê thời gian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm">Hoàn thành hôm nay</span>
                </div>
                <Badge variant="secondary">{completedToday}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm">Hạn hôm nay</span>
                </div>
                <Badge variant="outline">{dueToday}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-sm">Quá hạn</span>
                </div>
                <Badge variant="destructive">{overdueTasks}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm">Hoàn thành tuần này</span>
                </div>
                <Badge variant="secondary">{completedThisWeek}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress và Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Ring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tiến độ hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tỷ lệ hoàn thành</span>
                <span className="text-sm text-muted-foreground">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{completedInRange}</p>
                  <p className="text-xs text-muted-foreground">Hoàn thành</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{totalInRange - completedInRange}</p>
                  <p className="text-xs text-muted-foreground">Chưa hoàn thành</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rollover và Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </div>
              Rollover & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Activity className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm">Công việc rollover</span>
                </div>
                <Badge variant="outline" className="border-orange-200 text-orange-600">{rolloverTasks}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-sm">Tổng rollovers</span>
                </div>
                <Badge variant="destructive">{totalRollovers}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm">Lời nhắc hôm nay</span>
                </div>
                <Badge variant="outline" className="border-blue-200 text-blue-600">{remindersToday}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center">
              <CalendarRange className="h-4 w-4 text-teal-600" />
            </div>
            Hành động nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <Target className="h-3 w-3 text-indigo-600" />
              </div>
              <span className="text-xs">Thêm công việc</span>
            </Button>
            <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
              <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center">
                <Calendar className="h-3 w-3 text-cyan-600" />
              </div>
              <span className="text-xs">Import ICS</span>
            </Button>
            <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
              <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-3 w-3 text-pink-600" />
              </div>
              <span className="text-xs">Xem báo cáo</span>
            </Button>
            <Button variant="outline" size="sm" className="h-12 flex-col gap-1">
              <div className="w-6 h-6 bg-lime-100 rounded-full flex items-center justify-center">
                <Activity className="h-3 w-3 text-lime-600" />
              </div>
              <span className="text-xs">Rollover</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
