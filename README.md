# Dotnot

Dotnot is an independent personal fork of a nested-outline editor. It keeps notes,
tasks, and ideas in a keyboard-driven outline, with per-user sync and a
plugin-extended editor.

There is no hosted Dotnot deployment yet. Run it locally, or configure your own
Cloudflare deployment. Domains ending in `dotnot.example` in the documentation
are reserved examples, not live services. Historical release notes and decision
records describe the inherited implementation, not a verified Dotnot deployment.

## Run locally

Use the Bun version pinned in [package.json](./package.json), with Node.js
22.19.0 or newer.

```sh
bun install
bun run setup
bun run cf:dev
```

In another terminal, create a development account:

```sh
bun run seed:user
```

Open <http://localhost:8787> and sign in with `dev@dotflowy.local` /
`dotflowy-dev`. These development identifiers remain unchanged for compatibility.
Local development does not require a Cloudflare account.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, testing, and development
commands. The [deployment guide](./docs/deploying.md) covers configuring your own
Cloudflare resources and domain.

## Features

- Nested bullets, tasks, paragraphs, and embeds, with collapse, drag, and zoom.
- Daily notes, tags, node links, backlinks, mirrors, and search.
- OPML import and OPML or Markdown export.
- MCP and a local CLI for authorized agent access.
- A static React SPA backed by Cloudflare Workers and per-user Durable Objects.

Internal package names, storage keys, CLI commands, and existing asset paths may
retain their original identifiers. Changing them requires a separate compatibility
review.

## Documentation

| Document                                 | Purpose                                       |
| ---------------------------------------- | --------------------------------------------- |
| [Architecture](./docs/architecture.md)   | Data model, sync, plugins, and project layout |
| [Deploying](./docs/deploying.md)         | Configure and deploy your own instance        |
| [MCP](./docs/mcp.md)                     | Connect agents to your instance               |
| [CLI](./cli/README.md)                   | Build and use the local command-line client   |
| [Keyboard shortcuts](./docs/keyboard.md) | Editor commands                               |
| [Contributing](./CONTRIBUTING.md)        | Development and verification                  |
| [Agent guidance](./AGENTS.md)            | Repository guardrails                         |
| [Architecture decisions](./docs/adr/)    | Inherited technical decisions                 |

Repository: [unstppbl/dotnot](https://github.com/unstppbl/dotnot).
