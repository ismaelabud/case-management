import React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  LayoutGrid,
  FileBarChart,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  className?: string;
  items?: Array<{
    title: string;
    icon: React.ReactNode;
    href: string;
    isActive?: boolean;
  }>;
}

const Sidebar = ({ className, items }: SidebarProps) => {
  const location = useLocation();
  const defaultItems = [
    {
      title: "Dashboard",
      icon: <LayoutGrid className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      title: "Users",
      icon: <Users className="w-5 h-5" />,
      href: "/users",
    },
    {
      title: "Reports",
      icon: <FileBarChart className="w-5 h-5" />,
      href: "/reports",
    },
    {
      title: "Messages",
      icon: <MessageSquare className="w-5 h-5" />,
      href: "/messages",
    },
  ];

  const navigationItems = items || defaultItems;

  return (
    <div
      className={cn(
        "flex flex-col h-auto md:h-screen w-full md:w-[280px] bg-[#1a365d] text-white",
        className,
      )}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold">Case Management</h2>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-2">
          <TooltipProvider>
            {navigationItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      location.pathname === item.href ? "secondary" : "ghost"
                    }
                    className={cn(
                      "w-full justify-start gap-3 px-3",
                      location.pathname === item.href
                        ? "bg-white/10"
                        : "hover:bg-white/5",
                    )}
                    asChild
                  >
                    <Link to={item.href}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Go to {item.title}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-white/10">
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
