#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — NAMING VALIDATOR
# ==============================================================================
#
# Purpose:
# Validate Phoenix DevKit file naming requirements.
#
# Responsibilities:
# - Validate explicit target existence
# - Validate target directory type
# - Traverse target files recursively in deterministic lexical order
# - Exclude .git metadata trees
# - Reject forbidden macOS metadata
# - Validate shell filenames
# - Validate documentation filenames
# - Validate validator/generator definition filenames
#
# Non-responsibilities:
# - Directory naming
# - Function naming
# - Variable naming
# - Template naming policy
# - Documentation content validation
# - Auto-fix or rename operations
#
# ==============================================================================

if [[ -n "${PHOENIX_VALIDATOR_NAMING_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_VALIDATOR_NAMING_LOADED=1

_phoenix::validator_naming_shell_valid() {
  local filename="${1:-}"

  [[ "$filename" =~ ^[a-z0-9]+(_[a-z0-9]+)*\.sh$ ]]
}

_phoenix::validator_naming_documentation_valid() {
  local filename="${1:-}"

  if [[ "$filename" == "README.md" ]]; then
    return 0
  fi

  [[ "$filename" =~ ^[A-Z0-9]+(_[A-Z0-9]+)*(_v[0-9]+\.[0-9]+)?\.md$ ]]
}

_phoenix::validator_naming_definition_valid() {
  local filename="${1:-}"

  [[ "$filename" =~ ^[a-z0-9]+(_[a-z0-9]+)*\.definition$ ]]
}

phoenix::validator_naming() {
  local target="${1:-}"
  local path
  local filename

  if [[ ! -e "$target" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=target-exists\n'
    printf 'MESSAGE=Validation target does not exist\n'
    return 0
  fi

  if [[ ! -d "$target" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=target-directory\n'
    printf 'MESSAGE=Validation target is not a directory\n'
    return 0
  fi

  while IFS= read -r path; do
    filename="${path##*/}"

    if [[ "$filename" == ".DS_Store" ]]; then
      printf 'RESULT=INVALID\n'
      printf 'CHECK=forbidden-macos-metadata\n'
      printf 'MESSAGE=Forbidden file .DS_Store is present\n'
      return 0
    fi

    case "$filename" in
      *.sh)
        if ! _phoenix::validator_naming_shell_valid "$filename"; then
          printf 'RESULT=INVALID\n'
          printf 'CHECK=shell-file-naming\n'
          printf 'MESSAGE=Invalid shell filename: %s\n' "$filename"
          return 0
        fi
        ;;

      *.md)
        if ! _phoenix::validator_naming_documentation_valid "$filename"; then
          printf 'RESULT=INVALID\n'
          printf 'CHECK=documentation-file-naming\n'
          printf 'MESSAGE=Invalid documentation filename: %s\n' "$filename"
          return 0
        fi
        ;;

      *.definition)
        if ! _phoenix::validator_naming_definition_valid "$filename"; then
          printf 'RESULT=INVALID\n'
          printf 'CHECK=definition-file-naming\n'
          printf 'MESSAGE=Invalid definition filename: %s\n' "$filename"
          return 0
        fi
        ;;

      *.tpl)
        # Template naming is explicitly out of scope in V02.
        ;;
    esac
  done < <(
    find "$target" \
      -type f \
      ! -path '*/.git/*' \
      -print |
      sort
  )

  printf 'RESULT=VALID\n'
  return 0
}
