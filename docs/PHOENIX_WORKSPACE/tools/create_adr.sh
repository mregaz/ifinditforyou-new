#!/usr/bin/env bash

set -euo pipefail

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ADR_DIR="$WORKSPACE_ROOT/06_ADR"

if [ $# -lt 2 ]; then
    echo "Usage:"
    echo "./tools/create_adr.sh <number> \"Title\""
    exit 1
fi

ADR_NUMBER="$1"
shift

TITLE="$*"

FILENAME_TITLE="$(printf '%s' "$TITLE" \
    | tr '[:lower:]' '[:upper:]' \
    | sed 's/[^A-Z0-9]/_/g' \
    | tr -s '_' \
    | sed 's/^_//;s/_$//')"

FILE_NAME="ADR-${ADR_NUMBER}_${FILENAME_TITLE}.md"

TARGET_FILE="$ADR_DIR/$FILE_NAME"

mkdir -p "$ADR_DIR"

if [ -f "$TARGET_FILE" ]; then
    echo
    echo "ADR already exists:"
    echo "$TARGET_FILE"
    exit 0
fi

TODAY="$(date +%Y-%m-%d)"

cat > "$TARGET_FILE" <<EOF
# ADR-${ADR_NUMBER} — ${TITLE}

**Status:** Proposed

**Date:** ${TODAY}

---

# Context

TODO

---

# Problem

TODO

---

# Decision

TODO

---

# Alternatives Considered

## Option 1

TODO

## Option 2

TODO

---

# Consequences

## Positive

-

## Negative

-

---

# Risks

TODO

---

# References

-
EOF

echo
echo "======================================="
echo " ADR CREATED"
echo "======================================="
echo
echo "File:"
echo "$TARGET_FILE"
echo
