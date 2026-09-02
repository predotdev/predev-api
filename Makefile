# Verification contract (ADR-0003 in predev-brain). CI runs exactly
# `make check`, so a local green is a CI green. Requires uv
# (https://docs.astral.sh/uv/ — `brew install uv` or `mise use uv`); ruff is
# version-pinned in scripts/lint_changed.sh, pytest deps are declared inline
# below — nothing else to install.
.PHONY: check check-changed lint fix test

check: lint test

check-changed: check

lint:
	bash scripts/lint_changed.sh

fix:
	bash scripts/lint_changed.sh --fix

# The python SDK's suite (fast, no network). --no-project because the SDK is
# a setup.py package, not a uv project; requests is its one runtime dep.
test:
	cd predev-api-python && uv run --no-project --with pytest --with requests -- pytest tests/ -q
