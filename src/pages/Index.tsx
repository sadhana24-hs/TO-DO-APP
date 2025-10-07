import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = "all" | "active" | "completed";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) {
      setTodos(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      setTodos([newTodo, ...todos]);
      setInputValue("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Tasks
          </h1>
          <p className="text-muted-foreground">Stay organized, get things done</p>
          <div className="mt-4 text-2xl font-semibold text-foreground/80">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit', 
              second: '2-digit' 
            })}
          </div>
        </div>

        {/* Add Todo Card */}
        <Card className="p-6 mb-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="What needs to be done?"
              className="flex-1 border-border/50 focus-visible:ring-primary"
            />
            <Button
              onClick={addTodo}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all shadow-md"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        {/* Filters */}
        <div className="flex gap-2 mb-6 justify-center">
          {(["all", "active", "completed"] as FilterType[]).map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? "default" : "outline"}
              className={cn(
                "capitalize transition-all",
                filter === f && "bg-gradient-to-r from-primary to-accent"
              )}
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            {activeCount} {activeCount === 1 ? "task" : "tasks"} remaining
          </p>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <Card className="p-12 text-center border-0 bg-card/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 opacity-50" />
                <p>
                  {filter === "completed" 
                    ? "No completed tasks yet" 
                    : filter === "active" 
                    ? "No active tasks" 
                    : "No tasks yet. Add one above!"}
                </p>
              </div>
            </Card>
          ) : (
            filteredTodos.map((todo) => (
              <Card
                key={todo.id}
                className={cn(
                  "p-4 border-0 bg-card/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-2",
                  todo.completed && "opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 transition-transform hover:scale-110"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>
                  <span
                    className={cn(
                      "flex-1 transition-all duration-300",
                      todo.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {todo.text}
                  </span>
                  <Button
                    onClick={() => deleteTodo(todo.id)}
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
