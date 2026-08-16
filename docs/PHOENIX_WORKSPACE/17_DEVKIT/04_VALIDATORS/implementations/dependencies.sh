#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — DEPENDENCIES VALIDATOR
# ==============================================================================
#
# Purpose:
# Validate Phoenix DevKit internal dependency integrity.
#
# Responsibilities:
# - Validate explicit target existence
# - Validate target directory type
# - Inspect shell modules deterministically
# - Require an explicit Dependencies section when internal source directives exist
# - Verify that statically resolvable internal dependency targets exist
# - Never execute inspected modules or dependencies
# - Preserve read-only, deterministic, fail-fast validation
#
# Non-responsibilities:
# - External command availability
# - Dependency installation
# - Dependency version resolution
# - Circular dependency detection
# - Architectural layer-direction enforcement
# - Auto-fix or mutation
#
# ==============================================================================

if [[ -n "${PHOENIX_VALIDATOR_DEPENDENCIES_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_VALIDATOR_DEPENDENCIES_LOADED=1

_phoenix::dependencies_source_lines() {
  local module_path="${1:-}"

  grep -E \
    '^[[:space:]]*source[[:space:]]+' \
    "$module_path" 2>/dev/null || true
}

_phoenix::dependencies_has_declaration() {
  local module_path="${1:-}"

  grep -Eq \
    '^#[[:space:]]*Dependencies([[:space:]]*:)?[[:space:]]*$' \
    "$module_path"
}

_phoenix::dependencies_source_path() {
  local source_line="${1:-}"
  local module_path="${2:-}"
  local target_root="${3:-}"

  local expression
  local variable_name
  local relative_path
  local module_dir

  module_dir="$(cd "$(dirname "$module_path")" && pwd)" || return 1

  expression="$source_line"

  expression="${expression#"${expression%%[![:space:]]*}"}"
  expression="${expression#source}"
  expression="${expression#"${expression%%[![:space:]]*}"}"

  case "$expression" in
    \"*\")
      expression="${expression#\"}"
      expression="${expression%%\"*}"
      ;;
    \'*\')
      expression="${expression#\'}"
      expression="${expression%%\'*}"
      ;;
    *)
      return 1
      ;;
  esac

  case "$expression" in
    '${'*'}/'*)
      variable_name="${expression#\$\{}"
      variable_name="${variable_name%%\}*}"
      relative_path="${expression#*\}/}"

      case "$variable_name" in
        *_DEVKIT_ROOT)
          printf '%s/%s\n' "$target_root" "$relative_path"
          return 0
          ;;
        *_DIR|MODULE_DIR)
          printf '%s/%s\n' "$module_dir" "$relative_path"
          return 0
          ;;
        *)
          return 1
          ;;
      esac
      ;;

    /*)
      printf '%s\n' "$expression"
      return 0
      ;;

    *)
      printf '%s/%s\n' "$module_dir" "$expression"
      return 0
      ;;
  esac
}

phoenix::validator_dependencies() {
  local target="${1:-}"
  local module_path
  local module_name
  local source_lines
  local source_line
  local dependency_path
  local dependency_name

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

  while IFS= read -r module_path; do
    module_name="${module_path##*/}"

    source_lines="$(
      _phoenix::dependencies_source_lines "$module_path"
    )"

    [[ -n "$source_lines" ]] || continue

    if ! _phoenix::dependencies_has_declaration "$module_path"; then
      printf 'RESULT=INVALID\n'
      printf 'CHECK=dependency-declaration\n'
      printf 'MESSAGE=Dependency declaration is missing in module %s\n' \
        "$module_name"
      return 0
    fi

    while IFS= read -r source_line; do
      [[ -n "$source_line" ]] || continue

      dependency_path="$(
        _phoenix::dependencies_source_path \
          "$source_line" \
          "$module_path" \
          "$target"
      )" || continue

      if [[ ! -f "$dependency_path" ]]; then
        dependency_name="${dependency_path##*/}"

        printf 'RESULT=INVALID\n'
        printf 'CHECK=dependency-target-exists\n'
        printf 'MESSAGE=Dependency target does not exist: %s\n' \
          "$dependency_name"
        return 0
      fi
    done <<EOF_SOURCE_LINES
${source_lines}
EOF_SOURCE_LINES

  done < <(
    find "$target" \
      -type f \
      -name '*.sh' \
      ! -path '*/.git/*' \
      -print |
      sort
  )

  printf 'RESULT=VALID\n'
  return 0
}
