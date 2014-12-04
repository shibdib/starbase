# Starbase makefile.
# Generate the app javascript file from the static javascript data dump and the app source code.

default: starbase.pack.html

static.js: gen-static.py sqlite-latest.sqlite
	./gen-static.py > $@
