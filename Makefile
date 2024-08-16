include .env
export

COMPOSE=docker compose -f ./docker/compose.yaml
COMPOSE_PROD=docker compose -f ./docker/compose.production.yaml
COMPOSE_DEPLOY=docker compose -f ./compose.yaml
COMPOSE_EXEC=${COMPOSE} exec -it
SERVER_EXEC=$(COMPOSE_EXEC) server

NPM_RUN=$(COMPOSE_EXEC) server npm run
ifeq ($(p),host)
	NPM_RUN=npm run
endif

compose:
	$(COMPOSE) $(ARGS)

compose-exec:
	$(COMPOSE_EXEC) $(ARGS)

server-exec:
	$(SERVER_EXEC) $(ARGS)

npm-run:
	$(NPM_RUN) $(ARGS)

# docker compose
dc:
	${COMPOSE} $(ARGS)

dc-up:
	${COMPOSE} up -d $(ARGS)

dc-down:
	${COMPOSE} down $(ARGS)

dc-prod:
	${COMPOSE_PROD} $(ARGS)

dc-prod-up:
	${COMPOSE_PROD} up -d $(ARGS)

dc-prod-down:
	${COMPOSE_PROD} down $(ARGS)

dc-deploy-up:
	${COMPOSE_DEPLOY} up -d $(ARGS)

dc-deploy-down:
	${COMPOSE_DEPLOY} down $(ARGS)
