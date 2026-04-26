.DEFAULT_GOAL := help

.PHONY: help install format lint typecheck test test-coverage build e2e validate-env validate-pr

help:
	@echo "Available targets:"
	@echo "  make install        - Install Node dependencies"
	@echo "  make format         - Format supported files with Prettier"
	@echo "  make lint           - Run ESLint"
	@echo "  make typecheck      - Run TypeScript checks"
	@echo "  make test           - Run unit tests"
	@echo "  make test-coverage  - Run unit tests with coverage"
	@echo "  make build          - Build the web app"
	@echo "  make e2e            - Run Playwright tests"
	@echo "  make validate-env   - Run FFmpeg/NGINX environment checks"
	@echo "  make validate-pr    - Run the full local validation suite"

install:
	npm install

format:
	npx prettier --write .

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm run test

test-coverage:
	npm run test:coverage

build:
	npm run build

e2e:
	npm run e2e

validate-env:
	npm run validate:env

validate-pr:
	npm run validate:push
