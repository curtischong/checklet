.PHONY: deploy

include_env = source .env-dev && echo "DB CREDS IS $$DATABASE_URL"
include_env_prod = source .env-prod && echo "DB CREDS IS $$DATABASE_URL ------------------ PRODUCTION---------------"

run:
	npm run dev

generate:
	$(include_env) && \
	npx prisma generate --schema prisma/schema.prisma

create-migration:
	$(include_env) && \
	npx prisma migrate dev && \
	$(MAKE) generate

reset-db:
	$(include_env) && \
	npx prisma migrate reset --skip-generate && \
	$(MAKE) generate

apply-all-migrations-prod:
	$(include_env_prod) && \
	npx prisma migrate deploy

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

matching-tests:
	npx tsx ./scripts/matching-tests/run1.ts

matching-tests2:
	npx tsx ./scripts/matching-tests/run2.ts