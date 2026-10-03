#!/bin/sh
set -eu
base=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
state="${ICOURSE_QWEN_HOME:-$HOME/Library/Application Support/iCourseQwen}"
exec "$state/venv/bin/python" "$base/service.py" --state-dir "$state" "$@"
