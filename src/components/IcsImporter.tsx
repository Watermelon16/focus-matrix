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
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { Calendar, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ICSEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  description?: string;
}

export function IcsImporter({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<ICSEvent[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  const createTask = trpc.tasks.create.useMutation();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        // Simple ICS parser - in a real app you'd use a proper library
        const icsData = event.target?.result as string;
        const lines = icsData.split('\n');
        const parsedEvents: ICSEvent[] = [];
        let currentEvent: Partial<ICSEvent> = {};
        let inEvent = false;

        for (const line of lines) {
          const trimmed = line.trim();
          
          if (trimmed === 'BEGIN:VEVENT') {
            inEvent = true;
            currentEvent = {};
          } else if (trimmed === 'END:VEVENT' && inEvent) {
            if (currentEvent.id && currentEvent.title && currentEvent.start) {
              const startDate = new Date(currentEvent.start);
              const now = new Date();
              const thirtyDaysLater = new Date();
              thirtyDaysLater.setDate(now.getDate() + 30);

              // Include events in the next 30 days (more flexible)
              if (startDate >= now && startDate <= thirtyDaysLater) {
                parsedEvents.push({
                  id: currentEvent.id,
                  title: currentEvent.title,
                  start: currentEvent.start,
                  end: currentEvent.end,
                  description: currentEvent.description,
                });
              }
            }
            inEvent = false;
            currentEvent = {};
          } else if (inEvent) {
            if (trimmed.startsWith('UID:')) {
              currentEvent.id = trimmed.substring(4);
            } else if (trimmed.startsWith('SUMMARY:')) {
              currentEvent.title = trimmed.substring(8);
            } else if (trimmed.startsWith('DTSTART:')) {
              const dateStr = trimmed.substring(8);
              // Convert ICS date format to ISO
              if (dateStr.length >= 8) {
                const year = dateStr.substring(0, 4);
                const month = dateStr.substring(4, 6);
                const day = dateStr.substring(6, 8);
                const hour = dateStr.substring(9, 11) || '00';
                const minute = dateStr.substring(11, 13) || '00';
                currentEvent.start = `${year}-${month}-${day}T${hour}:${minute}:00`;
              }
            } else if (trimmed.startsWith('DTEND:')) {
              const dateStr = trimmed.substring(6);
              if (dateStr.length >= 8) {
                const year = dateStr.substring(0, 4);
                const month = dateStr.substring(4, 6);
                const day = dateStr.substring(6, 8);
                const hour = dateStr.substring(9, 11) || '00';
                const minute = dateStr.substring(11, 13) || '00';
                currentEvent.end = `${year}-${month}-${day}T${hour}:${minute}:00`;
              }
            } else if (trimmed.startsWith('DESCRIPTION:')) {
              currentEvent.description = trimmed.substring(12);
            }
          }
        }

        setEvents(parsedEvents);
        setSelected(new Set(parsedEvents.map((e) => e.id)));
        toast.success(`Đã tìm thấy ${parsedEvents.length} sự kiện trong 30 ngày tới`);
      } catch (error) {
        console.error("ICS parse error:", error);
        toast.error("Không thể đọc file ICS. Vui lòng kiểm tra định dạng file.");
      }
    };

    reader.readAsText(file);
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleImport = async () => {
    setImporting(true);
    const selectedEvents = events.filter((e) => selected.has(e.id));

    try {
      for (const event of selectedEvents) {
        await createTask.mutateAsync({
          title: event.title,
          notes: event.description,
          dueDate: event.start,
          priority: "UNI", // Default to Important but not urgent
        });
      }

      toast.success(`Đã nhập ${selectedEvents.length} sự kiện`);
      setOpen(false);
      setEvents([]);
      setSelected(new Set());
      onSuccess();
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Có lỗi xảy ra khi nhập sự kiện");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          Import ICS
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import lịch từ file ICS</DialogTitle>
          <DialogDescription>
            Tải lên file .ics và chọn các sự kiện muốn thêm vào Focus Matrix
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {events.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <label htmlFor="ics-upload" className="cursor-pointer">
                <span className="text-sm text-muted-foreground">
                  Kéo thả file ICS hoặc{" "}
                  <span className="text-primary underline">chọn file</span>
                </span>
                <input
                  id="ics-upload"
                  type="file"
                  accept=".ics"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">
                  {selected.size} / {events.length} sự kiện được chọn
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEvents([]);
                    setSelected(new Set());
                  }}
                >
                  Tải file khác
                </Button>
              </div>
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => toggleSelection(event.id)}
                >
                  <Checkbox
                    checked={selected.has(event.id)}
                    onCheckedChange={() => toggleSelection(event.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.start).toLocaleString("vi-VN")}
                    </div>
                    {event.description && (
                      <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {events.length > 0 && (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setEvents([]);
                setSelected(new Set());
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleImport}
              disabled={selected.size === 0 || importing}
            >
              {importing ? "Đang nhập..." : `Nhập ${selected.size} sự kiện`}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
