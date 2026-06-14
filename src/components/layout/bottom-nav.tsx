"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, History, BarChart3, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/timeline", label: "Timeline", icon: History },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/search", label: "Search", icon: Search },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-background/80 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-xs"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-x-3 top-0.5 h-0.5 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <Icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              <span
                className={cn(
                  "transition-colors",
                  isActive ? "text-foreground font-medium" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
