.PHONY: deploy

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

prompt-test:
	npx tsx ./scripts/prompt-test.ts

edit-distance-test:
	npx tsx ./scripts/edit-distance-test.ts

edit-distance-test2:
	npx tsx ./scripts/edit-distance-test/run7.ts

extract-tips:
	npx tsx ./scripts/extract-tips/run2.ts

fix-unintentional-edits:
	npx tsx ./scripts/fix-unintentional-edits/run1.ts

test-fuzzy-match:
	npx tsx ./scripts/fuzzy-match/fuzzy-match-test.ts

deploy:
	bash deploy.sh