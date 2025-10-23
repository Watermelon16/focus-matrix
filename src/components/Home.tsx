import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE } from "@/const";
import { trpc } from "@/lib/trpc";
import { EisenhowerMatrix } from "./EisenhowerMatrix";
import { AddTaskDialog } from "./AddTaskDialog";
import { IcsImporter } from "./IcsImporter";
import { UserProfile } from "./UserProfile";
import { TeamSettings } from "./TeamSettings";
import { SmartDashboard } from "./SmartDashboard";
import { EditReminderDialog } from "./EditReminderDialog";
import { LoginDialog } from "./LoginDialog";
import { AdminDashboard } from "./AdminDashboard";
import { Loader2, LogOut, Trash2, BarChart3, Grid3X3, Users, FileText, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getNow } from "@/lib/date";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTrpcState } from "@/hooks/useTrpcState";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [view, setView] = useState<'matrix' | 'dashboard' | 'admin'>('matrix');
  const refreshKey = useTrpcState(); // Real-time state management
  
  // Debug logs
  console.log('Home render:', { user, loading, isAuthenticated, refreshKey });
  const { data: tasks, isLoading: tasksLoading, refetch } = trpc.tasks.list.useQuery();
  
  const { data: reminders, refetch: refetchReminders } = trpc.reminders.list.useQuery();

  // Force refresh function
  const forceRefresh = () => {
    console.log('Force refresh called');
    refetch();
    // Also trigger custom event
    window.dispatchEvent(new CustomEvent('trpc-state-change'));
  };

  const rollover = trpc.tasks.rollover.useMutation({
    onSuccess: (results: any) => {
      if (results.processed > 0) {
        refetch();
      }
    },
  });
  
  
  const deleteReminder = trpc.reminders.delete.useMutation({
    onSuccess: () => {
      refetchReminders();
      toast.success("Đã xóa lời nhắc");
    },
  });

  // Run rollover on mount
  useEffect(() => {
    if (isAuthenticated) {
      const lastRollover = localStorage.getItem('lastRollover');
      const now = new Date().toISOString();
      const today = now.split('T')[0];
      const lastDay = lastRollover?.split('T')[0];

      if (lastDay !== today) {
        rollover.mutate({ now });
        localStorage.setItem('lastRollover', now);
      }
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">{APP_TITLE}</h1>
            <p className="text-lg text-muted-foreground">
              Quản lý công việc thông minh với Ma trận Eisenhower
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <Badge variant="outline">🔴 Khẩn cấp & Quan trọng</Badge>
              <Badge variant="outline">🟡 Quan trọng</Badge>
              <Badge variant="outline">🟢 Khẩn cấp</Badge>
              <Badge variant="outline">🔵 Không ưu tiên</Badge>
            </div>
          </div>
                  <div className="w-full space-y-3">
                    <LoginDialog />
                  </div>
          <p className="text-xs text-muted-foreground">
            ✅ Offline-first • 🔒 Mã hóa E2EE • ☁️ Sync Google Drive
          </p>
        </div>
      </div>
    );
  }

  const today = getNow().toISOString().split('T')[0];
  const completedToday = tasks?.filter(t => 
    t.completed && 
    t.completedAt && 
    t.completedAt.split('T')[0] === today
  ) || [];
  
  const incompleteToday = tasks?.filter(t => 
    !t.completed &&
    t.dueDate &&
    t.dueDate.split('T')[0] === today
  ) || [];

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const incompleteTasks = totalTasks - completedTasks;


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
            <p className="text-sm text-muted-foreground">
              Xin chào, {user?.name || user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'matrix' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('matrix')}
            >
              <Grid3X3 className="mr-2 h-4 w-4" />
              Ma trận
            </Button>
                    <Button
                      variant={view === 'dashboard' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView('dashboard')}
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant={view === 'admin' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setView('admin')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Quản trị
                    </Button>
            <UserProfile onRefresh={forceRefresh} />
            {/* Team settings - requires Google access token, for demo we render button and ask for login first */}
            <TeamSettings accessToken={(window as any).__googleAccessToken || ''} />
            <Button variant="outline" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Quick Actions Section */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AddTaskDialog onSuccess={forceRefresh} />
                <IcsImporter onSuccess={forceRefresh} />
                <Button
                  variant="outline"
                  onClick={() => setView('dashboard')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Xem báo cáo</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    rollover.mutate({ now: new Date().toISOString() });
                    toast.success("Đã thực hiện rollover");
                  }}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <RotateCcw className="h-6 w-6" />
                  <span className="text-sm">Rollover</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {view === 'matrix' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Ma trận Eisenhower - 3 columns */}
            <div className="lg:col-span-3">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Ma trận Eisenhower</h2>
                <p className="text-sm text-muted-foreground">
                  Phân loại công việc theo mức độ khẩn cấp và quan trọng
                </p>
              </div>
              {tasksLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <EisenhowerMatrix tasks={tasks || []} onRefresh={forceRefresh} />
              )}
            </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-4">
            {/* Thống kê hôm nay */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Hôm nay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Đã hoàn thành</span>
                  <Badge variant="secondary">{completedToday.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Chưa hoàn thành</span>
                  <Badge variant="destructive">{incompleteToday.length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Thống kê tổng quan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tổng quan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tổng công việc</span>
                  <Badge>{totalTasks}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Đã hoàn thành</span>
                  <Badge variant="secondary">{completedTasks}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Chưa hoàn thành</span>
                  <Badge variant="outline">{incompleteTasks}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Lời nhắc đã đặt */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  Lời nhắc
                  <Badge variant="secondary">{reminders?.length || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!reminders || reminders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có lời nhắc nào
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {reminders.map(reminder => {
                      const task = tasks?.find(t => t.id === reminder.taskId);
                      return (
                        <li key={reminder.id} className="text-sm p-2 bg-muted rounded flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{task?.title || "Công việc"}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(reminder.reminderTime).toLocaleString("vi-VN")}
                            </div>
                            {reminder.email && (
                              <div className="text-xs text-muted-foreground truncate">
                                📧 {reminder.email}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <EditReminderDialog 
                              reminder={reminder} 
                              onSuccess={() => refetchReminders()} 
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={() => deleteReminder.mutate({ id: reminder.id })}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
                ) : view === 'dashboard' ? (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-2">Dashboard thông minh</h2>
                      <p className="text-sm text-muted-foreground">
                        Tổng quan và thống kê chi tiết về công việc của bạn
                      </p>
                    </div>
                    {tasksLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <SmartDashboard
                        tasks={tasks || []}
                        reminders={reminders || []}
                        onRefresh={forceRefresh}
                      />
                    )}
                  </div>
                ) : (
                  <AdminDashboard />
                )}
      </main>
    </div>
  );
}
