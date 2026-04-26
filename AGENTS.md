# Agent Protocol

This document defines mandatory repository behavior for all AI agents working on this project.

Read this file first, then `CONTRIBUTING.md`, then `README.md` before making changes.

## 0. Required Startup Order

- Before any planning, searching, editing, testing, or command execution, every AI agent must read:
  1. `AGENTS.md`
  2. `CONTRIBUTING.md`
  3. `README.md`
- This startup order is mandatory.
- If an agent has not read these files in this order, it is not allowed to proceed.
- If there is any conflict, direct user instructions win first, then `AGENTS.md`, then `CONTRIBUTING.md`, then `README.md`.
- Agents must assume these files are part of the required repository contract, not optional guidance.

## 1. Non-Negotiable Rules

- Do not bypass validation gates.
- Do not weaken lint, test, typecheck, or CI rules.
- Do not fabricate outputs, screenshots, metrics, or validation results.
- Do not mark work complete before local validation passes.
- Do not modify or revert user work you did not create unless explicitly instructed.
- Do not use `--no-verify`, `@ts-ignore`, or similar bypasses.

## 2. Exploration First

- Inspect the repository state before editing.
- Search before broad reading when possible.
- Read only the files needed for the current task.
- Understand existing conventions before introducing new ones.

Preferred order:

1. `glob` and `grep`
2. `sg` or `ast-grep` when structural search matters
3. targeted file reads

## 3. Required Workflow

1. Check repository rules by reading `AGENTS.md`, `CONTRIBUTING.md`, and `README.md` in that order.
2. Inspect the relevant files and current state.
3. Use TDD when behavior changes.
4. Make the smallest correct change.
5. Validate locally before claiming success.
6. Report results truthfully.

## 4. Testing Rules

- If behavior changes, tests must change too.
- New features and fixes require failing tests first where practical.
- CI is a backup safety net, not a substitute for local validation.

Minimum local validation before claiming completion:

- `make lint`
- `make typecheck`
- `make test`
- `make build`
- `make e2e` for player or browser-flow changes

## 5. Documentation Duties

Update docs whenever changes affect:

- commands
- project structure
- setup steps
- validation flow
- demo workflow
- output locations

All new docs under `docs/` must use lowercase kebab-case names.

## 6. Git Rules

- Never commit unless the user explicitly approves the commit step.
- Never push unless the user explicitly approves the push step.
- Keep branches focused on one logical task.
- Do not suggest CI can replace local validation.

## 7. Enforcement Notes

- Agents must not treat `README.md` as sufficient by itself.
- Agents must not skip `AGENTS.md` just because `CONTRIBUTING.md` exists.
- Agents must not skip `CONTRIBUTING.md` just because `AGENTS.md` exists.
- If a tool or workflow loads only one repository instruction file by default, the agent must still manually read the other required files before continuing.
