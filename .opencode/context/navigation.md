# Context Navigation

Use this file as the entrypoint for context discovery.

## Default Loading Policy

- Default: load `core` tier only.
- Load `optional` tier only when trigger conditions apply.
- Never load `archive` tier unless the user explicitly overrides policy.

## Mandatory Retrieval Gate

- MUST run a QMD query on core collections before broad file reads or grep.
- Start with `portfolio-core-wiki` + `portfolio-core-reference`.
- Add `portfolio-core-intel` only if summary/decision context is required.
- Use `portfolio-opencode` only if core collections miss.

See `importance-profile.md` for the full tier map and triggers.

## Domains
- `project-intelligence/navigation.md` - core project summaries and decisions
- `project-wiki/index.md` - core canonical runbooks, architecture docs, and ADRs
- `core/navigation.md` - optional shared engineering standards and workflows

## Profiles
- `importance-profile.md` - file importance tiers (core/optional/archive) and trigger rules

## References
- `.opencode/reference/navigation.md` - immutable handoff and source references
