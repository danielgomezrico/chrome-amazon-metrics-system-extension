.PHONY: build clean test

EXTENSION_FILES = manifest.json content.js background.js popup.html popup.css popup.js
ICON_FILES = icons/icon16.png icons/icon48.png icons/icon128.png
DIST_DIR = dist
ZIP_NAME = amazon-imperial-to-metric.zip

build: clean test
	npx esbuild src/content.js --bundle --format=iife --outfile=content.js
	mkdir -p $(DIST_DIR)
	cd /Users/dan/projects/chrome-metrics-changer && zip -j $(DIST_DIR)/$(ZIP_NAME) $(EXTENSION_FILES)
	cd /Users/dan/projects/chrome-metrics-changer && zip $(DIST_DIR)/$(ZIP_NAME) $(ICON_FILES)
	@echo "Built $(DIST_DIR)/$(ZIP_NAME)"

test:
	node --test

clean:
	rm -rf $(DIST_DIR)
