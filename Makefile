.DEFAULT_GOAL := help

.PHONY: help install format lint typecheck test test-coverage build e2e validate-env list-devices demo-check startup-prepare startup-nginx startup-ffmpeg startup-all startup-audio startup-abr startup-stop latency-run validate-pr

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
	@echo "  make list-devices   - List local avfoundation capture devices"
	@echo "  make demo-check     - Check whether the local demo path is ready"
	@echo "  make startup-prepare - Generate local startup artifacts and summary"
	@echo "  make startup-nginx  - Generate artifacts and start NGINX"
	@echo "  make startup-ffmpeg - Generate artifacts and start FFmpeg"
	@echo "  make startup-all    - Generate artifacts and start NGINX and FFmpeg"
	@echo "  make startup-audio  - Generate artifacts and start the audio-enabled live stack"
	@echo "  make startup-abr    - Generate artifacts and start the adaptive DASH live stack"
	@echo "  make startup-stop   - Stop live demo processes"
	@echo "  make latency-run    - Generate a latency summary report"
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

list-devices:
	npm run list:devices

demo-check:
	npm run demo:check

startup-prepare:
	npm run startup:prepare

startup-nginx:
	npm run startup:nginx

startup-ffmpeg:
	npm run startup:ffmpeg

startup-all:
	npm run startup:all

startup-audio:
	npm run startup:audio

startup-abr:
	npm run startup:abr

startup-stop:
	npm run startup:stop

latency-run:
	npm run latency:run

validate-pr:
	npm run validate:push
