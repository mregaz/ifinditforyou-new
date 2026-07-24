#!/usr/bin/env bash

set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

errors=0
warnings=0
checks=0

EXPECTED_DIRECTORIES="
00_FOUNDATION
01_DISCOVERY
02_REQUIREMENTS
03_ARCHITECTURE
04_SPRINTS
05_RELEASES
06_ADR
07_MARKET_INTELLIGENCE
08_PRODUCT
09_GO_TO_MARKET
10_BUSINESS
11_OPERATIONS
12_REFERENCE
13_ASSETS
14_IDENTITY
15_PLAYBOOKS
16_TEMPLATES
tools
"

pass() {
    checks=$((checks + 1))
    printf "PASS  %s\n" "$1"
}

fail() {
    checks=$((checks + 1))
    errors=$((errors + 1))
    printf "FAIL  %s\n" "$1"
}

warn() {
    checks=$((checks + 1))
    warnings=$((warnings + 1))
    printf "WARN  %s\n" "$1"
}

section() {
    echo
    echo "------------------------------------------------------------"
    echo "$1"
    echo "------------------------------------------------------------"
}

echo "============================================================"
echo "          PHOENIX WORKSPACE VALIDATOR v1.0"
echo "============================================================"
echo
echo "Workspace:"
echo "$WORKSPACE_DIR"

cd "$WORKSPACE_DIR" || exit 1

section "1. REQUIRED DIRECTORY STRUCTURE"

missing_directories=0

for directory in $EXPECTED_DIRECTORIES; do
    if [ -d "$directory" ]; then
        printf "  OK    %s\n" "$directory"
    else
        printf "  ERROR %s is missing\n" "$directory"
        missing_directories=$((missing_directories + 1))
    fi
done

if [ "$missing_directories" -eq 0 ]; then
    pass "All required directories exist."
else
    fail "$missing_directories required directorie(s) are missing."
fi

section "2. README COVERAGE"

missing_readmes=0

for directory in $EXPECTED_DIRECTORIES; do
    [ "$directory" = "tools" ] && continue
    [ ! -d "$directory" ] && continue

    if [ -f "$directory/README.md" ] || [ -f "$directory/00_README.md" ]; then
        printf "  OK    %s\n" "$directory"
    else
        printf "  ERROR %s has no README.md or 00_README.md\n" "$directory"
        missing_readmes=$((missing_readmes + 1))
    fi
done

if [ "$missing_readmes" -eq 0 ]; then
    pass "README coverage is complete."
else
    fail "$missing_readmes directorie(s) have no README."
fi

section "3. DOUBLE MARKDOWN EXTENSIONS"

double_extensions_file="$(mktemp)"

find . -type f -name "*.md.md" -print > "$double_extensions_file"

if [ -s "$double_extensions_file" ]; then
    cat "$double_extensions_file" | sed 's/^/  ERROR /'
    fail "Files with duplicated .md.md extensions were found."
else
    pass "No duplicated .md.md extensions."
fi

section "4. FILENAMES CONTAINING SPACES"

spaces_file="$(mktemp)"

find . -type f -print | grep " " > "$spaces_file" || true

if [ -s "$spaces_file" ]; then
    cat "$spaces_file" | sed 's/^/  ERROR /'
    fail "Filenames containing spaces were found."
else
    pass "No filenames contain spaces."
fi

section "5. FILENAMES CONTAINING TABS"

tabs_file="$(mktemp)"

find . -type f -print | grep "$(printf '\t')" > "$tabs_file" || true

if [ -s "$tabs_file" ]; then
    cat "$tabs_file" | sed 's/^/  ERROR /'
    fail "Filenames containing tab characters were found."
else
    pass "No filenames contain tab characters."
fi

section "6. MACOS METADATA"

ds_store_file="$(mktemp)"

find . -name ".DS_Store" -print > "$ds_store_file"

if [ -s "$ds_store_file" ]; then
    cat "$ds_store_file" | sed 's/^/  WARN  /'
    warn ".DS_Store files were found."
else
    pass "No .DS_Store files."
fi

section "7. EMPTY DIRECTORIES"

empty_directories_file="$(mktemp)"

find . -type d -empty \
    ! -path "./.git*" \
    -print > "$empty_directories_file"

if [ -s "$empty_directories_file" ]; then
    cat "$empty_directories_file" | sed 's/^/  WARN  /'
    warn "Empty directories were found."
else
    pass "No empty directories."
fi

section "8. DUPLICATED NESTED DIRECTORY NAMES"

nested_duplicates_file="$(mktemp)"
: > "$nested_duplicates_file"

while IFS= read -r directory; do
    [ "$directory" = "." ] && continue

    directory_name="$(basename "$directory")"
    parent_directory="$(dirname "$directory")"
    parent_name="$(basename "$parent_directory")"

    if [ "$directory_name" = "$parent_name" ]; then
        echo "$directory" >> "$nested_duplicates_file"
    fi
done < <(find . -type d ! -path "./.git*" -print)

if [ -s "$nested_duplicates_file" ]; then
    cat "$nested_duplicates_file" | sed 's/^/  ERROR /'
    fail "Duplicated nested directory names were found."
else
    pass "No duplicated nested directory names."
fi


section "9. EXECUTABLE TOOL PERMISSIONS"

permission_errors=0

for tool in \
    tools/create_workspace.sh \
    tools/migrate_workspace.sh \
    tools/validate_workspace.sh
do
    if [ ! -f "$tool" ]; then
        printf "  ERROR %s does not exist\n" "$tool"
        permission_errors=$((permission_errors + 1))
    elif [ -x "$tool" ]; then
        printf "  OK    %s\n" "$tool"
    else
        printf "  ERROR %s is not executable\n" "$tool"
        permission_errors=$((permission_errors + 1))
    fi
done

if [ "$permission_errors" -eq 0 ]; then
    pass "All Toolkit scripts have executable permissions."
else
    fail "$permission_errors Toolkit script(s) require chmod +x."
fi

cat >> validate_workspace.sh <<'EOF'

section "10. TOOLKIT FILES"

toolkit_missing=0

for file in \
    tools/create_workspace.sh \
    tools/migrate_workspace.sh \
    tools/workspace-map.conf \
    tools/validate_workspace.sh
do
    if [ -f "$file" ]; then
        printf "  OK    %s\n" "$file"
    else
        printf "  ERROR %s is missing\n" "$file"
        toolkit_missing=$((toolkit_missing + 1))
    fi
done

if [ "$toolkit_missing" -eq 0 ]; then
    pass "Core Toolkit files are present."
else
    fail "$toolkit_missing Toolkit file(s) are missing."
fi

section "VALIDATION SUMMARY"

echo "Checks executed : $checks"
echo "Errors          : $errors"
echo "Warnings        : $warnings"
echo

if [ "$errors" -eq 0 ]; then
    echo "OVERALL STATUS  : PASS"
    echo
    echo "The Phoenix Workspace structure is valid."
    result=0
else
    echo "OVERALL STATUS  : FAIL"
    echo
    echo "Correct the reported errors and execute the validator again."
    result=1
fi

rm -f \
    "$double_extensions_file" \
    "$spaces_file" \
    "$tabs_file" \
    "$ds_store_file" \
    "$empty_directories_file" \
    "$nested_duplicates_file"

echo
echo "============================================================"

exit "$result"
EOF