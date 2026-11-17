import type { VariantProps } from "class-variance-authority";

import { Star } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Logo } from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

// Local development endpoints until a deployment domain is configured.
export const APP_URL = "http://localhost:8787";
export const GITHUB_URL = "https://github.com/unstppbl/dotnot";
const GITHUB_API = "https://api.github.com/repos/unstppbl/dotnot";

function useGithubStars() {
  const [stars, setStars] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(GITHUB_API)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        // GitHub's JSON is unchecked: keep only a real, non-negative count.
        const count = Number(data?.stargazers_count ?? Number.NaN);
        if (!cancelled && Number.isSafeInteger(count) && count >= 0) {
          setStars(count);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return stars;
}

/** A link styled as a button. Links are `<a>` elements (correct semantics),
 * not Base UI Buttons rendering an anchor. */
export function LinkButton({
  href,
  external,
  variant,
  size,
  className,
  children,
}: {
  href: string;
  external?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </a>
  );
}

export function Nav() {
  const stars = useGithubStars();
  return (
    <header>
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <a href="/" className="flex items-center">
          <Logo className="h-5 w-auto" />
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          <LinkButton
            href="/changelog"
            variant="ghost"
            size="sm"
            className="min-h-10 px-2.5"
          >
            What&apos;s new
          </LinkButton>
          {/* The narrowest phones can't fit all three; GitHub is in the footer. */}
          <LinkButton
            href={GITHUB_URL}
            external
            variant="ghost"
            size="sm"
            className="min-h-10 min-w-10 gap-1.5 px-2.5 max-[359px]:hidden sm:min-w-0 sm:pr-2.5 sm:pl-2"
          >
            <Star className="size-4" />
            <span className="hidden sm:inline">Star on GitHub</span>
            {stars != null && (
              <span className="text-muted-foreground tabular-nums">
                {stars.toLocaleString()}
              </span>
            )}
          </LinkButton>
          <LinkButton
            href={APP_URL}
            variant="outline"
            size="sm"
            className="min-h-10 px-3"
          >
            Sign in
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center text-sm">
          <Logo className="h-4 w-auto" />
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <a href={APP_URL} className="transition-colors hover:text-foreground">
            Open app
          </a>
          <a
            href="/changelog"
            className="transition-colors hover:text-foreground"
          >
            What&apos;s new
          </a>
          <a href="/mcp" className="transition-colors hover:text-foreground">
            MCP documentation
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={`${APP_URL}/terms`}
            className="transition-colors hover:text-foreground"
          >
            Terms
          </a>
          <a
            href={`${APP_URL}/privacy`}
            className="transition-colors hover:text-foreground"
          >
            Privacy
          </a>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-2xl px-6 pb-6">
        <p className="text-sm text-muted-foreground">
          Dotnot is in local development. No hosted service is configured.
        </p>
        <p className="mt-4 text-xs text-muted-foreground/70">
          Local development version
        </p>
      </div>
      {/* Nominative-fair-use disclaimer: naming Workflowy and the MCP clients
       * is lawful, but state plainly that we're independent and unaffiliated. */}
      <div className="mx-auto w-full max-w-2xl px-6 pb-6">
        <p className="text-xs leading-relaxed text-muted-foreground/70">
          Workflowy, Amp, ChatGPT, Claude, Cursor, Gemini, Grok, Kody, and other
          product names and logos are trademarks of their respective owners.
          Dotnot is an independent project and is not affiliated with, sponsored
          by, or endorsed by them.
        </p>
      </div>
    </footer>
  );
}
