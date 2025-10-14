.PHONY: help install dev build docker-build docker-up docker-down test clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install all dependencies
	npm install
	cd apps/web && npm install
	cd apps/api && npm install

dev: ## Start development servers
	npm run dev

build: ## Build all applications
	npm run build

docker-build: ## Build Docker images
	docker-compose build

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f

test: ## Run tests
	npm run test

clean: ## Clean build artifacts and dependencies
	npm run clean
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf apps/*/.next
	rm -rf apps/*/dist

