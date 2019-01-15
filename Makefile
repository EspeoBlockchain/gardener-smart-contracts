copy-env:
	if ! [ -e .env ]; then cp .env.tpl .env; fi;
