import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils";

type ViewType = "day" | "week" | "month";

interface TimeBlock {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  task: string;
}

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [viewType, setViewType] = useState<ViewType>("week");

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getDaysToDisplay = () => {
    if (viewType === "day") return [selectedDate];
    if (viewType === "week") return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    return monthDays;
  };
  
  const daysToDisplay = getDaysToDisplay();
  const timeSlots = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );

  useEffect(() => {
    const stored = localStorage.getItem("timeBlocks");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTimeBlocks(parsed.map((block: any) => ({
        ...block,
        date: new Date(block.date)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("timeBlocks", JSON.stringify(timeBlocks));
  }, [timeBlocks]);

  const addTimeBlock = () => {
    if (newTask.trim()) {
      const block: TimeBlock = {
        id: Date.now().toString(),
        date: selectedDate,
        startTime,
        endTime,
        task: newTask.trim(),
      };
      setTimeBlocks([...timeBlocks, block]);
      setNewTask("");
      setStartTime("09:00");
      setEndTime("10:00");
      setIsDialogOpen(false);
    }
  };

  const deleteTimeBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== id));
  };

  const getBlocksForDay = (day: Date) => {
    return timeBlocks.filter(block => isSameDay(new Date(block.date), day));
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (viewType === "day") {
      setSelectedDate(addDays(selectedDate, direction === 'next' ? 1 : -1));
    } else if (viewType === "week") {
      setSelectedDate(addDays(selectedDate, direction === 'next' ? 7 : -7));
    } else {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      setSelectedDate(newDate);
    }
  };

  const getHeaderText = () => {
    if (viewType === "day") return format(selectedDate, 'MMMM d, yyyy');
    if (viewType === "week") return `${format(weekStart, 'MMMM d')} - ${format(addDays(weekStart, 6), 'MMMM d, yyyy')}`;
    return format(selectedDate, 'MMMM yyyy');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Calendar
            </h1>
            <p className="text-muted-foreground mt-1">
              {getHeaderText()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('prev')} variant="outline" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-1 border rounded-md p-1 bg-background/50">
              <Button
                onClick={() => setViewType("day")}
                variant={viewType === "day" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  viewType === "day" && "bg-gradient-to-r from-primary to-accent"
                )}
              >
                Day
              </Button>
              <Button
                onClick={() => setViewType("week")}
                variant={viewType === "week" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  viewType === "week" && "bg-gradient-to-r from-primary to-accent"
                )}
              >
                Week
              </Button>
              <Button
                onClick={() => setViewType("month")}
                variant={viewType === "month" ? "default" : "ghost"}
                size="sm"
                className={cn(
                  viewType === "month" && "bg-gradient-to-r from-primary to-accent"
                )}
              >
                Month
              </Button>
            </div>
            <Button onClick={() => navigate('next')} variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Time Block
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Time Block</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Task</label>
                    <Input
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="Enter task name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input
                      type="date"
                      value={format(selectedDate, 'yyyy-MM-dd')}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Start Time</label>
                      <Input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">End Time</label>
                      <Input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={addTimeBlock}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90"
                  >
                    Create Block
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card className="p-4 border-0 bg-card/80 backdrop-blur-sm shadow-lg overflow-auto max-h-[calc(100vh-300px)]">
          <div className={cn(
            "grid gap-2",
            viewType === "day" ? "grid-cols-2" : viewType === "week" ? "grid-cols-8" : "grid-cols-8"
          )}>
            {/* Time Column Header */}
            <div className="text-sm font-medium text-muted-foreground p-2">Time</div>
            
            {/* Day Headers */}
            {daysToDisplay.map((day) => (
              <div
                key={day.toString()}
                className={cn(
                  "text-center p-2 rounded-lg",
                  isSameDay(day, new Date()) && "bg-primary/10"
                )}
              >
                <div className="text-xs font-medium text-muted-foreground">
                  {format(day, 'EEE')}
                </div>
                <div className={cn(
                  "text-lg font-semibold mt-1",
                  isSameDay(day, new Date()) && "text-primary"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}

            {/* Time Slots */}
            {timeSlots.map((time) => (
              <>
                <div key={time} className="text-xs text-muted-foreground p-2 border-t border-border/50">
                  {time}
                </div>
                {daysToDisplay.map((day) => {
                  const dayBlocks = getBlocksForDay(day);
                  const blockInSlot = dayBlocks.find(
                    block => block.startTime.startsWith(time.split(':')[0])
                  );
                  
                  return (
                    <div
                      key={`${day}-${time}`}
                      className="min-h-[60px] border-t border-border/50 p-1"
                    >
                      {blockInSlot && (
                        <Card className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30 h-full animate-in fade-in slide-in-from-top-2">
                          <div className="flex items-start justify-between gap-1">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">
                                {blockInSlot.task}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {blockInSlot.startTime} - {blockInSlot.endTime}
                              </div>
                            </div>
                            <Button
                              onClick={() => deleteTimeBlock(blockInSlot.id)}
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </Card>
                      )}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Calendar;
