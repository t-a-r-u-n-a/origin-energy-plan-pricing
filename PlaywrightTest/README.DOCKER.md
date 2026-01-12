# Docker guide — Run Playwright tests in Docker ✅

This document shows how to build and run the Playwright tests inside Docker and Docker Compose.

## Pre-condition
Install Docker desktop with WSL2 enabled

## Build the image

From the repository root:

- Build locally:

  docker build -t origin-playwright .

## Run the tests

- Run using docker (recommended for CI) - powershell command:

  docker run --rm -v "${PWD}:/app" -v origin_playwright_report:/app/playwright-report -v /app/node_modules origin-playwright npx playwright test tests/origin-pricing.spec.ts

Notes:
- On Windows PowerShell use `${PWD}` instead of `$(pwd)`.

## Run a single spec or add args

- Run a single spec:

  docker run --rm -v "${PWD}:/app" -v origin_playwright_report:/app/playwright-report -v /app/node_modules origin-playwright npx playwright test tests/origin-pricing.spec.ts

- Pass any Playwright CLI args; they are forwarded directly.

## Use docker-compose

- Build & run:

  docker-compose up --build --abort-on-container-exit

- The `docker-compose.yml` uses the same entrypoint to run tests by default.

## Helpful tips for CI

- Set `CI=true` environment variable (image already uses it in examples)
- Mount a volume for `test-results` and `playwright-report` to persist artifacts
- Use `--exit-code-from` when running multiple services

---
 🔧
