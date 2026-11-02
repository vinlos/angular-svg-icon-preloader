# AGENTS.md

> Operational guide and reference manual for AI coding agents and automated tools working in the **Angular SVG Icon Preloader** repository.

---

## 1. Overview & Purpose

**Angular SVG Icon Preloader** (`@vinlos/angular-svg-icon-preloader`) is an Angular library designed to work alongside [`angular-svg-icon`](https://www.npmjs.com/package/angular-svg-icon). It preloads SVG icons (both external SVG files and custom inline SVG strings) from a JSON configuration file during application initialization (via Angular's `provideAppInitializer` / `APP_INITIALIZER`).

- **Workspace Architecture**: Angular CLI multi-project workspace with standard npm workspaces (Nx has been completely removed).

---

## 2. Repository Architecture & Layout

```
.
├── .antigravity/                     # Antigravity agent configuration (MCP servers)
├── .github/
│   └── workflows/
│       ├── build-publish.yaml        # CI build, tagging, and npm release workflow
│       ├── quality.yaml              # Linting & code format checks
│       └── unit-tests.yaml           # Automated Vitest test suite execution
├── .husky/                           # Git hook definitions (pre-commit: pretty-quick)
├── apps/
│   ├── angular-svg-icon-preloader-demo/     # Demo application verifying library usage
│   └── angular-svg-icon-preloader-demo-e2e/ # End-to-end testing application
├── libs/
│   └── angular-svg-icon-preloader/          # The publishable Angular library
│       ├── src/
│       │   ├── lib/
│       │   │   ├── angular-svg-icon-preloader/
│       │   │   │   ├── angular-svg-icon-preloader.service.ts
│       │   │   │   └── angular-svg-icon-preloader.service.spec.ts
│       │   │   ├── angular-svg-icon-preloader-config.class.ts
│       │   │   ├── angular-svg-icon-preloader.module.ts
│       │   │   ├── icon-config.interface.ts
│       │   │   └── icon.interface.ts
│       │   └── index.ts              # Public API barrel export
│       ├── ng-package.json           # ng-packagr configuration
│       ├── package.json              # Published npm package manifest
│       └── tsconfig.lib.json         # Library TypeScript build config
├── tools/                            # Workspace tools and schematics
├── angular.json                      # Angular CLI workspace configuration
├── eslint.config.mjs                 # Flat ESLint configuration
├── package.json                      # Root npm workspace manifest & scripts
├── prettier.config.js                # Prettier formatting rules
└── tsconfig.json                     # Root TypeScript configuration
```

---

## 3. Technology Stack

- **Angular Version**: Angular 22 (Application & Library)
- **Node.js Target**: Node.js 24.x (CI runtime)
- **Package Manager**: `npm` (utilizing npm workspaces)
- **Library Packager**: `ng-packagr` / `@angular/build:ng-packagr`
- **App Builder**: `@angular/build:application` and `@angular/build:dev-server`
- **Unit Testing**: Vitest (`@angular/build:unit-test` with `runner: "vitest"` and `@vitest/coverage-v8`)
- **Linting**: ESLint 9 (Flat Config: `eslint.config.mjs`) with `@angular-eslint`
- **Code Formatter**: Prettier 3.x with `prettier-plugin-organize-imports`
- **Git Hooks**: Husky 9 with `pretty-quick`

---

## 4. Agent Commands & Workflows

Always prefer running workspace scripts via `npm run <script>` from the repository root:

| Command | Action | Notes |
| :--- | :--- | :--- |
| `npm ci` | Install dependencies | Clean install using locked versions |
| `npm start` | Launch demo app | Serves `angular-svg-icon-preloader-demo` locally |
| `npm run build` | Build library | Executes production build to `dist/libs/angular-svg-icon-preloader` |
| `npm test` | Run all unit tests | Vitest runner |
| `npm run test:lib` | Run library unit tests | Tests `libs/angular-svg-icon-preloader` only |
| `npm run test:ci` | Run unit tests for CI | Headless run with coverage, no watch, no progress |
| `npm run lint` | Lint entire workspace | Runs ESLint across apps and libs |
| `npm run lint:lib` | Lint library code | Lints `libs/angular-svg-icon-preloader` |
| `npm run format` | Format all files | Applies Prettier to entire project |
| `npm run format:check` | Check file formatting | Verification step run in CI (`quality.yaml`) |
| `npm run format:staged`| Format staged files | Executed automatically on `pre-commit` |
| `npm run e2e` | Run E2E tests | Protractor/Cypress end-to-end suite |

---

## 5. Coding Standards & Agent Guidelines

### 5.1 Boundaries & Workspace Separation
- **Library (`libs/angular-svg-icon-preloader`)**:
  - Contains all publishable source code.
  - All public classes, interfaces, and functions MUST be exported in `libs/angular-svg-icon-preloader/src/index.ts`.
  - Only declare minimal, necessary peer dependencies (`@angular/core`, `@angular/common`, `angular-svg-icon`, `rxjs`) in `libs/angular-svg-icon-preloader/package.json`.
  - Do NOT introduce direct runtime dependencies without explicit project need and user confirmation.
- **Demo Application (`apps/angular-svg-icon-preloader-demo`)**:
  - Serves as the interactive consumer and manual verification app.
  - Follows modern Angular standalone component patterns (`bootstrapApplication`, `provideHttpClient()`, `provideAngularSvgIcon()`).

### 5.2 Angular & TypeScript Conventions
- **Modern Angular Idioms**:
  - Prefer `inject()` over constructor parameter injection where appropriate.
  - Use `provideAppInitializer()` instead of legacy multi-token `APP_INITIALIZER` providers directly where applicable.
  - Use RxJS operators cleanly (`take(1)`, `catchError`, `tap`) and avoid leaking subscriptions.
  - Keep components standalone and declare imports directly on the component decorator.
- **Strict Typing**:
  - Always provide explicit return types on public methods and helper functions.
  - Do not use `any` unless strictly required for external untyped payloads. Create interfaces (e.g., `IconConfig`, `IconImageFile`, `CustomIconData`).

### 5.3 Unit Testing with Vitest
- **Test Framework**: The project uses **Vitest** for unit testing (migrated from Jasmine/Karma).
- **Importing Vitest APIs**: Import testing utilities directly from `vitest`:
  ```ts
  import { beforeEach, describe, expect, it, vi } from 'vitest';
  ```
- **Spies and Mocks**:
  - Use `vi.fn()` for mock functions.
  - Use `vi.spyOn(target, 'method')` to inspect or override methods.
- **Coverage**:
  - Every new feature, service method, or bugfix in `libs/` must have accompanying tests in `*.spec.ts`.
  - All tests must pass before proposing code changes (`npm run test:lib`).

### 5.4 Code Formatting & Linting
- **Prettier**:
  - Tabs are used for indentation (tab width: 4 or editor default, check `.prettierrc` / `.editorconfig`).
  - Single quotes are preferred for TypeScript.
  - Organized imports are enforced via `prettier-plugin-organize-imports`.
- **ESLint**:
  - Follow `@angular-eslint` rules.
  - Template self-closing tags are required (`@angular-eslint/template/prefer-self-closing-tags`).
  - Do not run any format or lint command and let human run this before committing

---

## 6. CI/CD & Release Pipeline

The repository uses GitHub Actions with three primary workflows:

1. **`unit-tests.yaml`**:
   - Triggers on push and pull requests to `main` and `release/**` (ignoring `*.md` files).
   - Executes `npm run test:ci` under Node.js 24.x.
2. **`quality.yaml`**:
   - Triggers on push and pull requests to `main` and `release/**`.
   - Executes `npm run lint:lib` and `npm run format:check`.
3. **`build-publish.yaml`**:
   - Triggers on push to `main` or `release/**` branches, and PRs targeting `main`.
   - On `release/**` branches:
     - Automatically derives the base version from the branch name (e.g. `release/22.0`).
     - Queries tags to increment the patch version.
     - Updates workspace versions (`npm version $VERSION --workspaces true ...`).
     - Builds the library (`npm run build`).
     - Tags the release (`v$VERSION`) and pushes the tag.
     - Copies `README.md` to `dist/libs/angular-svg-icon-preloader` and publishes to npm (`npm publish --access public`).

---

## 7. Agent Checklist Before Submitting Changes

Before concluding any task or pushing a pull request, ensure:
1. Changes adhere to the project scope (`libs/` vs `apps/`).
2. Public APIs are exported in `libs/angular-svg-icon-preloader/src/index.ts`.
3. Unit tests pass: `npm run test:lib`.
4. Library compiles without errors: `npm run build`.
5. Commit message conforms to Conventional Commits format.

