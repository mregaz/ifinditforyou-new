#!/usr/bin/env bash

set -euo pipefail

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT_ROOT="$(cd "$WORKSPACE_ROOT/../.." && pwd)"
PROVIDERS_DIR="$PROJECT_ROOT/lib/finder/providers"

if [ $# -ne 1 ]; then
    echo "Usage: ./tools/create_provider.sh <provider-name>"
    exit 1
fi

PROVIDER_NAME="$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]')"
PROVIDER_CLASS_NAME="$(printf '%s' "$PROVIDER_NAME" | awk '{print toupper(substr($0,1,1)) substr($0,2)}')"

TARGET_DIR="$PROVIDERS_DIR/$PROVIDER_NAME"

FILES=(
    fetch.ts
    parser.ts
    validator.ts
    mapper.ts
    types.ts
    index.ts
    README.md
)

mkdir -p "$TARGET_DIR"

CREATED=0
SKIPPED=0

echo "=============================================="
echo " PHOENIX PROVIDER GENERATOR"
echo "=============================================="
echo
echo "Provider: $PROVIDER_NAME"
echo

for FILE in "${FILES[@]}"; do
    TARGET_FILE="$TARGET_DIR/$FILE"

    if [ -f "$TARGET_FILE" ]; then
        echo "SKIP $FILE"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    case "$FILE" in

        fetch.ts)
            cat > "$TARGET_FILE" <<EOF
export async function fetch${PROVIDER_CLASS_NAME}(
  query: string
): Promise<string> {
  throw new Error("Not implemented");
}
EOF
            ;;

        parser.ts)
            cat > "$TARGET_FILE" <<EOF
import type { ${PROVIDER_CLASS_NAME}Listing } from "./types";

export function parse${PROVIDER_CLASS_NAME}Html(
  html: string
): ${PROVIDER_CLASS_NAME}Listing[] {
  void html;

  return [];
}
EOF
            ;;

        validator.ts)
            cat > "$TARGET_FILE" <<EOF
import type { ${PROVIDER_CLASS_NAME}Listing } from "./types";

export function validate${PROVIDER_CLASS_NAME}Listing(
  listing: ${PROVIDER_CLASS_NAME}Listing
): boolean {
  return Boolean(
    listing.id &&
    listing.title &&
    listing.url
  );
}
EOF
            ;;

        mapper.ts)
            cat > "$TARGET_FILE" <<EOF
import type { FinderResult } from "../../types";
import type { ${PROVIDER_CLASS_NAME}Listing } from "./types";

export function map${PROVIDER_CLASS_NAME}Listing(
  listing: ${PROVIDER_CLASS_NAME}Listing,
  index: number
): FinderResult {
  return {
    id: listing.id,
    title: listing.title,
    source: "${PROVIDER_NAME}",
    url: listing.url,
    snippet: listing.description,
    score: Math.max(1, 70 - index),
  };
}
EOF
            ;;

        types.ts)
            cat > "$TARGET_FILE" <<EOF
export interface ${PROVIDER_CLASS_NAME}Listing {
  id: string;
  title: string;
  url: string;
  description?: string;
  price?: string;
  location?: string;
  imageUrl?: string;
}
EOF
            ;;

        index.ts)
            cat > "$TARGET_FILE" <<EOF
export * from "./fetch";
export * from "./parser";
export * from "./validator";
export * from "./mapper";
export * from "./types";
EOF
            ;;

        README.md)
            cat > "$TARGET_FILE" <<EOF
# ${PROVIDER_CLASS_NAME} Provider

Status: Draft

## Purpose

Integrare il provider ${PROVIDER_CLASS_NAME} nel motore Phoenix.

## Pipeline

1. Fetch
2. Parse
3. Validate
4. Map
5. Return FinderResult

## Files

- \`fetch.ts\`
- \`parser.ts\`
- \`validator.ts\`
- \`mapper.ts\`
- \`types.ts\`
- \`index.ts\`

## Development Status

- [ ] Discovery completata
- [ ] Fetch implementato
- [ ] Parser implementato
- [ ] Validator implementato
- [ ] Mapper implementato
- [ ] Test aggiunti
- [ ] Registry aggiornato
EOF
            ;;

    esac

    echo "CREATE $FILE"
    CREATED=$((CREATED + 1))
done

echo
echo "----------------------------------------------"
echo "Created : $CREATED"
echo "Skipped : $SKIPPED"
echo "Location: $TARGET_DIR"
echo "----------------------------------------------"
