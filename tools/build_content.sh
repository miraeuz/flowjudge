#!/bin/sh
# usage: tools/build_content.sh DOCS_DIR   (re-imports worksheets, then adds verified checkers)
set -e
python3 tools/import_problems.py "${1:-tools/_docs_tmp}"
python3 tools/build_checkers.py
