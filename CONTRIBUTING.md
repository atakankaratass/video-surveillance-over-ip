# Contributing

We maintain strict quality gates for this repository. Fix the code to meet the rules; never weaken the rules to make the code pass.

## 0. Required Repository Read Order

- Human contributors should read `README.md` first.
- AI agents must read `AGENTS.md` first, then `CONTRIBUTING.md`, then `README.md` before doing anything else.
- `AGENTS.md` is mandatory for AI tooling in this repository. It is not optional reference material.
- Any AI agent, subagent, editor integration, or CLI workflow that has not read `AGENTS.md` first is operating out of policy.

## 1. Quality Philosophy

- Untested behavior changes are not allowed.
- Lint must pass with zero warnings.
- Typecheck must pass.
- Required tests must pass locally before completion claims.
- No bypasses such as `@ts-ignore`, `--no-verify`, skipped validations, or weakened configs.

## 2. Workflow

Follow TDD when behavior changes:

1. Write a failing test.
2. Verify it fails for the expected reason.
3. Write the minimal implementation.
4. Re-run tests until green.
5. Refactor while staying green.

## 3. Commit Standards

- Use atomic commits.
- Use conventional commit messages.
- Ask before each commit and push.

## 4. Validation Gates

Pre-commit should stay fast and only touch staged-file formatting and lint autofix.

Pre-push is the strict local gate and must run:

- `make lint`
- `make typecheck`
- `make test`
- `make build`
- `make e2e` when player or browser-facing behavior changed

Before any PR or public release step:

- all local validation must pass
- any relevant real-system demo checks must pass
- the report and screenshot artifacts must reflect the real implementation

## 5. Documentation

If you change setup, behavior, commands, or demo flow, update the relevant docs in `docs/`.

## 6. AI Agent Compliance

- AI agents are required to follow `AGENTS.md` before using this file.
- If you are configuring an AI assistant, prompt, or repository instruction flow, ensure it explicitly loads `AGENTS.md` first.
- Repository automation, code generation, and review assistants must treat `AGENTS.md` and this file as binding project policy.

## 7. Professor Rules Summary

- FFmpeg is required.
- Delivery must be DASH live profile over HTTP.
- The player page must use HTML5 MSE and JavaScript without plug-ins.
- H.264 is required for video.
- AAC is required if audio is included.
- Segment durations 2, 4, and 6 seconds must be tested with latency notes.
- System-specific paths must never be hardcoded.
