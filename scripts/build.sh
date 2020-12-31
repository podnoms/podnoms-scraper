#!/bin/bash
npm --no-git-tag-version --tag-version-prefix="" version patch
docker build -t podnoms.azurecr.io/podnoms.scraper .
az acr login --name podnoms
docker push podnoms.azurecr.io/podnoms.scraper
