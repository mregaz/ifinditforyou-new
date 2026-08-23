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

# ------------------------------------------------------------------------------
# IP-03 — Safe Source Loading
# ------------------------------------------------------------------------------

_phoenix::atlas_source_is_readable() {
  local source_id="${1-}"
  local source_path

  source_path="$(_phoenix::atlas_source_resolve "$source_id")" || return $?

  if [[ ! -r "$source_path" ]]; then
    return 5
  fi

  return 0
}

_phoenix::atlas_source_load() {
  local source_id="${1-}"
  local source_path

  source_path="$(_phoenix::atlas_source_resolve "$source_id")" || return $?

  if [[ ! -r "$source_path" ]]; then
    return 5
  fi

  phoenix::read_file "$source_path" || return 8
}

_phoenix::atlas_source_requirement_for_initialize() {
  local source_id="${1-}"

  case "$source_id" in
    TRACKER)
      printf '%s\n' "REQUIRED"
      ;;
    FINAL_MASTER|FINAL_RECONCILIATION|STRATEGIC_SYNTHESIS)
      printf '%s\n' "OPTIONAL"
      ;;
    PASS_2_ARCHITECTURE|PASS_3A_SPECIFICATION)
      printf '%s\n' "CONTEXT_ONLY"
      ;;
    *)
      return 2
      ;;
  esac
}

_phoenix::atlas_source_prepare_for_initialize() {
  local source_id="${1-}"
  local requirement
  local source_path
  local status

  requirement="$(
    _phoenix::atlas_source_requirement_for_initialize "$source_id"
  )" || return $?

  if [[ "$requirement" == "CONTEXT_ONLY" ]]; then
    return 0
  fi

  source_path="$(_phoenix::atlas_source_resolve "$source_id")" || {
    status=$?

    if [[ "$requirement" == "OPTIONAL" ]] && [[ "$status" -eq 4 ]]; then
      return 0
    fi

    return "$status"
  }

  if [[ ! -r "$source_path" ]]; then
    if [[ "$requirement" == "OPTIONAL" ]]; then
      return 0
    fi

    return 5
  fi

  return 0
}

# ------------------------------------------------------------------------------
# IP-04 — Canonical Source Validation
# ------------------------------------------------------------------------------

_phoenix::atlas_tracker_header() {
  local source_path="${1-}"
  local cr

  if [[ -z "$source_path" ]]; then
    return 2
  fi

  if [[ ! -f "$source_path" ]]; then
    return 4
  fi

  if [[ ! -r "$source_path" ]]; then
    return 5
  fi

  IFS= read -r REPLY < "$source_path" || return 6

  cr="$(printf '
')"

  case "$REPLY" in
    *"$cr")
      REPLY="${REPLY%?}"
      ;;
  esac

  printf '%s
' "$REPLY"
}

_phoenix::atlas_tracker_version() {
  local source_path="${1-}"
  local header
  local version_fields
  local version_field

  header="$(_phoenix::atlas_tracker_header "$source_path")" || return $?

  version_fields="$(
    printf '%s\n' "$header" |
      tr ',' '\n' |
      grep -E '^atlas_v[0-9]+_status$' || true
  )"

  if [[ -z "$version_fields" ]]; then
    return 6
  fi

  if [[ "$(printf '%s\n' "$version_fields" | wc -l | tr -d ' ')" -ne 1 ]]; then
    return 6
  fi

  version_field="$version_fields"

  case "$version_field" in
    atlas_v1_status)
      printf '%s\n' "v1"
      return 0
      ;;
    atlas_v[0-9]*_status)
      return 7
      ;;
    *)
      return 6
      ;;
  esac
}

_phoenix::atlas_validate_tracker_header() {
  local source_path="${1-}"
  local header
  local required
  local field
  local count

  header="$(_phoenix::atlas_tracker_header "$source_path")" || return $?

  for required in \
    tracker_id \
    country \
    marketplace \
    category \
    atlas_v1_status \
    evidence_note
  do
    count="$(
      printf '%s\n' "$header" |
        tr ',' '\n' |
        awk -v required="$required" '$0 == required { count++ } END { print count + 0 }'
    )"

    if [[ "$count" -ne 1 ]]; then
      return 6
    fi
  done

  for field in $(printf '%s\n' "$header" | tr ',' ' '); do
    case "$field" in
      atlas_v[0-9]*_status)
        if [[ "$field" != "atlas_v1_status" ]]; then
          return 7
        fi
        ;;
    esac
  done

  return 0
}

_phoenix::atlas_validate_tracker_records() {
  local source_path="${1-}"

  if [[ -z "$source_path" ]]; then
    return 2
  fi

  if [[ ! -f "$source_path" ]]; then
    return 4
  fi

  if [[ ! -r "$source_path" ]]; then
    return 5
  fi

  awk -F',' '
    BEGIN {
      cr = sprintf("%c", 13)
    }

    {
      if (length($NF) > 0 && substr($NF, length($NF), 1) == cr) {
        $NF = substr($NF, 1, length($NF) - 1)
      }
    }

    NR == 1 {
      for (i = 1; i <= NF; i++) {
        index_by_name[$i] = i
      }

      required[1] = "tracker_id"
      required[2] = "country"
      required[3] = "marketplace"
      required[4] = "category"
      required[5] = "atlas_v1_status"
      required[6] = "evidence_note"

      for (i = 1; i <= 6; i++) {
        if (!(required[i] in index_by_name)) {
          exit 6
        }
      }

      next
    }

    {
      tracker_id = $(index_by_name["tracker_id"])
      country = $(index_by_name["country"])
      marketplace = $(index_by_name["marketplace"])
      category = $(index_by_name["category"])
      status = $(index_by_name["atlas_v1_status"])

      if (tracker_id !~ /^[0-9]+$/) {
        exit 6
      }

      if (country == "" || marketplace == "" || category == "") {
        exit 6
      }

      if (status !~ /^[A-Z][A-Z0-9_]*$/) {
        exit 6
      }
    }

    END {
      if (NR < 2) {
        exit 6
      }
    }
  ' "$source_path"

  case "$?" in
    0) return 0 ;;
    6) return 6 ;;
    *) return 8 ;;
  esac
}

_phoenix::atlas_validate_tracker_file() {
  local source_path="${1-}"
  local status

  if [[ -z "$source_path" ]]; then
    return 2
  fi

  _phoenix::atlas_tracker_version "$source_path" >/dev/null || {
    status=$?
    return "$status"
  }

  _phoenix::atlas_validate_tracker_header "$source_path" || {
    status=$?
    return "$status"
  }

  _phoenix::atlas_validate_tracker_records "$source_path" || {
    status=$?
    return "$status"
  }

  return 0
}

_phoenix::atlas_validate_source() {
  local source_id="${1-}"
  local source_path

  case "$source_id" in
    TRACKER)
      source_path="$(_phoenix::atlas_source_resolve TRACKER)" || return $?
      _phoenix::atlas_validate_tracker_file "$source_path"
      ;;
    "")
      return 2
      ;;
    *)
      return 2
      ;;
  esac
}
