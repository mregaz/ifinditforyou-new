#!/usr/bin/env bash
#
# Phoenix DevKit — Atlas SDK
# Module: normalization.sh
#
# Responsibility:
#   Deterministic structural normalization of validated Atlas intelligence.
#
# IP-05:
#   Structural Normalization.
#
# This module:
#   - preserves Atlas meaning;
#   - preserves canonical identity;
#   - preserves semantic field content;
#   - makes structural missing state explicit;
#   - attaches canonical logical source identity;
#   - produces deterministic private normalized records;
#   - does not implement public KEY=VALUE serialization;
#   - does not rank, recommend, infer, execute, or decide.
#

PHOENIX_ATLAS_NORMALIZATION_MODULE_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

source "${PHOENIX_ATLAS_NORMALIZATION_MODULE_DIR}/loader.sh"

# Private IP-05 normalized-record transport.
#
# Each structural field is represented as:
#
#   KEY<TAB>STATE<TAB>VALUE
#
# STATE is structural metadata:
#
#   PRESENT
#   MISSING
#
# It is not an Atlas semantic value.
#
# Public KEY=VALUE serialization belongs to IP-06.

_phoenix::atlas_normalized_field() {
  local key="${1-}"
  local value="${2-}"

  if [[ -z "$key" ]]; then
    return 2
  fi

  case "$key" in
    *[!A-Z0-9_]*|"")
      return 2
      ;;
  esac

  case "$key" in
    [A-Z]*)
      ;;
    *)
      return 2
      ;;
  esac

  if [[ -z "$value" ]]; then
    printf '%s\t%s\t%s\n' "$key" "MISSING" ""
  else
    printf '%s\t%s\t%s\n' "$key" "PRESENT" "$value"
  fi
}

_phoenix::atlas_normalized_source_reference() {
  local source_id="${1-}"

  if [[ -z "$source_id" ]]; then
    return 2
  fi

  _phoenix::atlas_source_filename "$source_id"
}

_phoenix::atlas_normalize_tracker_record() {
  local record="${1-}"
  local source_id="${2-TRACKER}"

  local tracker_id
  local country
  local marketplace
  local category
  local atlas_status
  local evidence_note
  local extra
  local source_reference
  local cr

  if [[ -z "$record" ]]; then
    return 2
  fi

  cr="$(printf '\r')"

  case "$record" in
    *"$cr")
      record="${record%?}"
      ;;
  esac

  IFS=',' read -r \
    tracker_id \
    country \
    marketplace \
    category \
    atlas_status \
    evidence_note \
    extra <<EOF_RECORD
$record
EOF_RECORD

  # The frozen TRACKER v1 structure contains exactly six fields.
  if [[ -n "$extra" ]]; then
    return 6
  fi

  if [[ -z "$tracker_id" ]]; then
    return 6
  fi

  source_reference="$(
    _phoenix::atlas_normalized_source_reference "$source_id"
  )" || return $?

  _phoenix::atlas_normalized_field \
    "ATLAS_TRACKER_ID" "$tracker_id" || return $?

  _phoenix::atlas_normalized_field \
    "ATLAS_COUNTRY" "$country" || return $?

  _phoenix::atlas_normalized_field \
    "ATLAS_MARKETPLACE" "$marketplace" || return $?

  _phoenix::atlas_normalized_field \
    "ATLAS_CATEGORY" "$category" || return $?

  _phoenix::atlas_normalized_field \
    "ATLAS_STATUS" "$atlas_status" || return $?

  _phoenix::atlas_normalized_field \
    "ATLAS_EVIDENCE_NOTE" "$evidence_note" || return $?

  _phoenix::atlas_normalized_field \
    "ATLAS_SOURCE" "$source_reference" || return $?
}

_phoenix::atlas_normalize_tracker_file() {
  local source_path="${1-}"
  local source_id="${2-TRACKER}"
  local line
  local cr

  if [[ -z "$source_path" ]]; then
    return 2
  fi

  _phoenix::atlas_validate_tracker_file "$source_path" || return $?

  cr="$(printf '\r')"

  tail -n +2 "$source_path" |
    LC_ALL=C sort -t',' -k1,1n |
    while IFS= read -r line || [[ -n "$line" ]]; do

      case "$line" in
        *"$cr")
          line="${line%?}"
          ;;
      esac

      _phoenix::atlas_normalize_tracker_record \
        "$line" "$source_id" || exit $?

      printf '%s\n' "--"
    done
}

_phoenix::atlas_normalize_source() {
  local source_id="${1-}"
  local source_path

  case "$source_id" in
    TRACKER)
      source_path="$(
        _phoenix::atlas_source_resolve TRACKER
      )" || return $?

      _phoenix::atlas_normalize_tracker_file \
        "$source_path" TRACKER
      ;;
    "")
      return 2
      ;;
    *)
      return 2
      ;;
  esac
}
