#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

commitlint -E HUSKY_GIT_PARAMS
