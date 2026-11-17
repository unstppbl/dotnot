import { Effect } from "effect";
import { toast } from "sonner";

import { hasWindow } from "../env";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export function CliSetupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const origin = hasWindow() ? window.location.origin : "http://localhost:8787";
  const server = ` --server ${origin}`;
  const steps = [
    {
      title: "Build the CLI",
      description: "Run this in your local Dotnot checkout with Bun installed.",
      command: "bun install --cwd cli && bun run build:cli",
      copyLabel: "Copy install command",
    },
    {
      title: "Sign in",
      description:
        "Your browser opens so you can authorize the CLI. You never enter your password in the terminal.",
      command: `node cli/dist/main.js login${server}`,
      copyLabel: "Copy login command",
    },
    {
      title: "Try a safe read",
      description: "Read your outline without changing any notes.",
      command: `node cli/dist/main.js outline${server}`,
      copyLabel: "Copy outline command",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Use Dotnot from your terminal</DialogTitle>
          <DialogDescription>
            Build from this repository, sign in, and try your first command.
          </DialogDescription>
        </DialogHeader>
        <ol className="flex flex-col gap-5">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
                  <code className="min-w-0 flex-1 text-xs leading-relaxed break-words select-all">
                    {step.command}
                  </code>
                  <Button
                    variant="ghost"
                    size="xs"
                    aria-label={step.copyLabel}
                    onClick={() => {
                      void Effect.runPromise(
                        Effect.tryPromise(() =>
                          navigator.clipboard.writeText(step.command),
                        ).pipe(
                          Effect.match({
                            onSuccess: () => toast.success("Command copied"),
                            onFailure: () =>
                              toast.error(
                                "Couldn't copy. Select the command and copy it manually.",
                              ),
                          }),
                        ),
                      );
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs leading-relaxed text-muted-foreground">
          For scripts, set DOTFLOWY_TOKEN to a personal API key from Dotnot
          Settings → Connections → API keys, or an existing OAuth bearer token.
          Choose Read-only for reads, search, and exports, or Read and write for
          changes. Capture-only keys cannot run CLI commands. API keys expire
          after 30 or 90 days; replace the key and update DOTFLOWY_TOKEN before
          it expires. Browser sign-in with OAuth remains available above.
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          CLI commands use the MCP endpoint and require Pro or Founding. Spoiler
          text stays redacted, including in CLI exports. For a full backup, use
          the app’s Data exports.
        </p>
        <a
          className="text-sm text-primary underline underline-offset-4"
          href="https://github.com/unstppbl/dotnot/blob/main/cli/README.md"
          target="_blank"
          rel="noreferrer"
        >
          CLI documentation
        </a>
      </DialogContent>
    </Dialog>
  );
}
