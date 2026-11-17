# Dotnot Apple Shortcut

This fork has no hosted deployment or signed Shortcut download. The previous
signed public file was removed because it targeted a different deployment.
The install action stays disabled until a clean template is rebuilt and
Apple-signed for your own capture endpoint.

The retained source is `shortcuts/add-to-dotflowy-today.cherri`; its generated
unsigned input is `shortcuts/Dotnot.unsigned.shortcut`. The Cherri source filename remains stable for compatibility. The current template targets `http://localhost:8787`
for development. A phone needs a reachable endpoint for your deployment;
configure that endpoint before rebuilding and signing. Domains ending in
`dotnot.example` in historical documentation are reserved examples.

The template accepts text or a URL from the share sheet. When launched directly,
it prompts for text. Nonblank input is sent to `/api/capture` with a scoped API
key. [ADR 0086](./adr/0086-scoped-expiring-api-keys.md) describes API-key
permissions and expiration. Sign-in, account selection, and key revocation are
web tasks.

The build and verification instructions below describe the inherited template.
They do not establish a signed Dotnot release, successful installation, or
real-device verification for this fork.

## Setup surfaces

**Dotnot Settings → Connections → API keys → Manage** creates and revokes all
personal API keys. Choose **Capture only** for a shortcut. Read-only keys cannot
capture, and capture-only keys cannot access MCP or the CLI. New keys default to
30 days and have a 90-day maximum. Existing long-lived keys receive up to 90 days
from migration, without extending any earlier expiration. Each key's expiration
is shown in management; create a replacement before that date, update each
shortcut or script, then revoke the old key.

**Connections → Apple Shortcut → Set up** opens the focused setup dialog. There
is no experimental discovery toggle. You create a capture-only key named
**iPhone** by default, choose its expiration, and copy it. If automatic copying fails, select the
read-only key field and use your device's **Copy** command. Closing the dialog
clears the revealed secret. The Settings link leads back to key management.

**Add to Apple Shortcuts** is disabled in this fork until an operator prepares
a signed template for the configured deployment. API-key management remains
available. A future install flow must offer only the clean signed file, without
including a key. Opening or downloading a file does not confirm installation.

## Credential storage and sharing

Your installed shortcut contains the capture key in a readable Text action, not
an isolated Keychain item. Treat it as a credential. Keep the key solely in the
Text field bound to the import question; the authorization header references
that action's output rather than holding another literal copy of the key.

[Apple documents that sharing clears fields bound to import questions](https://support.apple.com/guide/shortcuts/add-import-questions-to-shared-shortcuts-apdf330fd3a0/ios).
This helps prevent accidental disclosure through Apple's sharing mechanism, but
does not hide the key in your installed copy. Clearing has not been verified for a Dotnot release. Do not assume raw exports or external signing tools
clear credentials, and do not describe the shortcut as safe to share until the
relevant sharing path passes the dummy-key check below.

## Keep the published template separate from personal copies

Publish only the generated, signed template with its capture-key placeholder.
Never export a configured personal copy for official distribution. If you keep
a clean master in the Shortcuts app, name it **Dotnot**, leave its key field as
`PASTE_CAPTURE_KEY_DURING_IMPORT`, and duplicate it for personal use.

The source of truth is `shortcuts/add-to-dotflowy-today.cherri`;
`shortcuts/Dotnot.unsigned.shortcut` is its generated build input, and
`public/shortcuts/Dotnot.shortcut` is the intended output path for a future
signed download; that file is currently absent.
`scripts/shortcut.ts` compiles it and normalizes the capture-key import question (Cherri
v2.3.0 writes import questions without a usable `ActionIndex` and leaves their parameters
empty, which is what made a shared copy fail with “Please choose a value for each
parameter in this action”). It also assigns distinct conditional grouping IDs
and remaps conditional-output references to their closing actions. It decodes
XML newline entities so receipt variable offsets stay correct. Immutable
conditional outputs for input selection and receipt status replace mutable
variables. The current generated workflow has 56 actions, including the dedicated
invalid-key failure branch.
A signed export of the clean master can be retained
with the release, but never commit or upload a personalized shortcut containing
a working key.

Set the name, glyph, and color in the Cherri source, then rebuild and sign.
Cherri's name directive controls its output filename; Shortcuts can use the
downloaded filename as the imported name. Keep both the public basename and the
download header's filename as `Dotnot.shortcut`.
In a personal copy, tap the icon beside its name in the shortcut editor to
choose a glyph and color. A custom image is a separate **Add to Home Screen**
option, not the shortcut collection's glyph.

## Behavior and protocol

The Cherri directives for Share Sheet, Show in Spotlight, and Accepts Input from
Spotlight are:

```cherri
#define from sharesheet, search, spotlight
#define inputs text, url
```

`search` enables visibility; `spotlight` enables input through `ShortcutInput`.
The existing input-selection branch uses that input or prompts when none arrives.
Apple introduced the Spotlight controls in OS 26; test Spotlight input on a
supported Mac separately from iPhone share-sheet behavior.

Each nonblank invocation creates a random version 4 UUID as its attempt ID. Shortcuts has no built-in UUID action, so the template picks 30 random hex digits (120 bits) with **Get Item from List → Random Item** and adds the fixed version and variant digits. It deliberately avoids **Number** and **Random Number**: on macOS 26.7.1, a fresh import that answers the setup question shows Calculator's icon in the library and editor when either action is present. The shortcut formats the phone's current local date as `yyyy-MM-dd` immediately before submission. It sends:

```http
POST /api/capture
Authorization: Bearer <capture key>
Content-Type: application/json

{"attemptId":"<UUID>","date":"yyyy-MM-dd","text":"<input>"}
```

The optional `title` field is intentionally omitted by this stock template; the server may unfurl a URL after saving. A run reports success only when the JSON response has `saved: true` and nonempty `nodeId`, `dailyNoteId`, and `date`. Otherwise it displays the response's `error` and `message`. There is no persistent queue: it is online-only.

The receiving endpoint interprets Markdown using the app's paste grammar, even
for one line. `- [ ] Write notes` creates a task; `- [x] Write notes` creates a
completed task. Lists and headings preserve their nesting across lines, and bare
prose becomes paragraph nodes. Inline Markdown and tags stay in the text; fenced
content stays literal. All nodes save together, and `nodeId` identifies the first
root. Installed Shortcuts need no update. Existing captures stay unchanged.

The attempt ID, date, and text are action outputs created before the request. A retry added around only the request/receipt actions must reuse those outputs. Starting the shortcut again is a fresh invocation and creates a fresh attempt ID. The stock template does not automatically retry.

## Author and validate (Linux or Mac)

Load the repo-local [Cherri skill](../.agents/skills/cherri/SKILL.md) before
editing the source. It is vendored unmodified, with its MIT license, from
[the maintainer's skill revision](https://github.com/electrikmilk/cherri-skill/commit/3c88722937620078f8042812e867ac00684df8d2).
Use the installed compiler's `--no-ansi --action=` lookup for action signatures;
prefer constants for immutable outputs and check compiled action counts when
proposing simplifications. Preserve blank-input rejection, device-local Today,
per-invocation attempt IDs, the bound key Text action, and complete-save receipts.
The skill's general signing examples do not override this project's
`--skip-sign` build and Apple-only signing workflow.

The Cherri source is the canonical template; `--build` compiles it into
`shortcuts/Dotnot.unsigned.shortcut`, outside `public/`. The generated XML is
deterministic and remains available to unit tests after signing. Building cannot
replace the public signed file with an unsigned download.

Install the pinned compiler once (the orb setup script does the same):

```sh
curl -fsSL -o /tmp/cherri.zip \
  https://github.com/electrikmilk/cherri/releases/download/v2.3.0/cherri_linux-x86_64.zip
unzip -o /tmp/cherri.zip -d /tmp/cherri-bin
install -m 0755 /tmp/cherri-bin/cherri "$HOME/.local/bin/cherri"
```

```sh
bun scripts/shortcut.ts --build
bun scripts/shortcut.ts --validate
bun test scripts/shortcut.test.ts
```

`CHERRI_BIN` points the build at a specific compiler binary. Validation checks
that every action identifier is one Shortcuts knows, that the only import
question targets the capture-key Text field, that the unsigned XML serialization
is reproducible, that the receipt gates and date format survive, and that no
credential marker is present. When a public signed file is present, validation checks its AEA1 envelope.
Envelope checks do not decrypt or compare the signed payload; the
unsigned input is validated before signing. This is not a substitute for Apple's parser or
real-device testing: the action plist schema is an Apple implementation detail
rather than a documented stable authoring API.

## Sign and release (Mac required)

Use a Mac signed in to iCloud with Shortcuts enabled and network access. Apple's CLI sends the shortcut to Apple for validation. The build step also needs the Cherri compiler on `PATH`; only `--sign` is Apple's CLI. From the repository root:

```sh
bun scripts/shortcut.ts --build
bun test scripts/shortcut.test.ts
bun scripts/shortcut.ts --sign
bun scripts/shortcut.ts --validate
```

`--sign` executes the Apple-documented command with an atomic output replacement:

```sh
shortcuts sign --mode anyone \
  --input shortcuts/Dotnot.unsigned.shortcut \
  --output public/shortcuts/Dotnot.shortcut.signed.shortcut
```

It then moves the signed output to `public/shortcuts/Dotnot.shortcut`.
Only the signed file belongs in `public/shortcuts/`. Building refreshes the
separate unsigned input, so a changed source still requires signing before
publication. Keep the final release sequence build, test, sign, validate.
The static download headers specify an attachment named `Dotnot.shortcut`.

Before claiming iPhone verification, import the signed file on a current iPhone and verify both direct launch and the share sheet with text and a URL, blank/cancel, a valid key, an invalid key, a server error receipt, and an offline request. Confirm a successful run creates the expected nodes in the phone-local daily note, including a single Markdown task and a nested list. Discovery is promoted under ADR 0086; that decision does not establish these device results.

Before claiming that sharing clears the capture key:

1. Customize a separate test copy with a unique dummy key that cannot authorize
   a real capture. Do not use a working key or change the clean master.
2. Share the configured test copy through Shortcuts' iCloud sharing mechanism.
3. Import the shared copy as a fresh recipient installation. Confirm setup asks
   for a capture key and inspect its actions to verify the dummy key is absent.
   Enter a different dummy answer and confirm the request references the newly
   configured Text action, not the sender's key.
4. Record the iOS version, sharing method, and result. If file export is offered
   or described as clearing keys, repeat the fresh-recipient check for that path
   separately. Do not infer its behavior from the iCloud result.

These sharing checks remain unverified. Official file distribution does not
depend on sharing a configured copy; retain the checks before making claims
about personal-copy sharing or export.

For each release, rebuild, test, sign, validate, and verify a fresh recipient
import of the signed file. Confirm its name and icon, one capture-key setup
question, and setup-answer persistence. With deployment approval, publish that
signed file on your actual deployment origin. The asset's default revalidation
and ETag select fresh bytes for new downloads, not updates to installed copies.
Test the handoff from both Safari and Dotnot's Home Screen PWA on a real
iPhone. Provide a way to copy the file link and open it in Safari if the PWA
handoff fails. Neither this handoff nor its fallback has been verified yet.

## Known platform limit

Shortcuts' **Get Contents of URL** action exposes neither a portable per-request timeout setting nor catchable transport errors in this plist workflow. Consequently, the template cannot promise a particular timeout or offer an in-shortcut retry after DNS, TLS, or offline failure; iOS presents the action failure and stops. Server-returned JSON failures are explicit. A transport failure does not prove the capture failed: check today's note before launching again. A new invocation uses a new UUID and can duplicate a capture whose acknowledgment was lost. The server's idempotency guarantee applies only to retries that preserve the original attempt ID.

References:

- [Apple: Run shortcuts from the command line](https://support.apple.com/guide/shortcuts-mac/run-shortcuts-from-the-command-line-apd455c82f02/mac) — signing modes and command.
- [Apple: Add import questions](https://support.apple.com/guide/shortcuts-mac/add-import-questions-to-shared-shortcuts-apdf330fd3a0/mac) — setup-question behavior.
- [Apple: Share shortcuts](https://support.apple.com/guide/shortcuts/share-shortcuts-apdf01f8c054/ios) - iCloud links and recipient installation.
- [Apple: Modify shortcut colors and icons](https://support.apple.com/guide/shortcuts/modify-shortcut-icons-apd5ad5a2128/ios) - built-in glyphs and colors.
- [Apple: Add a shortcut to the Home Screen](https://support.apple.com/guide/shortcuts/add-a-shortcut-to-the-home-screen-apd735880972/ios) - custom Home Screen images.
- [iOS Shortcuts Reference](https://github.com/sebj/iOS-Shortcuts-Reference) — reverse-engineered plist fields; Apple does not publish the action serialization schema.
- [Shiori's signed shortcut](https://www.shiori.sh/Shiori.shortcut) — inspected only as an `AEA1` Apple-signed envelope precedent; no branding or credential was copied.
