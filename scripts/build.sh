#!/bin/bash
npm --no-git-tag-version --tag-version-prefix="" version patch
docker build -t docker.pkg.github.com/podnoms/podnoms-scraper/podnoms-scraper .
az acr login --name podnoms
docker push docker.pkg.github.com/podnoms/podnoms-scraper/podnoms-scraper
