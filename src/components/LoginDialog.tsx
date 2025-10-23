import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { LogIn, UserPlus } from "lucide-react";

export function LoginDialog() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Đăng nhập
        if (!email || !password) {
          toast.error("Vui lòng nhập đầy đủ thông tin");
          return;
        }
        
        // Mock login - trong thực tế sẽ gọi API
        const user = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0], // Lấy tên từ email
          email: email
        };
        
        login(user);
        toast.success("Đăng nhập thành công!");
      } else {
        // Đăng ký
        if (!email || !password || !name) {
          toast.error("Vui lòng nhập đầy đủ thông tin");
          return;
        }
        
        if (password !== confirmPassword) {
          toast.error("Mật khẩu xác nhận không khớp");
          return;
        }
        
        if (password.length < 6) {
          toast.error("Mật khẩu phải có ít nhất 6 ký tự");
          return;
        }
        
        // Mock register - trong thực tế sẽ gọi API
        const user = {
          id: `user-${Date.now()}`,
          name: name,
          email: email
        };
        
        login(user);
        toast.success("Đăng ký thành công!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LogIn className="mr-2 h-4 w-4" />
          Đăng nhập
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? "Đăng nhập" : "Đăng ký tài khoản"}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Nhập thông tin để đăng nhập vào tài khoản của bạn"
              : "Tạo tài khoản mới để sử dụng ứng dụng"
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                required={!isLogin}
              />
            </div>
          )}
          
          <DialogFooter className="flex-col gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang xử lý..." : (isLogin ? "Đăng nhập" : "Đăng ký")}
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Chưa có tài khoản? Đăng ký
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Đã có tài khoản? Đăng nhập
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
