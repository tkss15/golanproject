import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  className?: string;
  children: ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  className?: string;
  Icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  cta?: string;
  href?: string;
  background?: ReactNode;
}

export function BentoCard({
  className,
  Icon,
  name,
  description,
  cta,
  href,
  background,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-lg",
        className
      )}
    >
      <div className="flex h-full flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">{name}</h3>
          </div>
          <p className="mt-3 line-clamp-3 text-muted-foreground">{description}</p>
        </div>
        <div className="relative z-10">
          {cta && href && (
            <Link href={href} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              {cta}
            </Link>
          )}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg">
        {background}
      </div>
    </div>
  );
}
