UGLIJS := $(shell bash -c "command -v uglifyjs | head -n 1")

dist: normal

clean:
	rm -rf dist

normal:
	mkdir -p dist ; { echo "// Build by" $$(whoami) "@" $$(date) ; script/template.sh src/browser.js ; } > dist/browser.js
	mkdir -p dist ; { echo "// Build by" $$(whoami) "@" $$(date) ; script/template.sh src/node.js    ; } > dist/node.js

#minified: normal
#	mkdir -p dist ; { echo "// Build by" $$(whoami) "@" $$(date) ; cat dist/notify-sl.js | $(UGLIJS) ; } > dist/notify-sl.min.js
