#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — STANDARDS VALIDATOR
# ==============================================================================
#
# Purpose:
# Validate Phoenix DevKit shell module standards.
#
# Responsibilities:
# - Validate explicit target existence
# - Validate target directory type
# - Validate canonical shell-module shebang
# - Validate public Phoenix function namespace
# - Validate private Phoenix function namespace
# - Reject caller-working-directory relative source directives
# - Traverse shell modules deterministically
# - Preserve read-only and fail-fast validation
#
# Non-responsibilities:
# - Semantic single-responsibility analysis
# - Argument validation completeness
# - Local-variable completeness
# - Quoting analysis
# - Load-guard implementation analysis
# - Dependency integrity
# - Documentation validation
# - Naming validation
# - Auto-fix or mutation
#
# ==============================================================================

if [[ -n "${PHOENIX_VALIDATOR_STANDARDS_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_VALIDATOR_STANDARDS_LOADED=1

_phoenix::standards_function_names() {
  local module_path="${1:-}"

  sed -n \
    's/^[[:space:]]*\([A-Za-z_][A-Za-z0-9_:]*\)[[:space:]]*()[[:space:]]*{[[:space:]]*$/\1/p' \
    "$module_path"
}

_phoenix::standards_has_forbidden_relative_source() {
  local module_path="${1:-}"

  grep -Eq \
    '^[[:space:]]*source[[:space:]]+["'\'']?\.\.?/' \
    "$module_path"
}

phoenix::validator_standards() {
  local target="${1:-}"
  local module_path
  local module_name
  local first_line
  local function_names
  local function_name

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

    # --------------------------------------------------------------------------
    # Canonical shebang
    # --------------------------------------------------------------------------

    IFS= read -r first_line < "$module_path" || first_line=""

    if [[ "$first_line" != '#!/usr/bin/env bash' ]]; then
      printf 'RESULT=INVALID\n'
      printf 'CHECK=shell-module-shebang\n'
      printf 'MESSAGE=Invalid shell module shebang: %s\n' \
        "$module_name"
      return 0
    fi

    # --------------------------------------------------------------------------
    # Function namespaces
    # --------------------------------------------------------------------------

    function_names="$(
      _phoenix::standards_function_names "$module_path"
    )"

    while IFS= read -r function_name; do
      [[ -n "$function_name" ]] || continue

      case "$function_name" in
        phoenix::*)
          ;;

        _phoenix::*)
          ;;

        _*)
          printf 'RESULT=INVALID\n'
          printf 'CHECK=private-function-namespace\n'
          printf 'MESSAGE=Invalid private function namespace: %s\n' \
            "$function_name"
          return 0
          ;;

        *)
          printf 'RESULT=INVALID\n'
          printf 'CHECK=public-function-namespace\n'
          printf 'MESSAGE=Invalid public function namespace: %s\n' \
            "$function_name"
          return 0
          ;;
      esac
    done <<EOF_FUNCTION_NAMES
${function_names}
EOF_FUNCTION_NAMES

    # --------------------------------------------------------------------------
    # Forbidden caller-relative source
    # --------------------------------------------------------------------------

    if _phoenix::standards_has_forbidden_relative_source "$module_path"; then
      printf 'RESULT=INVALID\n'
      printf 'CHECK=forbidden-relative-source\n'
      printf 'MESSAGE=Forbidden relative source in module %s\n' \
        "$module_name"
      return 0
    fi

  done < <(
    find "$target" \
  -type f \
  -name '*.sh' \
  ! -path '*/.git/*' \
  ! -path '*/07_TESTS/*' \
  -print |
  sort
  )

  printf 'RESULT=VALID\n'
  return 0
}
