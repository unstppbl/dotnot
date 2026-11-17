import { cn } from "@/lib/utils";

/** Text stays editable so the wordmark follows the project's identity. */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-2 font-semibold", className)}
      aria-label="Dotnot"
    >
      <svg viewBox="0 0 32 32" className="h-full w-auto" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="currentColor" fillOpacity="0.07" />
        <circle cx="16" cy="16" r="6" fill="currentColor" />
      </svg>
      <span>Dotnot</span>
    </span>
  );
}
