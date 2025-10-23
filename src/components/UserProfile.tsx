import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { User, Settings, Lock, Trash2, AlertTriangle } from "lucide-react";
import { createOrUpdateJsonFile, readJsonFile, datasetToBase64, base64ToDataset } from "@/lib/drive";
import { useState } from "react";
import { toast } from "sonner";

interface UserProfileProps {
  onRefresh?: () => void;
}

export function UserProfile({ onRefresh }: UserProfileProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [driveFileId, setDriveFileId] = useState<string | null>(localStorage.getItem('drive_file_id') || null);

  const deleteAllTasks = trpc.tasks.deleteAll.useMutation({
    onSuccess: () => {
      toast.success("Đã xóa tất cả công việc");
      setShowResetDialog(false);
      onRefresh?.();
    },
    onError: (error: any) => {
      toast.error(`Lỗi: ${error.message}`);
    },
  });

  // Replace datasets – used for restore
  const replaceTasks = trpc.tasks.replaceAll.useMutation();
  const replaceReminders = trpc.reminders.replaceAll.useMutation();

  // NOTE: For demo, we reuse Google One Tap credential (if available) as token placeholder
  const getAccessToken = (): string | null => {
    // In production, implement OAuth Code flow to get access token
    const token = (window as any).__googleAccessToken as string | undefined;
    return token || null;
  };

  const handleBackupToDrive = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      toast.error("Cần kết nối Google để sao lưu");
      return;
    }
    try {
      // Gather current data from trpc mocks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tasks: any[] = (trpc as any).tasks.list.useQuery().data || [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reminders: any[] = (trpc as any).reminders.list.useQuery().data || [];
      const payload = datasetToBase64({ tasks, reminders });
      const name = user?.email === 'phuonglh43@gmail.com' ? 'focus-matrix-system-backup.json' : 'focus-matrix-user-backup.json';
      const res = await createOrUpdateJsonFile(accessToken, driveFileId, name, payload);
      setDriveFileId(res.id);
      localStorage.setItem('drive_file_id', res.id);
      toast.success("Đã sao lưu lên Google Drive");
    } catch (e: any) {
      toast.error(`Lỗi sao lưu: ${e.message}`);
    }
  };

  const handleRestoreFromDrive = async () => {
    const accessToken = getAccessToken();
    if (!accessToken || !driveFileId) {
      toast.error("Chưa có kết nối Google hoặc file sao lưu");
      return;
    }
    try {
      const b64 = await readJsonFile(accessToken, driveFileId);
      const dataset = base64ToDataset(b64);
      replaceTasks.mutate({ tasks: dataset.tasks || [] });
      replaceReminders.mutate({ reminders: dataset.reminders || [] });
      onRefresh?.();
      toast.success("Khôi phục dữ liệu thành công");
    } catch (e: any) {
      toast.error(`Lỗi khôi phục: ${e.message}`);
    }
  };

  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên");
      return;
    }
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }
    
    // Update user profile
    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim()
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success("Đã cập nhật thông tin cá nhân");
    setOpen(false);
  };


  const handleChangePassword = () => {
    if (!currentPassword) {
      toast.error("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (!newPassword) {
      toast.error("Vui lòng nhập mật khẩu mới");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    
    // In a real app, you would validate current password and update
    toast.success("Đã thay đổi mật khẩu thành công");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleResetAll = () => {
    deleteAllTasks.mutate();
  };

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <User className="mr-2 h-4 w-4" />
          Hồ sơ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quản lý hồ sơ
          </DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân và bảo mật tài khoản
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Thông tin cá nhân */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên hiển thị</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên của bạn"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                />
              </div>
            </CardContent>
          </Card>

        {/* Sao lưu & Khôi phục Google Drive */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              Sao lưu & Khôi phục (Google Drive)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleBackupToDrive}>
                Sao lưu lên Drive
              </Button>
              <Button variant="outline" size="sm" onClick={handleRestoreFromDrive} disabled={!driveFileId}>
                Khôi phục từ Drive
              </Button>
            </div>
            {!driveFileId ? (
              <p className="text-xs text-muted-foreground">Chưa có file sao lưu. Hãy bấm "Sao lưu lên Drive".</p>
            ) : (
              <p className="text-xs text-muted-foreground">Đã liên kết file: {driveFileId}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Lưu ý: Cần đăng nhập Google One Tap để cấp quyền tạm thời. Phiên bản này chỉ là demo client-side.
            </p>
          </CardContent>
        </Card>

          {/* Thay đổi mật khẩu */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Bảo mật
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
              <Button onClick={handleChangePassword} variant="outline" size="sm">
                <Lock className="mr-2 h-4 w-4" />
                Thay đổi mật khẩu
              </Button>
            </CardContent>
          </Card>


          {/* Reset toàn bộ */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                Nguy hiểm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Thao tác này sẽ xóa tất cả công việc và không thể hoàn tác.
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowResetDialog(true)}
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset toàn bộ
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleSaveProfile}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Dialog xác nhận Reset toàn bộ */}
    <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Xác nhận Reset toàn bộ
          </DialogTitle>
          <DialogDescription>
            Thao tác này sẽ xóa TẤT CẢ công việc và không thể hoàn tác. 
            Bạn có chắc chắn muốn tiếp tục?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowResetDialog(false)}>
            Hủy
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleResetAll}
            disabled={deleteAllTasks.isPending}
          >
            {deleteAllTasks.isPending ? "Đang xóa..." : "Xóa tất cả"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
