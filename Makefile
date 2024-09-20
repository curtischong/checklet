# Assuming that set_env.sh exports necessary environment variables
include_env = source venv/bin/activate && source set_db_in_env.sh ../config/dist/config.dev.json
include_env_prod = source venv/bin/activate && source set_db_in_env.sh ../config/dist/config.prod.json

# this generates both typescript and python types
generate:
	# $(include_env) && \
	PRISMA_VERSION=5.17.0 && \
	npx prisma@5.17.0 generate --schema schema.prisma

create-migration:
	# $(include_env) && \
	npx prisma migrate dev && \
	$(MAKE) generate

apply-all-migrations-prod:
	$(include_env_prod) && \
	npx prisma migrate deploy

reset-db:
	# $(include_env) && \
	# npx prisma migrate reset --skip-generate && \
	# $(MAKE) generate
	npm run db:reset
	npx prisma migrate dev
	npm run db:push

studio:
	npm run db:studio