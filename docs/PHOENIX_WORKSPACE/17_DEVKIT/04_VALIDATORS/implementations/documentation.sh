#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — DOCUMENTATION VALIDATOR
# ==============================================================================
#
# Purpose:
# Validate Phoenix DevKit documentation presence and non-empty domain
# documentation.
#
# Responsibilities:
# - Validate explicit target existence
# - Validate target directory type
# - Require root README.md
# - Require non-empty root README.md
# - Require README.md in numbered top-level Phoenix domains
# - Require numbered-domain README.md files to be non-empty
# - Preserve deterministic lexical fail-fast behavior
#
# Non-responsibilities:
# - Documentation quality scoring
# - Markdown structure validation
# - Usage/examples/limitations heading enforcement
# - Master Record consistency
# - Nested README requirements
# - core/ README requirements
# - Auto-fix or documentation generation
#
# ==============================================================================

if [[ -n "${PHOENIX_VALIDATOR_DOCUMENTATION_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_VALIDATOR_DOCUMENTATION_LOADED=1

phoenix::validator_documentation() {
  local target="${1:-}"
  local domain
  local domain_name
  local readme_path

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

  if [[ ! -f "${target}/README.md" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=required-root-readme\n'
    printf 'MESSAGE=Required root README.md is missing\n'
    return 0
  fi

  if [[ ! -s "${target}/README.md" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=non-empty-root-readme\n'
    printf 'MESSAGE=Root README.md is empty\n'
    return 0
  fi

  while IFS= read -r domain; do
    domain_name="${domain##*/}"
    readme_path="${domain}/README.md"

    if [[ ! -f "$readme_path" ]]; then
      printf 'RESULT=INVALID\n'
      printf 'CHECK=required-domain-readme\n'
      printf 'MESSAGE=Required README.md is missing in domain %s\n' "$domain_name"
      return 0
    fi

    if [[ ! -s "$readme_path" ]]; then
      printf 'RESULT=INVALID\n'
      printf 'CHECK=non-empty-domain-readme\n'
      printf 'MESSAGE=README.md is empty in domain %s\n' "$domain_name"
      return 0
    fi
  done < <(
    find "$target" \
      -mindepth 1 \
      -maxdepth 1 \
      -type d \
      -name '[0-9][0-9]_*' \
      -print |
      sort
  )

  printf 'RESULT=VALID\n'
  return 0
}
