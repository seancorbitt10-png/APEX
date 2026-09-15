"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Icon, type IconName } from "@/components/ui/Icon";

interface MobileNavItem {
  href: string;
  label: string;
  icon: IconName;
}

interface MobileNavigationProps {
  items: MobileNavItem[];
  onOpenMenu: () => void;
}

export function MobileNavigation({ items, onOpenMenu }: MobileNavigationProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-surface/95 backdrop-blur-md lg:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-5 gap-1 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.slice(0, 4).map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[var(--radius-md)] px-1 py-2 text-[10px] font-medium",
                  active ? "text-accent" : "text-text-muted",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={item.icon} className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex w-full flex-col items-center gap-1 rounded-[var(--radius-md)] px-1 py-2 text-[10px] font-medium text-text-muted"
            aria-label="Open full menu"
          >
            <Icon name="menu" className="h-[18px] w-[18px]" />
            <span>More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
