#!/bin/sh
git checkout master
git pull
git checkout gh-pages
git checkout master -- web
git checkout master -- sample

