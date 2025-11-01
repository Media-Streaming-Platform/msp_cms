"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AudioWaveform,
  Video,
  BarChart3,
  Settings,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Media Content",
    href: "/content",
    icon: Video,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: AudioWaveform,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("isCollapsed");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("isCollapsed", String(collapsed));
  }, [collapsed]);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "relative flex flex-col border-r bg-background transition-all duration-300 h-full",
          collapsed ? "w-[70px]" : "w-[220px]",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3">
          <h2 className="text-lg font-semibold tracking-tight">CMS</h2>

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto absolute top-1/2 -right-4 rounded-full"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Menu Items */}
        <div className="space-y-1 px-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start transition-all",
                      collapsed ? "px-2" : "px-3"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="mr-2 h-10 w-10 shrink-0" />
                      {!collapsed && item.name}
                    </Link>
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="text-sm">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
