#!/usr/bin/env bash

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

errors=0
warnings=0
checks=0

EXPECTED_DIRECTORIES=(
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
    "tools"
)

EXECUTABLE_TOOLS=(
    "tools/create_workspace.sh"
    "tools/migrate_workspace.sh"
    "tools/validate_workspace.sh"
)

TOOLKIT_FILES=(
    "tools/create_workspace.sh"
    "tools/migrate_workspace.sh"
    "tools/validate_workspace.sh"
    "tools/workspace-map.conf"
)

TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-validator.XXXXXX")"

cleanup() {
    rm -rf "$TEMP_DIR"
}

trap cleanup EXIT HUP INT TERM

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
    printf "\n"
    printf '%s\n' "------------------------------------------------------------"
    printf '%s\n' "$1"
    printf '%s\n' "------------------------------------------------------------"
}

print_report_file() {
    local prefix="$1"
    local report_file="$2"

    while IFS= read -r item; do
        printf "  %-5s %s\n" "$prefix" "$item"
    done < "$report_file"
}

printf '%s\n' "============================================================"
printf '%s\n' "          PHOENIX WORKSPACE VALIDATOR v1.0"
printf '%s\n' "============================================================"
printf "\nWorkspace:\n%s\n" "$WORKSPACE_DIR"

if ! cd "$WORKSPACE_DIR"; then
    printf "FATAL Unable to access Workspace directory: %s\n" "$WORKSPACE_DIR" >&2
    exit 2
fi

section "1. REQUIRED DIRECTORY STRUCTURE"

missing_directories=0

for directory in "${EXPECTED_DIRECTORIES[@]}"; do
    if [[ -d "$directory" ]]; then
        printf "  OK    %s\n" "$directory"
    else
        printf "  ERROR %s is missing\n" "$directory"
        missing_directories=$((missing_directories + 1))
    fi
done

if (( missing_directories == 0 )); then
    pass "All required directories exist."
else
    fail "$missing_directories required directory/directories are missing."
fi

section "2. README COVERAGE"

missing_readmes=0

for directory in "${EXPECTED_DIRECTORIES[@]}"; do
    [[ "$directory" == "tools" ]] && continue
    [[ ! -d "$directory" ]] && continue

    if [[ -f "$directory/README.md" || -f "$directory/00_README.md" ]]; then
        printf "  OK    %s\n" "$directory"
    else
        printf "  ERROR %s has no README.md or 00_README.md\n" "$directory"
        missing_readmes=$((missing_readmes + 1))
    fi
done

if (( missing_readmes == 0 )); then
    pass "README coverage is complete."
else
    fail "$missing_readmes directory/directories have no README."
fi

section "3. DOUBLE MARKDOWN EXTENSIONS"

double_extensions_file="$TEMP_DIR/double-markdown-extensions.txt"

find . \
    -type f \
    -name "*.md.md" \
    ! -path "./.git/*" \
    -print > "$double_extensions_file"

if [[ -s "$double_extensions_file" ]]; then
    print_report_file "ERROR" "$double_extensions_file"
    fail "Files with duplicated .md.md extensions were found."
else
    pass "No duplicated .md.md extensions."
fi

section "4. PATH NAMES CONTAINING SPACES"

spaces_file="$TEMP_DIR/spaces.txt"
: > "$spaces_file"

while IFS= read -r -d '' path; do
    if [[ "$path" == *" "* ]]; then
        printf '%s\n' "$path" >> "$spaces_file"
    fi
done < <(
    find . \
        -mindepth 1 \
        ! -path "./.git" \
        ! -path "./.git/*" \
        -print0
)

if [[ -s "$spaces_file" ]]; then
    print_report_file "ERROR" "$spaces_file"
    fail "File or directory names containing spaces were found."
else
    pass "No file or directory names contain spaces."
fi

section "5. PATH NAMES CONTAINING TABS"

tabs_file="$TEMP_DIR/tabs.txt"
: > "$tabs_file"

tab_character=$'\t'

while IFS= read -r -d '' path; do
    if [[ "$path" == *"$tab_character"* ]]; then
        printf '%s\n' "$path" >> "$tabs_file"
    fi
done < <(
    find . \
        -mindepth 1 \
        ! -path "./.git" \
        ! -path "./.git/*" \
        -print0
)

if [[ -s "$tabs_file" ]]; then
    print_report_file "ERROR" "$tabs_file"
    fail "File or directory names containing tab characters were found."
else
    pass "No file or directory names contain tab characters."
fi

section "6. MACOS METADATA"

ds_store_file="$TEMP_DIR/ds-store.txt"

find . \
    -name ".DS_Store" \
    ! -path "./.git/*" \
    -print > "$ds_store_file"

if [[ -s "$ds_store_file" ]]; then
    print_report_file "WARN" "$ds_store_file"
    warn ".DS_Store files were found."
else
    pass "No .DS_Store files."
fi

section "7. EMPTY DIRECTORIES"

empty_directories_file="$TEMP_DIR/empty-directories.txt"

find . \
    -type d \
    -empty \
    ! -path "./.git" \
    ! -path "./.git/*" \
    -print > "$empty_directories_file"

if [[ -s "$empty_directories_file" ]]; then
    print_report_file "WARN" "$empty_directories_file"
    warn "Empty directories were found."
else
    pass "No empty directories."
fi

section "8. DUPLICATED NESTED DIRECTORY NAMES"

nested_duplicates_file="$TEMP_DIR/nested-duplicates.txt"
: > "$nested_duplicates_file"

while IFS= read -r -d '' directory; do
    [[ "$directory" == "." ]] && continue

    directory_name="$(basename "$directory")"
    parent_directory="$(dirname "$directory")"
    parent_name="$(basename "$parent_directory")"

    if [[ "$directory_name" == "$parent_name" ]]; then
        printf '%s\n' "$directory" >> "$nested_duplicates_file"
    fi
done < <(
    find . \
        -type d \
        ! -path "./.git" \
        ! -path "./.git/*" \
        -print0
)

if [[ -s "$nested_duplicates_file" ]]; then
    print_report_file "ERROR" "$nested_duplicates_file"
    fail "Duplicated nested directory names were found."
else
    pass "No duplicated nested directory names."
fi

section "9. EXECUTABLE TOOL PERMISSIONS"

permission_errors=0

for tool in "${EXECUTABLE_TOOLS[@]}"; do
    if [[ ! -f "$tool" ]]; then
        printf "  ERROR %s does not exist\n" "$tool"
        permission_errors=$((permission_errors + 1))
    elif [[ -x "$tool" ]]; then
        printf "  OK    %s\n" "$tool"
    else
        printf "  ERROR %s is not executable\n" "$tool"
        permission_errors=$((permission_errors + 1))
    fi
done

if (( permission_errors == 0 )); then
    pass "All Toolkit scripts have executable permissions."
else
    fail "$permission_errors Toolkit script(s) require executable permissions."
fi

section "10. TOOLKIT FILES"

toolkit_missing=0

for file in "${TOOLKIT_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        printf "  OK    %s\n" "$file"
    else
        printf "  ERROR %s is missing\n" "$file"
        toolkit_missing=$((toolkit_missing + 1))
    fi
done

if (( toolkit_missing == 0 )); then
    pass "Core Toolkit files are present."
else
    fail "$toolkit_missing Toolkit file(s) are missing."
fi

section "VALIDATION SUMMARY"

printf "Checks executed : %s\n" "$checks"
printf "Errors          : %s\n" "$errors"
printf "Warnings        : %s\n" "$warnings"
printf "\n"

if (( errors == 0 )); then
    printf '%s\n' "OVERALL STATUS  : PASS"
    printf "\n"
    printf '%s\n' "The Phoenix Workspace structure is valid."

    if (( warnings > 0 )); then
        printf '%s\n' "Review the reported warnings before certification."
    fi

    result=0
else
    printf '%s\n' "OVERALL STATUS  : FAIL"
    printf "\n"
    printf '%s\n' "Correct the reported errors and execute the validator again."
    result=1
fi

printf "\n"
printf '%s\n' "============================================================"

exit "$result"