#!/usr/bin/env bash

#
# Phoenix DevKit — Atlas SDK
# Module: loader.sh
#
# Responsibility:
#   Deterministic canonical Atlas root and source resolution.
#
# IP-02:
#   Canonical Root and Source Resolution.
#
# This module:
#   - resolves the Phoenix repository root from its own physical location;
#   - resolves the canonical Atlas FINAL root;
#   - maps authorized logical source identifiers to frozen canonical files;
#   - rejects unknown identifiers and path-like input;
#   - does not depend on caller PWD;
#   - does not recursively discover Atlas sources;
#   - does not load, parse, normalize, or interpret Atlas intelligence.
#

PHOENIX_ATLAS_LOADER_MODULE_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

PHOENIX_ATLAS_LOADER_DEVKIT_ROOT="$(
  cd "${PHOENIX_ATLAS_LOADER_MODULE_DIR}/.." && pwd
)"

source "${PHOENIX_ATLAS_LOADER_DEVKIT_ROOT}/core/filesystem.sh"

_phoenix::atlas_repository_root() {
  local root

  root="$(
    cd "${PHOENIX_ATLAS_LOADER_DEVKIT_ROOT}/../../.." && pwd
  )" || return 8

  printf '%s\n' "$root"
}

_phoenix::atlas_canonical_root() {
  local repository_root

  repository_root="$(_phoenix::atlas_repository_root)" || return $?

  printf '%s\n' \
    "${repository_root}/docs/PHOENIX_WORKSPACE/07_MARKET_INTELLIGENCE/PHOENIX_ATLAS/FINAL"
}

_phoenix::atlas_source_filename() {
  local source_id="${1-}"

  if [[ -z "$source_id" ]]; then
    return 2
  fi

  case "$source_id" in
    TRACKER)
      printf '%s\n' \
        "PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv"
      ;;
    FINAL_MASTER)
      printf '%s\n' \
        "PHOENIX_ATLAS_FINAL_MASTER_v1.0.md"
      ;;
    FINAL_RECONCILIATION)
      printf '%s\n' \
        "PHOENIX_ATLAS_FINAL_RECONCILIATION_v1.0.md"
      ;;
    STRATEGIC_SYNTHESIS)
      printf '%s\n' \
        "PHOENIX_ATLAS_STRATEGIC_SYNTHESIS_v1.0.md"
      ;;
    PASS_2_ARCHITECTURE)
      printf '%s\n' \
        "PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE_v1.0.md"
      ;;
    PASS_3A_SPECIFICATION)
      printf '%s\n' \
        "PHOENIX_PROVIDER_PLANNER_AND_SEARCH_STATE_SPECIFICATION_v1.0.md"
      ;;
    *)
      return 2
      ;;
  esac
}

_phoenix::atlas_source_resolve() {
  local source_id="${1-}"
  local canonical_root
  local filename
  local source_path

  filename="$(_phoenix::atlas_source_filename "$source_id")" || return $?

  canonical_root="$(_phoenix::atlas_canonical_root)" || return $?

  source_path="${canonical_root}/${filename}"

  if ! phoenix::path_exists "$source_path"; then
    return 4
  fi

  if ! phoenix::is_file "$source_path"; then
    return 4
  fi

  if [[ ! -r "$source_path" ]]; then
    return 5
  fi

  printf '%s\n' "$source_path"
}
