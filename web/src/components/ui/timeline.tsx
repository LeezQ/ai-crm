import { cn } from "@/lib/utils";

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Timeline({ children, className, ...props }: TimelineProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function TimelineItem({ children, className, ...props }: TimelineItemProps) {
  return (
    <div className={cn("flex gap-4", className)} {...props}>
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <div className="flex-1 w-[1px] bg-border" />
      </div>
      <div className="flex-1 pb-4">{children}</div>
    </div>
  );
}