"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
  Zap,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useState } from "react";

interface AdminSidebarProps {
  user: {
    email: string;
    company_name: string | null;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isDemo = pathname.startsWith("/demo");
  const basePath = isDemo ? "/demo/admin" : "/admin";

  const navigation = [
    {
      name: "Command Center",
      href: basePath,
      icon: LayoutDashboard,
    },
    {
      name: "Clients",
      href: `${basePath}/clients`,
      icon: Users,
    },
    {
      name: "Billing",
      href: `${basePath}/billing`,
      icon: CreditCard,
    },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-violet-900/50 bg-gradient-to-b from-violet-950 to-slate-950 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Logo + God Mode Badge */}
      <div className="flex h-16 items-center gap-3 border-b border-violet-900/50 px-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-violet-600/20">
          <Zap className="size-5 text-violet-400" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-violet-100">
              AgentReady
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-400">
              <Shield className="size-3" />
              GOD MODE
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-violet-600/20 text-violet-200"
                  : "text-violet-300/70 hover:bg-violet-600/10 hover:text-violet-200"
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive
                    ? "text-violet-400"
                    : "text-violet-400/60 group-hover:text-violet-400"
                )}
              />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-violet-900/50 p-3">
        {!collapsed && (
          <div className="mb-3 rounded-lg bg-violet-900/30 p-3">
            <p className="truncate text-sm font-medium text-violet-100">
              {user.company_name ?? "Admin"}
            </p>
            <p className="truncate text-xs text-violet-300/70">{user.email}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-violet-600/30 px-2 py-0.5 text-xs font-medium text-violet-300">
              <Zap className="size-3" />
              Super Admin
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-violet-300/70 hover:bg-violet-600/10 hover:text-violet-200",
              collapsed && "justify-center px-0"
            )}
            asChild
          >
            <Link href={isDemo ? "/demo" : "/dashboard"}>
              <LayoutDashboard className="size-5" />
              {!collapsed && <span>Client View</span>}
            </Link>
          </Button>

          {isDemo ? (
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-violet-300/70 hover:bg-violet-600/10 hover:text-violet-200",
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
                  "w-full justify-start gap-3 text-violet-300/70 hover:bg-violet-600/10 hover:text-violet-200",
                  collapsed && "justify-center px-0"
                )}
              >
                <LogOut className="size-5" />
                {!collapsed && <span>Sign out</span>}
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex size-6 items-center justify-center rounded-full border border-violet-800 bg-violet-950 text-violet-400 shadow-sm transition-colors hover:bg-violet-900 hover:text-violet-200"
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

