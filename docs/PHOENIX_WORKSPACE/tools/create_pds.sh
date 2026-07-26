#!/usr/bin/env bash

###############################################################################
#
#  PHOENIX WORKSPACE TOOLKIT
#
#  Script: create_pds.sh
#  Version: 1.0.0
#
#  Creates the complete Phoenix Development System documentation structure.
#
###############################################################################

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

PDS_DIR="$ROOT_DIR/15_PLAYBOOKS/PDS"

echo ""
echo "=============================================="
echo " PHOENIX DEVELOPMENT SYSTEM GENERATOR"
echo "=============================================="
echo ""

mkdir -p "$PDS_DIR"

FILES=(
"README.md"
"00_PHOENIX_DEVELOPMENT_SYSTEM.md"
"01_PRINCIPLES.md"
"02_PROJECT_LIFECYCLE.md"
"03_STANDARD_WORKFLOW.md"
"04_DOCUMENTATION_SYSTEM.md"
"05_AI_COLLABORATION.md"
"06_QUALITY_SYSTEM.md"
"07_RELEASE_MODEL.md"
"08_CHECKLISTS.md"
"09_FUTURE_EVOLUTION.md"
)

CREATED=0
SKIPPED=0

for file in "${FILES[@]}"; do

    target="$PDS_DIR/$file"

    if [[ -f "$target" ]]; then
        echo "SKIP  $file"
        ((SKIPPED++))
    else
        cat > "$target" <<EOF
# ${file%.md}

Status: Draft

---

TODO

EOF
        echo "CREATE $file"
        ((CREATED++))
    fi

done

echo ""
echo "----------------------------------------------"
echo "Created : $CREATED"
echo "Skipped : $SKIPPED"
echo "Location: $PDS_DIR"
echo "----------------------------------------------"
echo ""
echo "Phoenix Development System successfully generated."
echo ""
