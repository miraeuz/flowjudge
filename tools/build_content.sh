#!/bin/sh
# Rebuilds all topics from the teacher's sources only (book + old-chat Nested For)
set -e
python3 tools/build_content.py
