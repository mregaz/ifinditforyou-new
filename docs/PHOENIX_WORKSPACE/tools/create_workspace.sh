#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

DIRECTORIES=(
  "00_FOUNDATION"
  "01_DISCOVERY"
  "02_REQUIREMENTS"
  "03_ARCHITECTURE"
  "04_SPRINTS"
  "05_RELEASES"
  "06_ADR"
  "07_MARKET_INTELLIGENCE"
  "08_PRODUCT"
  "09_GO_TO_MARKET"
  "10_BUSINESS"
  "11_OPERATIONS"
  "12_REFERENCE"
  "13_ASSETS"
  "14_IDENTITY"
  "15_PLAYBOOKS"
  "16_TEMPLATES"
)

created_directories=0
existing_directories=0
created_readmes=0
existing_readmes=0

echo
echo "========================================="
echo " Phoenix Workspace Bootstrap"
echo "========================================="
echo
echo "Workspace: $WORKSPACE_DIR"
echo

for directory in "${DIRECTORIES[@]}"; do
  target="$WORKSPACE_DIR/$directory"
  readme="$target/README.md"

  if [ -d "$target" ]; then
    echo "DIR OK     $directory"
    existing_directories=$((existing_directories + 1))
  else
    mkdir -p "$target"
    echo "DIR CREATA $directory"
    created_directories=$((created_directories + 1))
  fi

  if [ -f "$readme" ]; then
    echo "README OK  $directory/README.md"
    existing_readmes=$((existing_readmes + 1))
  else
    touch "$readme"
    echo "README NEW $directory/README.md"
    created_readmes=$((created_readmes + 1))
  fi
done

echo
echo "-----------------------------------------"
echo "Cartelle create : $created_directories"
echo "Cartelle esistenti: $existing_directories"
echo "README creati   : $created_readmes"
echo "README esistenti: $existing_readmes"
echo "-----------------------------------------"
echo
echo "Bootstrap completato con successo."
echo
