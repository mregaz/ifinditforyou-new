#!/usr/bin/env bash
#
# Phoenix DevKit — Atlas SDK
# Module: atlas.sh
#
# Responsibility:
#   Public API composition and Atlas SDK orchestration boundary.
#

_ATLAS_SDK_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd
)"

source "${_ATLAS_SDK_DIR}/loader.sh"
source "${_ATLAS_SDK_DIR}/normalization.sh"
source "${_ATLAS_SDK_DIR}/query.sh"

PHOENIX_ATLAS_INITIALIZED=0

phoenix::atlas_is_available() {
  local source_path

  if [[ "$#" -ne 0 ]]; then
    return 2
  fi

  source_path="$(
    _phoenix::atlas_source_resolve TRACKER
  )" >/dev/null 2>&1 || return 1

  [[ -r "$source_path" ]] || return 1

  return 0
}

phoenix::atlas_validate() {
  if [[ "$#" -ne 0 ]]; then
    return 2
  fi

  _phoenix::atlas_validate_source TRACKER || return $?
  _phoenix::atlas_validate_source FINAL_MASTER || return $?

  printf '%s\n' "ATLAS_VALID=1"
  return 0
}

phoenix::atlas_initialize() {
  local source_id

  if [[ "$#" -ne 0 ]]; then
    return 2
  fi

  PHOENIX_ATLAS_INITIALIZED=0

  _phoenix::atlas_source_prepare_for_initialize TRACKER || return $?

  _phoenix::atlas_validate_source TRACKER || return $?

  for source_id in \
    FINAL_MASTER \
    SURFACE_REGISTRY \
    FINAL_RECONCILIATION \
    STRATEGIC_SYNTHESIS
  do
    _phoenix::atlas_source_prepare_for_initialize "$source_id" || return $?
  done

  PHOENIX_ATLAS_INITIALIZED=1
  return 0
}
