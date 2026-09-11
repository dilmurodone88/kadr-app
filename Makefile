# Kadr Tizimi — DevOps yordamchi buyruqlari
# Ishlatish: `make <buyruq>` (masalan: make up)

.DEFAULT_GOAL := help
COMPOSE := docker compose

.PHONY: help up dev dev-down down restart build rebuild logs ps seed reset sh dbsh health prune

DEV := -f docker-compose.yml -f docker-compose.dev.yml

help: ## Buyruqlar ro'yxati
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

up: ## Konteynerlarni ko'tarish — PRODUCTION (next start)
	$(COMPOSE) up -d --build
	@echo "✅ Ochish: http://localhost"

dev: ## Hot-reload DEV rejimida ko'tarish (next dev, jonli o'zgarish)
	$(COMPOSE) $(DEV) up -d --build
	@echo "✅ DEV: http://localhost (kod o'zgarishi darhol ko'rinadi)"

dev-down: ## Dev stack'ni to'xtatish
	$(COMPOSE) $(DEV) down

down: ## Konteynerlarni to'xtatish
	$(COMPOSE) down

restart: ## Qayta ishga tushirish
	$(COMPOSE) restart

build: ## Image'larni qurish (ishga tushirmasdan)
	$(COMPOSE) build

rebuild: ## Toza qayta qurish (cache'siz)
	$(COMPOSE) build --no-cache

logs: ## Barcha loglar (jonli)
	$(COMPOSE) logs -f

ps: ## Konteynerlar holati
	$(COMPOSE) ps

seed: ## Seed'ni qayta ishga tushirish (migrate service)
	$(COMPOSE) run --rm migrate

reset: ## HAMMANI o'chirish (DB volume bilan) va qayta ko'tarish — DIQQAT: ma'lumot o'chadi
	$(COMPOSE) down -v
	$(COMPOSE) up -d --build

sh: ## App konteyneriga kirish
	$(COMPOSE) exec app sh

dbsh: ## MySQL CLI'ga kirish
	$(COMPOSE) exec db sh -c 'mysql -u$$MYSQL_USER -p$$MYSQL_PASSWORD $$MYSQL_DATABASE'

health: ## App health tekshiruvi
	@curl -fsS http://localhost/api/health && echo "" || echo "❌ App javob bermadi"

prune: ## Ishlatilmayotgan Docker resurslarini tozalash
	docker system prune -f
