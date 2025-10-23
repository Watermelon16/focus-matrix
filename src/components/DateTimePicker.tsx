import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Chọn ngày & giờ",
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );
  const [selectedHour, setSelectedHour] = useState<string>(
    value ? new Date(value).getHours().toString() : "9"
  );
  const [selectedMinute, setSelectedMinute] = useState<string>(
    value ? new Date(value).getMinutes().toString() : "0"
  );

  const handleQuickSelect = (days: number) => {
    const date = addDays(new Date(), days);
    const withTime = setMinutes(setHours(date, parseInt(selectedHour)), parseInt(selectedMinute));
    setSelectedDate(withTime);
    onChange(withTime.toISOString());
    setOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    const withTime = setMinutes(setHours(date, parseInt(selectedHour)), parseInt(selectedMinute));
    setSelectedDate(withTime);
  };

  const handleTimeChange = (hour: string, minute: string) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    if (selectedDate) {
      const withTime = setMinutes(setHours(selectedDate, parseInt(hour)), parseInt(minute));
      setSelectedDate(withTime);
      onChange(withTime.toISOString());
    }
  };

  const handleApply = () => {
    if (selectedDate) {
      const withTime = setMinutes(setHours(selectedDate, parseInt(selectedHour)), parseInt(selectedMinute));
      onChange(withTime.toISOString());
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? (
            format(new Date(value), "PPP 'lúc' HH:mm", { locale: vi })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="text-sm font-medium mb-2">Chọn nhanh</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(0)}
            >
              Hôm nay
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(1)}
            >
              Ngày mai
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(7)}
            >
              Tuần sau
            </Button>
          </div>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          locale={vi}
        />

        <div className="p-3 border-t">
          <div className="text-sm font-medium mb-2">Chọn giờ</div>
          <div className="flex gap-2">
            <Select value={selectedHour} onValueChange={(h) => handleTimeChange(h, selectedMinute)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Giờ" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="flex items-center">:</span>
            <Select value={selectedMinute} onValueChange={(m) => handleTimeChange(selectedHour, m)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Phút" />
              </SelectTrigger>
              <SelectContent>
                {[0, 15, 30, 45].map((m) => (
                  <SelectItem key={m} value={m.toString()}>
                    {m.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-3 border-t">
          <Button className="w-full" onClick={handleApply}>
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
