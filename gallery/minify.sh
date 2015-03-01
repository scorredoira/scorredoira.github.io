#!/bin/bash

echo js
java -jar /syltek/src/tools/compiler.jar --charset UTF-8 --js \
	../s/s.core.js \
	./script.js \
	--js_output_file min/script.min.js


echo css
java -jar /syltek/src/tools/closure-stylesheets-20111230.jar --allow-unrecognized-properties \
	./styles.css > min/styles.min.css



