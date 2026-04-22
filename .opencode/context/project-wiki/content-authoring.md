---
name: Content Authoring
description: Edit portfolio content without touching presentation components.
type: project
---

# Content Authoring

## Authoring Contract

1. Edit only `app/src/content/*.ts` for content changes.
2. Keep `app/src/lib/types.ts` as source of truth for content contracts.
3. Do not embed content text directly into component files.

## Workflow

1. Edit content file.
2. Run the documented validation command(s) from the project root (lint/test/build).
3. Open PR with content-only scope when possible.
