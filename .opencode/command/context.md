---
description: Context command entrypoint for currently documented context-system standards
tags:
  - context
  - standards
dependencies:
  - subagent:contextscout
---

# Context

Use this command to load the documented context-system standards that exist today.

## Available Source Docs

Only the following files are currently documented for this command:

1. `.opencode/context/core/context-system.md`
2. `.opencode/context/core/context-system/standards/mvi.md`
3. `.opencode/context/core/context-system/standards/structure.md`

## Behavior

- Always load `context-system.md` first.
- Load `standards/mvi.md` for compression and file-size guidance.
- Load `standards/structure.md` for function-based organization rules.

## Supported Scope

This command currently supports standards loading and guidance only.

Advanced operations such as harvest/extract/organize/update/error/create are unavailable until corresponding operation or guide docs exist under `.opencode/context/core/context-system/`.

## Quick Reference

### MVI baseline
- Core concept: 1-3 sentences
- Key points: 3-5 bullets
- Minimal example: short and scannable
- Keep files concise

### Structure baseline
- Organize by function: `concepts/`, `examples/`, `guides/`, `lookup/`, `errors/`
- Keep `navigation.md` present at category roots

## Examples

```text
/context
/context help
```
