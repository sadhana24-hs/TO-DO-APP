import { Link, useLocation } from "react-router-dom";
import { Calendar, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Tasks", icon: CheckSquare },
    { path: "/calendar", label: "Calendar", icon: Calendar },
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TaskFlow
            </h2>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
                    isActive
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
