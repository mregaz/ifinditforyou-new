#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE_V2="$(cd "$SCRIPT_DIR/.." && pwd)"
MAP_FILE="$SCRIPT_DIR/workspace-map.conf"
WORKSPACE_V1="$HOME/Documents/PHOENIX_WORKSPACE"

echo "=========================================="
echo "   PHOENIX Workspace Migration Engine"
echo "=========================================="
echo
echo "Source : $WORKSPACE_V1"
echo "Target : $WORKSPACE_V2"
echo

if [ ! -d "$WORKSPACE_V1" ]; then
    echo "ERROR: Workspace V1 non trovata:"
    echo "$WORKSPACE_V1"
    exit 1
fi

if [ ! -d "$WORKSPACE_V2" ]; then
    echo "ERROR: Workspace V2 non trovata:"
    echo "$WORKSPACE_V2"
    exit 1
fi

if [ ! -f "$MAP_FILE" ]; then
    echo "ERROR: file di configurazione non trovato:"
    echo "$MAP_FILE"
    exit 1
fi

migrated=0
missing=0

while IFS='=' read -r source target || [ -n "${source:-}" ]; do
    source="${source%$'\r'}"
    target="${target%$'\r'}"

    [ -z "$source" ] && continue

    case "$source" in
        \#*) continue ;;
    esac

    SRC="$WORKSPACE_V1/$source"
    DST="$WORKSPACE_V2/$target"

    echo
    echo "------------------------------------------"
    echo "$source"
    echo "→ $target"

    if [ ! -d "$SRC" ]; then
        echo "ATTENZIONE: cartella sorgente assente."
        missing=$((missing + 1))
        continue
    fi

    mkdir -p "$DST"

    rsync -a \
        --ignore-existing \
        --exclude='.DS_Store' \
        --exclude='.git/' \
        "$SRC"/ "$DST"/

    echo "OK"
    migrated=$((migrated + 1))

done < "$MAP_FILE"

echo
echo "=========================================="
echo "   Migration completed"
echo "=========================================="
echo
echo "Directories migrated : $migrated"
echo "Directories missing  : $missing"
echo
echo "SAFETY:"
echo "- Existing destination files were not overwritten."
echo "- The original Workspace was not modified."
echo "- The backup remains available."
