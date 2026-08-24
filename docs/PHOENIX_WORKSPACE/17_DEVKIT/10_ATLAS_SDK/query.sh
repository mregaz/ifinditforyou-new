#!/usr/bin/env bash
#
# Phoenix DevKit — Atlas SDK
# Module: query.sh
#
# Responsibility:
#   Deterministic read-only Atlas provider queries.
#
# IP-07:
#   Provider Query Layer.
#
# This module:
#   - resolves providers only by explicit canonical tracker identity;
#   - preserves canonical Atlas semantics;
#   - preserves canonical source traceability;
#   - performs no fuzzy matching;
#   - performs no ranking;
#   - performs no recommendation;
#   - performs no network access;
#   - does not mutate canonical Atlas assets.

PHOENIX_ATLAS_QUERY_MODULE_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

source "${PHOENIX_ATLAS_QUERY_MODULE_DIR}/normalization.sh"

# ------------------------------------------------------------------------------
# Private helpers
# ------------------------------------------------------------------------------

_phoenix::atlas_provider_id_is_valid() {
  local provider_id="${1-}"

  if [[ -z "$provider_id" ]]; then
    return 2
  fi

  case "$provider_id" in
    *[!0-9]*)
      return 2
      ;;
  esac

  case "$provider_id" in
    0|0[0-9]*)
      return 2
      ;;
  esac

  return 0
}

_phoenix::atlas_provider_project_record() {
  local normalized_record="${1-}"
  local line
  local key
  local state
  local value

  local tracker_id=""
  local country=""
  local marketplace=""
  local category=""
  local atlas_status=""
  local evidence_note=""
  local source_reference=""

  local tracker_id_state="MISSING"
  local country_state="MISSING"
  local marketplace_state="MISSING"
  local category_state="MISSING"
  local atlas_status_state="MISSING"
  local evidence_note_state="MISSING"
  local source_reference_state="MISSING"

  if [[ -z "$normalized_record" ]]; then
    return 6
  fi

  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ -z "$line" ]] && continue

    IFS=$'\t' read -r key state value <<EOF_FIELD
$line
EOF_FIELD

    case "$key" in
      ATLAS_TRACKER_ID)
        tracker_id="$value"
        tracker_id_state="$state"
        ;;
      ATLAS_COUNTRY)
        country="$value"
        country_state="$state"
        ;;
      ATLAS_MARKETPLACE)
        marketplace="$value"
        marketplace_state="$state"
        ;;
      ATLAS_CATEGORY)
        category="$value"
        category_state="$state"
        ;;
      ATLAS_STATUS)
        atlas_status="$value"
        atlas_status_state="$state"
        ;;
      ATLAS_EVIDENCE_NOTE)
        evidence_note="$value"
        evidence_note_state="$state"
        ;;
      ATLAS_SOURCE)
        source_reference="$value"
        source_reference_state="$state"
        ;;
      *)
        return 6
        ;;
    esac
  done <<EOF_RECORD
$normalized_record
EOF_RECORD

  if [[ "$tracker_id_state" != "PRESENT" || -z "$tracker_id" ]]; then
    return 6
  fi

  _phoenix::atlas_normalized_field \
    "PROVIDER_ID" "$tracker_id" || return $?

  if [[ "$marketplace_state" == "PRESENT" ]]; then
    _phoenix::atlas_normalized_field \
      "MARKETPLACE" "$marketplace" || return $?
  fi

  if [[ "$country_state" == "PRESENT" ]]; then
    _phoenix::atlas_normalized_field \
      "COUNTRY" "$country" || return $?
  fi

  if [[ "$category_state" == "PRESENT" ]]; then
    _phoenix::atlas_normalized_field \
      "CATEGORY" "$category" || return $?
  fi

  if [[ "$atlas_status_state" == "PRESENT" ]]; then
    _phoenix::atlas_normalized_field \
      "ATLAS_STATUS" "$atlas_status" || return $?
  fi

  if [[ "$evidence_note_state" == "PRESENT" ]]; then
    _phoenix::atlas_normalized_field \
      "EVIDENCE_NOTE" "$evidence_note" || return $?
  fi

  if [[ "$source_reference_state" == "PRESENT" ]]; then
    _phoenix::atlas_normalized_field \
      "SOURCE_REFERENCE" "$source_reference" || return $?
  fi
}

_phoenix::atlas_provider_normalized_records() {
  local normalized
  local line
  local record=""
  local projected
  local output=""
  local record_count=0

  normalized="$(
    _phoenix::atlas_normalize_source TRACKER
  )" || return $?

  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" == "--" ]]; then
      if [[ -z "$record" ]]; then
        return 6
      fi

      projected="$(
        _phoenix::atlas_provider_project_record "$record"
      )" || return $?

      if [[ "$record_count" -gt 0 ]]; then
        output="${output}--"$'\n'
      fi

      output="${output}${projected}"
      record_count=$((record_count + 1))
      record=""
      continue
    fi

    if [[ -n "$record" ]]; then
      record="${record}"$'\n'
    fi

    record="${record}${line}"
  done <<EOF_NORMALIZED
$normalized
EOF_NORMALIZED

  if [[ -n "$record" ]]; then
    projected="$(
      _phoenix::atlas_provider_project_record "$record"
    )" || return $?

    if [[ "$record_count" -gt 0 ]]; then
      output="${output}--"$'\n'
    fi

    output="${output}${projected}"
    record_count=$((record_count + 1))
  fi

  if [[ "$record_count" -eq 0 ]]; then
    return 0
  fi

  printf '%s' "$output"
}

_phoenix::atlas_provider_find_normalized() {
  local provider_id="${1-}"
  local normalized
  local line
  local record=""
  local tracker_line
  local tracker_key
  local tracker_state
  local tracker_value

  _phoenix::atlas_provider_id_is_valid "$provider_id" || return $?

  normalized="$(
    _phoenix::atlas_provider_normalized_records
  )" || return $?

  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" == "--" ]]; then
      tracker_line="$(printf '%s\n' "$record" |
        LC_ALL=C grep '^PROVIDER_ID' | head -n 1)" || true

      if [[ -n "$tracker_line" ]]; then
        IFS=$'\t' read -r tracker_key tracker_state tracker_value <<EOF_ID
$tracker_line
EOF_ID

        if [[ "$tracker_state" == "PRESENT" &&
              "$tracker_value" == "$provider_id" ]]; then
          printf '%s\n' "$record"
          return 0
        fi
      fi

      record=""
      continue
    fi

    if [[ -n "$record" ]]; then
      record="${record}"$'\n'
    fi
    record="${record}${line}"
  done <<EOF_RECORDS
$normalized
EOF_RECORDS

  if [[ -n "$record" ]]; then
    tracker_line="$(printf '%s\n' "$record" |
      LC_ALL=C grep '^PROVIDER_ID' | head -n 1)" || true

    if [[ -n "$tracker_line" ]]; then
      IFS=$'\t' read -r tracker_key tracker_state tracker_value <<EOF_ID
$tracker_line
EOF_ID

      if [[ "$tracker_state" == "PRESENT" &&
            "$tracker_value" == "$provider_id" ]]; then
        printf '%s\n' "$record"
        return 0
      fi
    fi
  fi

  return 3
}

# ------------------------------------------------------------------------------
# Public API
# ------------------------------------------------------------------------------

phoenix::atlas_provider_get() {
  local provider_id="${1-}"
  local normalized
  local serialized

  if [[ "$#" -ne 1 ]]; then
    return 2
  fi

  _phoenix::atlas_provider_id_is_valid "$provider_id" || return $?

  normalized="$(
    _phoenix::atlas_provider_find_normalized "$provider_id"
  )" || return $?

  serialized="$(
    _phoenix::atlas_serialize_normalized_record "$normalized"
  )" || return $?

  if [[ -n "$serialized" ]]; then
    printf '%s\n' "$serialized"
  fi
}

phoenix::atlas_provider_list() {
  local normalized
  local serialized

  if [[ "$#" -ne 0 ]]; then
    return 2
  fi

  normalized="$(
    _phoenix::atlas_provider_normalized_records
  )" || return $?

  serialized="$(
    _phoenix::atlas_serialize_normalized_records "$normalized"
  )" || return $?

  if [[ -n "$serialized" ]]; then
    printf '%s\n' "$serialized"
  fi
}

# ------------------------------------------------------------------------------
# IP-08 — Marketplace Surface Query Layer
# ------------------------------------------------------------------------------

_phoenix::atlas_surface_id_is_valid() {
  local surface_id="${1-}"

  if [[ -z "$surface_id" ]]; then
    return 2
  fi

  case "$surface_id" in
    ATLAS-SURFACE-[0-9][0-9][0-9])
      ;;
    *)
      return 2
      ;;
  esac

  return 0
}

_phoenix::atlas_surface_require_sources() {
  _phoenix::atlas_source_resolve TRACKER >/dev/null || return $?
  _phoenix::atlas_source_resolve FINAL_MASTER >/dev/null || return $?
  _phoenix::atlas_source_resolve SURFACE_REGISTRY >/dev/null || return $?

  return 0
}

_phoenix::atlas_surface_normalized_record() {
  local surface_id="${1-}"
  local marketplace="${2-}"
  local country="${3-}"
  local provider_family="${4-}"
  local access_state="${5-}"
  local lifecycle="${6-}"
  local source_reference="${7-}"

  _phoenix::atlas_normalized_field "SURFACE_ID" "$surface_id" || return $?
  _phoenix::atlas_normalized_field "MARKETPLACE" "$marketplace" || return $?
  _phoenix::atlas_normalized_field "COUNTRY" "$country" || return $?
  _phoenix::atlas_normalized_field "PROVIDER_FAMILY" "$provider_family" || return $?
  _phoenix::atlas_normalized_field "ACCESS_STATE" "$access_state" || return $?
  _phoenix::atlas_normalized_field "LIFECYCLE" "$lifecycle" || return $?
  _phoenix::atlas_normalized_field "SOURCE_REFERENCE" "$source_reference" || return $?
}

_phoenix::atlas_surface_normalized_records() {
  local registry_path
  local surface_id
  local tracker_id
  local marketplace
  local country
  local provider_family
  local access_state
  local lifecycle
  local source_reference
  local extra
  local record_count=0

  _phoenix::atlas_surface_require_sources || return $?

  registry_path="$(
    _phoenix::atlas_source_resolve SURFACE_REGISTRY
  )" || return $?

  while IFS=',' read -r \
    surface_id \
    tracker_id \
    marketplace \
    country \
    provider_family \
    access_state \
    lifecycle \
    source_reference \
    extra
  do
    if [[ "$surface_id" == "surface_id" ]]; then
      continue
    fi

    if [[ -z "$surface_id" ]]; then
      continue
    fi

    if [[ -n "${extra-}" ]]; then
      return 6
    fi

    _phoenix::atlas_surface_id_is_valid "$surface_id" || return 6

    if [[ "$record_count" -gt 0 ]]; then
      printf '%s\n' "--"
    fi

    _phoenix::atlas_surface_normalized_record \
      "$surface_id" \
      "$marketplace" \
      "$country" \
      "$provider_family" \
      "$access_state" \
      "$lifecycle" \
      "$source_reference" || return $?

    record_count=$((record_count + 1))
  done < "$registry_path"

  return 0
}

_phoenix::atlas_surface_find_normalized() {
  local requested_id="${1-}"
  local normalized
  local line
  local record=""
  local id_line
  local key
  local state
  local value

  _phoenix::atlas_surface_id_is_valid "$requested_id" || return $?

  normalized="$(
    _phoenix::atlas_surface_normalized_records
  )" || return $?

  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ "$line" == "--" ]]; then
      id_line="$(
        printf '%s\n' "$record" |
          LC_ALL=C grep '^SURFACE_ID' |
          head -n 1
      )" || true

      if [[ -n "$id_line" ]]; then
        IFS=$'\t' read -r key state value <<EOF_SURFACE_ID
$id_line
EOF_SURFACE_ID

        if [[ "$state" == "PRESENT" &&
              "$value" == "$requested_id" ]]; then
          printf '%s\n' "$record"
          return 0
        fi
      fi

      record=""
      continue
    fi

    if [[ -n "$record" ]]; then
      record="${record}"$'\n'
    fi

    record="${record}${line}"
  done <<EOF_SURFACE_RECORDS
$normalized
EOF_SURFACE_RECORDS

  if [[ -n "$record" ]]; then
    id_line="$(
      printf '%s\n' "$record" |
        LC_ALL=C grep '^SURFACE_ID' |
        head -n 1
    )" || true

    if [[ -n "$id_line" ]]; then
      IFS=$'\t' read -r key state value <<EOF_SURFACE_ID_FINAL
$id_line
EOF_SURFACE_ID_FINAL

      if [[ "$state" == "PRESENT" &&
            "$value" == "$requested_id" ]]; then
        printf '%s\n' "$record"
        return 0
      fi
    fi
  fi

  return 3
}

phoenix::atlas_surface_get() {
  local surface_id="${1-}"
  local normalized
  local serialized

  if [[ "$#" -ne 1 ]]; then
    return 2
  fi

  _phoenix::atlas_surface_id_is_valid "$surface_id" || return $?

  normalized="$(
    _phoenix::atlas_surface_find_normalized "$surface_id"
  )" || return $?

  serialized="$(
    _phoenix::atlas_serialize_normalized_record "$normalized"
  )" || return $?

  if [[ -n "$serialized" ]]; then
    printf '%s\n' "$serialized"
  fi
}

phoenix::atlas_surface_list() {
  local normalized
  local serialized

  if [[ "$#" -ne 0 ]]; then
    return 2
  fi

  normalized="$(
    _phoenix::atlas_surface_normalized_records
  )" || return $?

  serialized="$(
    _phoenix::atlas_serialize_normalized_records "$normalized"
  )" || return $?

  if [[ -n "$serialized" ]]; then
    printf '%s\n' "$serialized"
  fi
}

# ------------------------------------------------------------------------------
# IP-09 — Lifecycle Query Layer
# ------------------------------------------------------------------------------

_phoenix::atlas_lifecycle_require_sources() {
  _phoenix::atlas_source_resolve TRACKER >/dev/null || return $?
  _phoenix::atlas_source_resolve FINAL_MASTER >/dev/null || return $?

  return 0
}

_phoenix::atlas_lifecycle_normalized_record() {
  local provider_id="${1-}"

  _phoenix::atlas_normalized_field "PROVIDER_ID" "$provider_id" || return $?
  _phoenix::atlas_normalized_field "LIFECYCLE" "UNKNOWN" || return $?
  _phoenix::atlas_normalized_field "SOURCE_REFERENCE" "PHOENIX_ATLAS_FINAL_MASTER_v1.0.md" || return $?
}

phoenix::atlas_lifecycle_get() {
  local provider_id="${1-}"
  local normalized
  local serialized

  if [[ "$#" -ne 1 ]]; then
    return 2
  fi

  if [[ -z "$provider_id" ]]; then
    return 2
  fi

  _phoenix::atlas_lifecycle_require_sources || return $?

  phoenix::atlas_provider_get "$provider_id" >/dev/null 2>&1 || return $?

  normalized="$(
    _phoenix::atlas_lifecycle_normalized_record "$provider_id"
  )" || return $?

  serialized="$(
    _phoenix::atlas_serialize_normalized_record "$normalized"
  )" || return $?

  if [[ -n "$serialized" ]]; then
    printf "%s\n" "$serialized"
  fi
}

# ------------------------------------------------------------------------------
# IP-09 — Access Query Layer
# ------------------------------------------------------------------------------

_phoenix::atlas_access_require_sources() {
  _phoenix::atlas_source_resolve TRACKER >/dev/null || return $?
  _phoenix::atlas_source_resolve FINAL_MASTER >/dev/null || return $?

  return 0
}

_phoenix::atlas_access_normalized_record() {
  local provider_id="${1-}"

  _phoenix::atlas_normalized_field "PROVIDER_ID" "$provider_id" || return $?
  _phoenix::atlas_normalized_field "ACCESS_STATE" "UNKNOWN" || return $?
  _phoenix::atlas_normalized_field "ACCESS_POLICY" "UNKNOWN" || return $?
  _phoenix::atlas_normalized_field "SOURCE_REFERENCE" "PHOENIX_ATLAS_FINAL_MASTER_v1.0.md" || return $?
}

phoenix::atlas_access_get() {
  local provider_id="${1-}"
  local normalized
  local serialized

  if [[ "$#" -ne 1 ]]; then
    return 2
  fi

  if [[ -z "$provider_id" ]]; then
    return 2
  fi

  _phoenix::atlas_access_require_sources || return $?

  phoenix::atlas_provider_get "$provider_id" >/dev/null 2>&1 || return $?

  normalized="$(
    _phoenix::atlas_access_normalized_record "$provider_id"
  )" || return $?

  serialized="$(
    _phoenix::atlas_serialize_normalized_record "$normalized"
  )" || return $?

  if [[ -n "$serialized" ]]; then
    printf "%s\n" "$serialized"
  fi
}
