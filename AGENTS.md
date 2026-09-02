# Agent instructions — predev-api

For AI coding agents and humans alike. Two SDKs: `predev-api-python/` and
`predev-api-node/`. Verification follows ADR-0003 (predev-brain); this
contract currently covers the python side (node gets its own when touched).

## Verify your changes

- `make check` — before pushing or opening a PR. CI runs exactly this:
  ruff (lint + format) **only on python files you changed** vs origin/main
  (the repo is not ruff-clean — 228 findings at baseline — and legacy files
  are deliberately not your problem), plus the python SDK's pytest suite
  (24 tests, fast, offline).
- `make fix` — autofix + format the same changed set.
- Requires `uv` (`brew install uv` or `mise use uv`); ruff and pytest are
  fetched automatically, versions pinned in the scripts.

## House rules

- Never push to `main`. Every change is a feature branch + PR.
- Conventional Commits v1.0.0; one logical change per commit.
- Do not weaken, skip, or reconfigure checks to get green — fix the code, or
  stop and escalate to a human.
