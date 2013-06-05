test:
	./node_modules/.bin/mocha \
		$(find test -name '*test.js') \
        --reporter list \
		--timeout 2000
install:
	npm install .
.PHONY: test