"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  CreditCard,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  user: {
    email: string;
    company_name: string | null;
    role: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  // Detect if we're in demo mode
  const isDemo = pathname.startsWith("/demo");
  const basePath = isDemo ? "/demo" : "";

  const navigation = [
    {
      name: "Dashboard",
      href: `${basePath}/dashboard` || "/demo",
      icon: LayoutDashboard,
    },
    {
      name: "Onboarding",
      href: `${basePath}/onboarding`,
      icon: ClipboardList,
    },
    {
      name: "Projects",
      href: `${basePath}/projects`,
      icon: FolderKanban,
    },
    {
      name: "Billing",
      href: `${basePath}/billing`,
      icon: CreditCard,
    },
  ];

  // Fix dashboard href for demo
  if (isDemo) {
    navigation[0]!.href = "/demo";
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
          <Shield className="size-5 text-primary" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              AgentReady
            </span>
            <span className="text-xs text-muted-foreground">Client Portal</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive = 
            pathname === item.href || 
            (item.href === "/demo" && pathname === "/demo");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3">
        {!collapsed && (
          <div className="mb-3 rounded-lg bg-accent/50 p-3">
            <p className="truncate text-sm font-medium text-foreground">
              {user.company_name ?? "Your Company"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
            {user.role === "admin" && (
              <span className="mt-1 inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                Admin
              </span>
            )}
          </div>
        )}

        {isDemo ? (
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
              collapsed && "justify-center px-0"
            )}
            asChild
          >
            <Link href="/login">
              <LogOut className="size-5" />
              {!collapsed && <span>Exit Demo</span>}
            </Link>
          </Button>
        ) : (
          <form action="/api/auth/signout" method="POST">
            <Button
              type="submit"
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <LogOut className="size-5" />
              {!collapsed && <span>Sign out</span>}
            </Button>
          </form>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex size-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground"
      >
        {collapsed ? (
          <ChevronRight className="size-3" />
        ) : (
          <ChevronLeft className="size-3" />
        )}
      </button>
    </aside>
  );
}
