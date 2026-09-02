#!/usr/bin/env bash
# Changed-files ruff (ADR-0003 in predev-brain): the repo is not ruff-clean
# (measured 2026-09-02: 228 lint findings, 10/17 files misformatted), so lint
# + format are enforced only on python files touched relative to origin/main.
# Violations in files you touch get fixed in that PR; untouched legacy files
# are not your problem. `--fix` applies autofixes + formatting to the same set.
set -euo pipefail
cd "$(dirname "$0")/.."

RUFF="uvx ruff@0.16.5"

base=$(git merge-base HEAD origin/main 2>/dev/null || echo "")
files=$(git diff --name-only --diff-filter=d ${base:+"$base"} -- '*.py')
if [ -z "$files" ]; then
  echo "lint: no changed python files"
  exit 0
fi

# shellcheck disable=SC2086  # word splitting is intended; no spaces in paths
if [ "${1:-}" = "--fix" ]; then
  $RUFF check --fix $files
  $RUFF format $files
else
  $RUFF check $files
  $RUFF format --check $files
fi
