#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — GENERATOR EXECUTION ENGINE
# ==============================================================================
#
# Purpose:
#   Execute validated generation requests through the certified Planning Engine.
#
# Responsibilities:
#   - Build and consume validated generation plans
#   - Honor dry-run semantics
#   - Render all artifacts before first filesystem mutation
#   - Create required destination directories
#   - Write planned artifacts in deterministic order
#   - Return deterministic generation results
#
# Non-responsibilities:
#   - Generator discovery
#   - Generator Definition registration
#   - Independent request validation
#   - Independent placeholder parsing
#   - CLI handling
#
# ==============================================================================


# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_GENERATOR_EXECUTION_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_GENERATOR_EXECUTION_LOADED=1


# ------------------------------------------------------------------------------
# Module Paths
# ------------------------------------------------------------------------------

PHOENIX_GENERATOR_EXECUTION_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

PHOENIX_GENERATOR_EXECUTION_DEVKIT_ROOT="$(
  cd "${PHOENIX_GENERATOR_EXECUTION_DIR}/.." && pwd
)"


# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

source "${PHOENIX_GENERATOR_EXECUTION_DIR}/planning.sh"
source "${PHOENIX_GENERATOR_EXECUTION_DEVKIT_ROOT}/core/filesystem.sh"
source "${PHOENIX_GENERATOR_EXECUTION_DEVKIT_ROOT}/core/template_engine.sh"


# ------------------------------------------------------------------------------
# Internal Helpers
# ------------------------------------------------------------------------------

_phoenix::generator_execution_plan_field() {
  local plan="${1:-}"
  local field="${2:-}"
  local line

  while IFS= read -r line; do
    case "$line" in
      "${field}="*)
        printf '%s\n' "${line#*=}"
        return 0
        ;;
    esac
  done <<< "$plan"

  return 1
}


_phoenix::generator_execution_collect_artifacts() {
  local plan="${1:-}"
  local line

  while IFS= read -r line; do
    case "$line" in
      ARTIFACT=*)
        printf '%s\n' "${line#ARTIFACT=}"
        ;;
    esac
  done <<< "$plan"

  return 0
}


_phoenix::generator_execution_collect_assignments() {
  local argument

  for argument in "$@"; do
    case "$argument" in
      PHOENIX_*=*)
        continue
        ;;
      *=*)
        printf '%s\n' "$argument"
        ;;
    esac
  done

  return 0
}


_phoenix::generator_execution_parent_directory() {
  local path="${1:-}"

  [[ -n "$path" ]] || return 1

  case "$path" in
    */*)
      printf '%s\n' "${path%/*}"
      ;;
    *)
      printf '.\n'
      ;;
  esac
}


# ------------------------------------------------------------------------------
# Public API
# ------------------------------------------------------------------------------

phoenix::generator_run() {
  local generator_id="${1:-}"
  local destination="${2:-}"

  [[ "$#" -ge 2 ]] || return 1

  local -a request_arguments=("$@")

  local plan
  local dry_run
  local definition

  local assignments_text
  local -a assignments=()

  local line
  local template_mapping
  local template_source
  local resolved_template_source
  local artifact_mapping
  local artifact_path
  local parent_directory
  local rendered_content

  local artifact_paths=""

local -a planned_artifacts=()
local -a rendered_paths=()
local -a rendered_contents=()

local planned_index=0
local rendered_index

  plan="$(
    phoenix::generator_plan "${request_arguments[@]}"
  )" || return 1

  dry_run="$(
    _phoenix::generator_execution_plan_field \
      "$plan" \
      "DRY_RUN"
  )" || return 1

  artifact_paths="$(
    _phoenix::generator_execution_collect_artifacts "$plan"
  )" || return 1

  [[ -n "$artifact_paths" ]] || return 1
while IFS= read -r artifact_path; do
  [[ -n "$artifact_path" ]] || continue
  planned_artifacts+=("$artifact_path")
done <<< "$artifact_paths"

[[ "${#planned_artifacts[@]}" -gt 0 ]] || return 1
  if [[ "$dry_run" == "1" ]]; then
    printf 'STATUS=DRY_RUN\n'
    printf 'GENERATOR=%s\n' "$generator_id"
    printf 'DESTINATION=%s\n' "$destination"

    while IFS= read -r artifact_path; do
      [[ -n "$artifact_path" ]] || continue
      printf 'ARTIFACT=%s\n' "$artifact_path"
    done <<< "$artifact_paths"

    return 0
  fi

  definition="$(
    phoenix::generator_resolve "$generator_id"
  )" || return 1

  shift 2

  assignments_text="$(
    _phoenix::generator_execution_collect_assignments "$@"
  )" || return 1

  if [[ -n "$assignments_text" ]]; then
    while IFS= read -r assignment; do
      assignments+=("$assignment")
    done <<< "$assignments_text"
  fi

  # --------------------------------------------------------------------------
  # Render every artifact before first mutation.
  # --------------------------------------------------------------------------

  while IFS= read -r line; do
    case "$line" in
      TEMPLATE_MAP=*)
        template_mapping="${line#TEMPLATE_MAP=}"

        case "$template_mapping" in
          *'=>'*)
            template_source="${template_mapping%%=>*}"
            artifact_mapping="${template_mapping#*=>}"
            ;;
          *)
            return 1
            ;;
        esac

        resolved_template_source="$(
          _phoenix::generator_resolve_template_source \
            "$template_source"
        )" || return 1

        [[ "$planned_index" -lt "${#planned_artifacts[@]}" ]] || return 1

artifact_path="${planned_artifacts[$planned_index]}"

planned_index=$((planned_index + 1))

        rendered_content="$(
          phoenix::read_file "$resolved_template_source"
        )" || return 1

        rendered_content="$(
          phoenix::template_render \
            "$rendered_content" \
            "${assignments[@]}"
        )" || return 1

        rendered_paths+=("$artifact_path")
rendered_contents+=("$rendered_content")
        ;;
    esac
  done <<< "$definition"
[[ "$planned_index" -eq "${#planned_artifacts[@]}" ]] || return 1
  [[ "${#rendered_paths[@]}" -gt 0 ]] || return 1

[[ "${#rendered_paths[@]}" -eq "${#rendered_contents[@]}" ]] || return 1

  # --------------------------------------------------------------------------
  # Filesystem mutation begins only after all rendering succeeded.
  # --------------------------------------------------------------------------

  for ((rendered_index = 0; rendered_index < ${#rendered_paths[@]}; rendered_index++)); do
  artifact_path="${rendered_paths[$rendered_index]}"
  rendered_content="${rendered_contents[$rendered_index]}"

  parent_directory="$(
    _phoenix::generator_execution_parent_directory "$artifact_path"
  )" || return 1

  if ! phoenix::is_directory "$parent_directory"; then
    phoenix::create_directory "$parent_directory" || return 1
  fi

  phoenix::write_file \
    "$artifact_path" \
    "$rendered_content" || return 1
done

  # --------------------------------------------------------------------------
  # Deterministic success result.
  # --------------------------------------------------------------------------

  printf 'STATUS=SUCCESS\n'
  printf 'GENERATOR=%s\n' "$generator_id"
  printf 'DESTINATION=%s\n' "$destination"

  while IFS= read -r artifact_path; do
    [[ -n "$artifact_path" ]] || continue
    printf 'ARTIFACT=%s\n' "$artifact_path"
  done <<< "$artifact_paths"

  return 0
}
