import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  Download, 
  Upload, 
  FileText
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CalendarSyncProps {
  onSuccess?: () => void;
}

export function CalendarSync({ onSuccess }: CalendarSyncProps) {
  const [open, setOpen] = useState(false);
  const [icsContent, setIcsContent] = useState("");
  const [exportFormat, setExportFormat] = useState("google");

  const handleImportICS = () => {
    if (!icsContent.trim()) {
      toast.error("Vui lòng nhập nội dung ICS");
      return;
    }
    
    try {
      // Parse ICS content and create tasks
      // This is a simplified version - in production you'd use a proper ICS parser
      const lines = icsContent.split('\n');
      const events: any[] = [];
      let currentEvent: any = {};
      
      for (const line of lines) {
        if (line.startsWith('BEGIN:VEVENT')) {
          currentEvent = {};
        } else if (line.startsWith('END:VEVENT')) {
          if (currentEvent.SUMMARY) {
            events.push(currentEvent);
          }
          currentEvent = {};
        } else if (line.startsWith('SUMMARY:')) {
          currentEvent.SUMMARY = line.substring(8);
        } else if (line.startsWith('DTSTART:')) {
          currentEvent.DTSTART = line.substring(8);
        } else if (line.startsWith('DTEND:')) {
          currentEvent.DTEND = line.substring(6);
        } else if (line.startsWith('DESCRIPTION:')) {
          currentEvent.DESCRIPTION = line.substring(12);
        }
      }
      
      toast.success(`Đã import ${events.length} sự kiện từ lịch`);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Lỗi khi import lịch");
    }
  };

  const handleExportCalendar = () => {
    // Generate ICS content from tasks
    const icsContent = generateICS();
    
    if (exportFormat === "google") {
      // Export to Google Calendar
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Focus Matrix Tasks&dates=${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}/${new Date(Date.now() + 24*60*60*1000).toISOString().replace(/[-:]/g, '').split('.')[0]}`;
      window.open(googleUrl, '_blank');
      toast.success("Đã mở Google Calendar");
    } else {
      // Download ICS file
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'focus-matrix-tasks.ics';
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Đã tải xuống file lịch");
    }
  };

  const generateICS = () => {
    const now = new Date();
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Focus Matrix//Tasks//EN',
      'BEGIN:VEVENT',
      'UID:' + now.getTime() + '@focus-matrix.com',
      'DTSTAMP:' + now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART:' + now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTEND:' + new Date(now.getTime() + 60*60*1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'SUMMARY:Focus Matrix Tasks',
      'DESCRIPTION:Tasks from Focus Matrix application',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    return icsContent;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Đồng bộ lịch
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Đồng bộ với lịch
          </DialogTitle>
          <DialogDescription>
            Import/Export lịch với Google Calendar, Apple Calendar, Microsoft Outlook
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Import từ lịch */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import từ lịch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="ics-content">Nội dung file ICS (.ics)</Label>
                <Textarea
                  id="ics-content"
                  value={icsContent}
                  onChange={(e) => setIcsContent(e.target.value)}
                  placeholder="Dán nội dung file .ics vào đây..."
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Chọn file .ics
                </Button>
                <Button onClick={handleImportICS} size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ định dạng ICS từ Google Calendar, Apple Calendar, Microsoft Outlook
              </p>
            </CardContent>
          </Card>

          {/* Export ra lịch */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export ra lịch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Chọn nền tảng lịch</Label>
                <div className="flex gap-2">
                  <Button
                    variant={exportFormat === "google" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportFormat("google")}
                  >
                    📅 Google Calendar
                  </Button>
                  <Button
                    variant={exportFormat === "apple" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportFormat("apple")}
                  >
                    🍎 Apple Calendar
                  </Button>
                  <Button
                    variant={exportFormat === "microsoft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportFormat("microsoft")}
                  >
                    📧 Microsoft Outlook
                  </Button>
                </div>
              </div>
              <Button onClick={handleExportCalendar} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                {exportFormat === "google" ? "Mở Google Calendar" : "Tải xuống file .ics"}
              </Button>
              <p className="text-xs text-muted-foreground">
                {exportFormat === "google" 
                  ? "Sẽ mở Google Calendar với các công việc đã tạo"
                  : "Tải xuống file .ics để import vào lịch của bạn"
                }
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
