import Link from "next/link";
import { cn } from "@/lib/utils";

export function Section({
  title,
  href,
  hrefLabel,
  children,
  className,
}: {
  title: string;
  href?: string;
  hrefLabel?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
          {title}
        </h2>
        {href && (
          <Link href={href} className="text-xs text-muted-foreground hover:text-foreground">
            {hrefLabel ?? "See all"}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
