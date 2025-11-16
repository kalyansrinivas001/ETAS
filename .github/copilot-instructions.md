# copilot-instructions for ETAS (Exam Timer & Alert System)

Summary
- This repository currently contains only a short `README.md` and no application code. The project name is "ETAS" (Exam Timer & Alert System). There are no language/runtime files, no tests, and no CI configured as of this commit.

Primary goal for AI agents
- Be conservative: do not add large, irreversible changes without an explicit PR and human confirmation.
- If asked to implement features, propose a minimal scaffold first (language/runtime choice, minimal service layout, and tests) and wait for confirmation before expanding.

Detected state (what you can rely on)
- `README.md` — project title and brief description only. Reference it when you need the project name or short description.

When you start working (step-by-step)
- 1) Create a short proposal in the PR description listing: chosen stack (e.g., Node/TS, Python, or Go), minimal folder layout, test runner, and CI workflow to add.
- 2) Scaffold the project conservatively: add `src/`, `tests/`, and a minimal `README.md` update that documents how to run the scaffold.
- 3) Add one small, fully-working feature (end-to-end): this can be a CLI that prints "ETAS running" or a tiny HTTP health-check endpoint. Include unit tests for it.

Project layout conventions to follow (apply consistently)
- Top-level: use `src/` for application code and `tests/` for automated tests.
- Keep configs at repo root (`package.json` / `pyproject.toml` / `go.mod`, `.gitignore`, `.editorconfig`).
- Use clear, descriptive filenames: `src/server.*`, `src/alerts.*`, `src/timer.*` when implementing core pieces.

Commit / PR conventions
- Keep commits small and focused. Each commit should implement one logical change (scaffold, feature, test, docs, CI).
- PR title should start with a short prefix describing the area, e.g. `scaffold: add node-typescript starter` or `feat: add health endpoint`.

Testing and CI (what to add and examples)
- There is no existing test framework. When adding tests, choose the ecosystem's standard (Jest for Node, pytest for Python, testing package for Go).
- Example (Node/TS): add `package.json` with `test` script running `jest`; create `.github/workflows/ci.yml` that runs `npm ci && npm test`.

Integration points & external dependencies
- None are present in the repo. If you add integrations (databases, messaging, auth), document them in `README.md` and add config in `.env.example`.

Developer workflow notes (for a new scaffold)
- Local quick-run (example Node):
  - Install: `npm ci`
  - Test: `npm test`
  - Run dev: `npm run dev` (if you add that script)
- Always add a short `README.md` section explaining these commands when introducing a runtime.

What to avoid
- Do not assume a particular language or framework unless the user requested one.
- Do not create broad refactors or delete files without justification in the PR and an explanation in its description.

Where to document decisions
- Place rationale in the PR body and add a short `docs/DECISIONS.md` for any architectural choices that will affect others.

Minimal example tasks an AI agent can do immediately
- Propose three stacks with pros/cons for ETAS and ask which to use.
- Create a minimal scaffold for the chosen stack (one endpoint/CLI + test + README update + CI job).
- Add a simple timer/alert unit that demonstrates the core domain concept (timer tick, alert trigger) and unit tests.

If you (the human) want a specific implementation now
- Reply with the preferred language/runtime (Node/TS, Python, Go, or other), and whether to include CI and tests. I'll scaffold and open a draft PR.

References
- Current file: `README.md` (project title and short description)

End of file.
