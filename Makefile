deploy-backend:
	cp -r ./core/. ./backend/core
	git add backend/
	git commit -m "add backend core"
	git push heroku `git subtree split --prefix backend main`:main --force
	git reset HEAD~
	rm -rf ./backend/core