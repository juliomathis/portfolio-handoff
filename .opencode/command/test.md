---
description: Run portfolio app validation checks
---

# Test Command

Run checks in `app/` using scripts that actually exist.

## Sequence

1. `pnpm --dir app check`
2. `pnpm --dir app test`
3. `pnpm --dir app build`

## Notes

- Stop and report on first failure.
- Do not auto-fix without explicit user request.
