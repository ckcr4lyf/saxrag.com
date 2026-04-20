static:
	bundle exec jekyll build

watch:
	bundle exec jekyll build --watch

serve:
	bundle exec jekyll serve

# Zola targets
zola-build:
	cd zola && zola build

zola-serve:
	cd zola && zola serve

zola-check:
	cd zola && zola check