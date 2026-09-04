#!/usr/bin/env bash

set -u

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_DIR="$(cd "${TEST_DIR}/.." && pwd)"

source "${DEVKIT_DIR}/06_PLUGINS/definition.sh"
source "${DEVKIT_DIR}/06_PLUGINS/contributions.sh"

PASS_COUNT=0
FAIL_COUNT=0

pass() {
  PASS_COUNT=$((PASS_COUNT + 1))
  printf 'PASS: %s\n' "$1"
}

fail() {
  FAIL_COUNT=$((FAIL_COUNT + 1))
  printf 'FAIL: %s\n' "$1"
}

expect_success() {
  local name="$1"
  shift

  if "$@"; then
    pass "$name"
  else
    fail "$name"
  fi
}

expect_failure() {
  local name="$1"
  shift

  if "$@"; then
    fail "$name"
  else
    pass "$name"
  fi
}

echo "===== Plugin Contribution Tests ====="

echo
echo "===== Contribution declaration grammar ====="

expect_success \
  "canonical Generator contribution is valid" \
  _phoenix::plugin_contribution_validate \
  "GENERATOR:provider"

expect_success \
  "canonical Validator contribution is valid" \
  _phoenix::plugin_contribution_validate \
  "VALIDATOR:dependencies"

expect_failure \
  "empty contribution is rejected" \
  _phoenix::plugin_contribution_validate \
  ""

expect_failure \
  "unsupported contribution type is rejected" \
  _phoenix::plugin_contribution_validate \
  "CORE:runtime"

expect_failure \
  "missing target id is rejected" \
  _phoenix::plugin_contribution_validate \
  "GENERATOR:"

expect_failure \
  "missing contribution type is rejected" \
  _phoenix::plugin_contribution_validate \
  ":provider"

expect_failure \
  "malformed contribution without separator is rejected" \
  _phoenix::plugin_contribution_validate \
  "GENERATOR"

echo
echo "===== Contribution binding validation ====="

if declare -F _phoenix::plugin_contribution_binding_validate >/dev/null 2>&1; then
  pass "binding validator helper exists"

  expect_success \
    "canonical Generator binding is valid" \
    _phoenix::plugin_contribution_binding_validate \
    "marketplace-pack" \
    "GENERATOR" \
    "provider" \
    $'ID=provider\nPURPOSE=Example Generator'

  expect_success \
    "canonical Validator binding is valid" \
    _phoenix::plugin_contribution_binding_validate \
    "marketplace-pack" \
    "VALIDATOR" \
    "dependencies" \
    $'ID=dependencies\nPURPOSE=Example Validator\nIMPLEMENTATION=example'

  expect_failure \
    "empty plugin id binding is rejected" \
    _phoenix::plugin_contribution_binding_validate \
    "" \
    "GENERATOR" \
    "provider" \
    $'ID=provider\nPURPOSE=Example Generator'

  expect_failure \
    "unsupported binding type is rejected" \
    _phoenix::plugin_contribution_binding_validate \
    "marketplace-pack" \
    "CORE" \
    "runtime" \
    $'ID=runtime\nPURPOSE=Example'

  expect_failure \
    "empty target id binding is rejected" \
    _phoenix::plugin_contribution_binding_validate \
    "marketplace-pack" \
    "GENERATOR" \
    "" \
    $'ID=provider\nPURPOSE=Example Generator'

  expect_failure \
    "empty target definition is rejected" \
    _phoenix::plugin_contribution_binding_validate \
    "marketplace-pack" \
    "GENERATOR" \
    "provider" \
    ""
else
  fail "binding validator helper exists"
fi
test_match_count_equals() {
  local expected="$1"
  local contribution_type="$2"
  local target_id="$3"
  shift 3

  local count

  count="$(
    _phoenix::plugin_contribution_binding_match_count \
      "$contribution_type" \
      "$target_id" \
      "$@"
  )" || return 1

  [[ "$count" == "$expected" ]]
}
echo
echo "===== Contribution binding matching ====="

if declare -F _phoenix::plugin_contribution_binding_match_count >/dev/null 2>&1; then
  pass "binding match-count helper exists"

  binding_types=("GENERATOR" "VALIDATOR" "GENERATOR")
  binding_target_ids=("provider" "dependencies" "report")

  expect_success \
    "exact Generator binding has one match" \
    test_match_count_equals \
    "1" \
    "GENERATOR" \
    "provider" \
    "${binding_types[@]}" \
    -- \
    "${binding_target_ids[@]}"

  expect_success \
    "exact Validator binding has one match" \
    test_match_count_equals \
    "1" \
    "VALIDATOR" \
    "dependencies" \
    "${binding_types[@]}" \
    -- \
    "${binding_target_ids[@]}"

  expect_success \
    "missing binding has zero matches" \
    test_match_count_equals \
    "0" \
    "GENERATOR" \
    "missing" \
    "${binding_types[@]}" \
    -- \
    "${binding_target_ids[@]}"
else
  fail "binding match-count helper exists"
fi
  duplicate_binding_types=("GENERATOR" "VALIDATOR" "GENERATOR")
  duplicate_binding_target_ids=("provider" "dependencies" "provider")

  expect_success \
    "duplicate exact Generator binding has two matches" \
    test_match_count_equals \
    "2" \
    "GENERATOR" \
    "provider" \
    "${duplicate_binding_types[@]}" \
    -- \
    "${duplicate_binding_target_ids[@]}"
    echo
echo "===== Contribution exact binding policy ====="

if declare -F _phoenix::plugin_contribution_binding_require_exact_one >/dev/null 2>&1; then
  pass "exact-one binding policy helper exists"

  exact_binding_types=("GENERATOR" "VALIDATOR")
  exact_binding_target_ids=("provider" "dependencies")

  duplicate_binding_types=("GENERATOR" "VALIDATOR" "GENERATOR")
  duplicate_binding_target_ids=("provider" "dependencies" "provider")

  expect_success \
    "exactly one matching binding is accepted" \
    _phoenix::plugin_contribution_binding_require_exact_one \
    "GENERATOR" \
    "provider" \
    "${exact_binding_types[@]}" \
    -- \
    "${exact_binding_target_ids[@]}"

  expect_failure \
    "missing matching binding is rejected" \
    _phoenix::plugin_contribution_binding_require_exact_one \
    "GENERATOR" \
    "missing" \
    "${exact_binding_types[@]}" \
    -- \
    "${exact_binding_target_ids[@]}"

  expect_failure \
    "duplicate matching binding is rejected" \
    _phoenix::plugin_contribution_binding_require_exact_one \
    "GENERATOR" \
    "provider" \
    "${duplicate_binding_types[@]}" \
    -- \
    "${duplicate_binding_target_ids[@]}"
else
  fail "exact-one binding policy helper exists"
fi
echo
echo "===== Whole Plugin contribution validation ====="

if declare -F _phoenix::plugin_contributions_validate >/dev/null 2>&1; then
  pass "whole contribution validator helper exists"

  plugin_definition=$'ID=sample-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:provider\nCONTRIBUTION=VALIDATOR:dependencies'

  generator_definition=$'ID=provider\nCONTRACT_VERSION=1.0'
  validator_definition=$'ID=dependencies\nCONTRACT_VERSION=1.0'

  expect_success \
    "all declared contributions with exact bindings are accepted" \
    _phoenix::plugin_contributions_validate \
    "sample-plugin" \
    "$plugin_definition" \
    "GENERATOR" \
    "provider" \
    "$generator_definition" \
    "VALIDATOR" \
    "dependencies" \
    "$validator_definition"

  expect_failure \
    "missing declared contribution binding is rejected" \
    _phoenix::plugin_contributions_validate \
    "sample-plugin" \
    "$plugin_definition" \
    "GENERATOR" \
    "provider" \
    "$generator_definition"

  expect_failure \
    "duplicate contribution binding is rejected" \
    _phoenix::plugin_contributions_validate \
    "sample-plugin" \
    "$plugin_definition" \
    "GENERATOR" \
    "provider" \
    "$generator_definition" \
    "GENERATOR" \
    "provider" \
    "$generator_definition" \
    "VALIDATOR" \
    "dependencies" \
    "$validator_definition"

  expect_failure \
    "wrong contribution type binding is rejected" \
    _phoenix::plugin_contributions_validate \
    "sample-plugin" \
    "$plugin_definition" \
    "VALIDATOR" \
    "provider" \
    "$generator_definition" \
    "VALIDATOR" \
    "dependencies" \
    "$validator_definition"

  expect_failure \
    "undeclared extra binding is rejected" \
    _phoenix::plugin_contributions_validate \
    "sample-plugin" \
    "$plugin_definition" \
    "GENERATOR" \
    "provider" \
    "$generator_definition" \
    "VALIDATOR" \
    "dependencies" \
    "$validator_definition" \
    "GENERATOR" \
    "extra" \
    "$generator_definition"

  expect_failure \
    "incomplete binding tuple is rejected" \
    _phoenix::plugin_contributions_validate \
    "sample-plugin" \
    "$plugin_definition" \
    "GENERATOR" \
    "provider"
else
  fail "whole contribution validator helper exists"
fi
echo
echo "===== Contribution validation edge cases ====="

edge_definition=$'ID=edge-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:provider\nCONTRIBUTION=VALIDATOR:dependencies'

edge_generator_definition=$'ID=provider\nCONTRACT_VERSION=1.0\nPURPOSE=generator binding payload'
edge_validator_definition=$'ID=dependencies\nCONTRACT_VERSION=1.0\nPURPOSE=validator binding payload'

expect_success \
  "binding order may differ from declaration order" \
  _phoenix::plugin_contributions_validate \
  "edge-plugin" \
  "$edge_definition" \
  "VALIDATOR" \
  "dependencies" \
  "$edge_validator_definition" \
  "GENERATOR" \
  "provider" \
  "$edge_generator_definition"

same_target_definition=$'ID=same-target-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:shared\nCONTRIBUTION=VALIDATOR:shared'

expect_success \
  "same target id across different contribution types is accepted" \
  _phoenix::plugin_contributions_validate \
  "same-target-plugin" \
  "$same_target_definition" \
  "GENERATOR" \
  "shared" \
  "$edge_generator_definition" \
  "VALIDATOR" \
  "shared" \
  "$edge_validator_definition"

duplicate_declaration_definition=$'ID=duplicate-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:provider\nCONTRIBUTION=GENERATOR:provider'

expect_failure \
  "duplicate declared contribution is rejected" \
  _phoenix::plugin_contributions_validate \
  "duplicate-plugin" \
  "$duplicate_declaration_definition" \
  "GENERATOR" \
  "provider" \
  "$edge_generator_definition"

expect_failure \
  "plugin id mismatch is rejected" \
  _phoenix::plugin_contributions_validate \
  "wrong-plugin" \
  "$edge_definition" \
  "GENERATOR" \
  "provider" \
  "$edge_generator_definition" \
  "VALIDATOR" \
  "dependencies" \
  "$edge_validator_definition"

expect_failure \
  "declared contributions with zero bindings are rejected" \
  _phoenix::plugin_contributions_validate \
  "edge-plugin" \
  "$edge_definition"

multiline_target_definition=$'ID=provider\nCONTRACT_VERSION=1.0\nPURPOSE=line one\nDESCRIPTION=line=two with equals'

single_contribution_definition=$'ID=multiline-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:provider'

expect_success \
  "multiline target definition remains valid inert binding data" \
  _phoenix::plugin_contributions_validate \
  "multiline-plugin" \
  "$single_contribution_definition" \
  "GENERATOR" \
  "provider" \
  "$multiline_target_definition"
echo
echo "===== Contribution preflight ====="

if declare -F _phoenix::plugin_contributions_preflight >/dev/null 2>&1; then
  pass "contribution preflight helper exists"

  _phoenix::plugin_compatibility_check() {
    return 0
  }
  preflight_definition=$'ID=preflight-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:new-generator\nCONTRIBUTION=VALIDATOR:new-validator'

  preflight_generator_definition=$'ID=new-generator\nCONTRACT_VERSION=1.0\nPURPOSE=generator contribution'
  preflight_validator_definition=$'ID=new-validator\nPURPOSE=validator contribution\nIMPLEMENTATION=phoenix::validator_test'

  phoenix::generator_exists() {
    return 1
  }

  phoenix::validator_exists() {
    return 1
  }

  phoenix::generator_register() {
    fail "Generator register must not run during preflight"
    return 1
  }

  phoenix::validator_register() {
    fail "Validator register must not run during preflight"
    return 1
  }

  expect_success \
    "clean Generator and Validator candidates pass preflight" \
    _phoenix::plugin_contributions_preflight \
    "preflight-plugin" \
    "$preflight_definition" \
    "GENERATOR" \
    "new-generator" \
    "$preflight_generator_definition" \
    "VALIDATOR" \
    "new-validator" \
    "$preflight_validator_definition"

  phoenix::generator_exists() {
    [[ "${1:-}" == "new-generator" ]]
  }

  expect_failure \
    "existing Generator target is rejected before mutation" \
    _phoenix::plugin_contributions_preflight \
    "preflight-plugin" \
    "$preflight_definition" \
    "GENERATOR" \
    "new-generator" \
    "$preflight_generator_definition" \
    "VALIDATOR" \
    "new-validator" \
    "$preflight_validator_definition"

  phoenix::generator_exists() {
    return 1
  }

  phoenix::validator_exists() {
    [[ "${1:-}" == "new-validator" ]]
  }

  expect_failure \
    "existing Validator target is rejected before mutation" \
    _phoenix::plugin_contributions_preflight \
    "preflight-plugin" \
    "$preflight_definition" \
    "GENERATOR" \
    "new-generator" \
    "$preflight_generator_definition" \
    "VALIDATOR" \
    "new-validator" \
    "$preflight_validator_definition"

else
  fail "contribution preflight helper exists"
fi

echo
echo "===== Contribution compatibility preflight ====="

preflight_compat_definition=$'ID=compat-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:compat-generator\nDEPENDENCY=REQUIRED:GENERATOR:register'

preflight_compat_generator_definition=$'ID=compat-generator\nCONTRACT_VERSION=1.0\nPURPOSE=compatibility test'

phoenix::generator_exists() {
  return 1
}

phoenix::generator_register() {
  fail "Generator register must not run during compatibility preflight"
  return 1
}

unset -f _phoenix::plugin_compatibility_check 2>/dev/null || true

expect_failure \
  "missing Plugin compatibility authority rejects preflight" \
  _phoenix::plugin_contributions_preflight \
  "compat-plugin" \
  "$preflight_compat_definition" \
  "GENERATOR" \
  "compat-generator" \
  "$preflight_compat_generator_definition"

_phoenix::plugin_compatibility_check() {
  return 1
}

expect_failure \
  "incompatible Plugin definition rejects preflight" \
  _phoenix::plugin_contributions_preflight \
  "compat-plugin" \
  "$preflight_compat_definition" \
  "GENERATOR" \
  "compat-generator" \
  "$preflight_compat_generator_definition"

_phoenix::plugin_compatibility_check() {
  return 0
}

expect_success \
  "compatible Plugin definition passes compatibility preflight" \
  _phoenix::plugin_contributions_preflight \
  "compat-plugin" \
  "$preflight_compat_definition" \
  "GENERATOR" \
  "compat-generator" \
  "$preflight_compat_generator_definition"
  echo
echo "===== Contribution preflight final edge barrier ====="

_phoenix::plugin_compatibility_check() {
  return 0
}

edge_preflight_definition=$'ID=edge-preflight-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:edge-generator\nCONTRIBUTION=VALIDATOR:edge-validator'

edge_generator_definition=$'ID=edge-generator\nCONTRACT_VERSION=1.0\nPURPOSE=edge generator'
edge_validator_definition=$'ID=edge-validator\nPURPOSE=edge validator\nIMPLEMENTATION=phoenix::validator_test'

phoenix::generator_exists() {
  return 1
}

phoenix::generator_register() {
  fail "Generator register must never run during preflight edge barrier"
  return 1
}

phoenix::validator_exists() {
  return 1
}

phoenix::validator_register() {
  fail "Validator register must never run during preflight edge barrier"
  return 1
}

unset -f phoenix::generator_exists 2>/dev/null || true

expect_failure \
  "missing Generator exists API rejects preflight" \
  _phoenix::plugin_contributions_preflight \
  "edge-preflight-plugin" \
  "$edge_preflight_definition" \
  "GENERATOR" \
  "edge-generator" \
  "$edge_generator_definition" \
  "VALIDATOR" \
  "edge-validator" \
  "$edge_validator_definition"

phoenix::generator_exists() {
  return 1
}

unset -f phoenix::generator_register 2>/dev/null || true

expect_failure \
  "missing Generator register API rejects preflight" \
  _phoenix::plugin_contributions_preflight \
  "edge-preflight-plugin" \
  "$edge_preflight_definition" \
  "GENERATOR" \
  "edge-generator" \
  "$edge_generator_definition" \
  "VALIDATOR" \
  "edge-validator" \
  "$edge_validator_definition"

phoenix::generator_register() {
  fail "Generator register must never run during preflight edge barrier"
  return 1
}

unset -f phoenix::validator_exists 2>/dev/null || true

expect_failure \
  "missing Validator exists API rejects preflight" \
  _phoenix::plugin_contributions_preflight \
  "edge-preflight-plugin" \
  "$edge_preflight_definition" \
  "GENERATOR" \
  "edge-generator" \
  "$edge_generator_definition" \
  "VALIDATOR" \
  "edge-validator" \
  "$edge_validator_definition"

phoenix::validator_exists() {
  return 1
}

unset -f phoenix::validator_register 2>/dev/null || true

expect_failure \
  "missing Validator register API rejects preflight" \
  _phoenix::plugin_contributions_preflight \
  "edge-preflight-plugin" \
  "$edge_preflight_definition" \
  "GENERATOR" \
  "edge-generator" \
  "$edge_generator_definition" \
  "VALIDATOR" \
  "edge-validator" \
  "$edge_validator_definition"

phoenix::validator_register() {
  fail "Validator register must never run during preflight edge barrier"
  return 1
}

expect_failure \
  "incomplete binding tuple rejects preflight" \
  _phoenix::plugin_contributions_preflight \
  "edge-preflight-plugin" \
  "$edge_preflight_definition" \
  "GENERATOR" \
  "edge-generator"

expect_failure \
  "empty target definition rejects preflight" \
  _phoenix::plugin_contributions_preflight \
  "edge-preflight-plugin" \
  "$edge_preflight_definition" \
  "GENERATOR" \
  "edge-generator" \
  "" \
  "VALIDATOR" \
  "edge-validator" \
  "$edge_validator_definition"

expect_failure \
  "preflight with no arguments fails safely" \
  _phoenix::plugin_contributions_preflight

expect_failure \
  "preflight with only plugin id fails safely" \
  _phoenix::plugin_contributions_preflight \
  "edge-preflight-plugin"

expect_failure \
  "whole contribution validation with no arguments fails safely" \
  _phoenix::plugin_contributions_validate

expect_failure \
  "whole contribution validation with only plugin id fails safely" \
  _phoenix::plugin_contributions_validate \
  "edge-preflight-plugin"
  echo
echo "===== Contribution application ====="

if declare -F _phoenix::plugin_contributions_apply >/dev/null 2>&1; then
  pass "contribution application helper exists"
else
  fail "contribution application helper exists"
fi

application_definition=$'ID=application-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:application-generator\nCONTRIBUTION=VALIDATOR:application-validator'

application_generator_definition=$'ID=application-generator\nCONTRACT_VERSION=1.0\nPURPOSE=application generator'
application_validator_definition=$'ID=application-validator\nPURPOSE=application validator\nIMPLEMENTATION=phoenix::validator_test'

application_calls=""

_phoenix::plugin_compatibility_check() {
  return 0
}

phoenix::generator_exists() {
  return 1
}

phoenix::validator_exists() {
  return 1
}

phoenix::generator_register() {
  local target_id="${1:-}"
  local target_definition="${2:-}"

  [[ "$target_id" == "application-generator" ]] || return 1
  [[ "$target_definition" == "$application_generator_definition" ]] || return 1

  application_calls="${application_calls}GENERATOR:${target_id}"$'\n'
  return 0
}

phoenix::validator_register() {
  local target_id="${1:-}"
  local target_definition="${2:-}"

  [[ "$target_id" == "application-validator" ]] || return 1
  [[ "$target_definition" == "$application_validator_definition" ]] || return 1

  application_calls="${application_calls}VALIDATOR:${target_id}"$'\n'
  return 0
}

if declare -F _phoenix::plugin_contributions_apply >/dev/null 2>&1; then
  expect_success \
    "application succeeds for canonical Generator and Validator contributions" \
    _phoenix::plugin_contributions_apply \
    "application-plugin" \
    "$application_definition" \
    "VALIDATOR" \
    "application-validator" \
    "$application_validator_definition" \
    "GENERATOR" \
    "application-generator" \
    "$application_generator_definition"

  expected_application_calls=$'GENERATOR:application-generator\nVALIDATOR:application-validator\n'

  if [[ "$application_calls" == "$expected_application_calls" ]]; then
    pass "application follows Plugin contribution declaration order"
  else
    fail "application follows Plugin contribution declaration order"
  fi
else
  fail "application succeeds for canonical Generator and Validator contributions"
  fail "application follows Plugin contribution declaration order"
fi
echo
echo "===== Contribution application failure containment ====="

failure_definition=$'ID=failure-plugin\nCONTRACT_VERSION=1.0\nCONTRIBUTION=GENERATOR:first-generator\nCONTRIBUTION=VALIDATOR:failing-validator\nCONTRIBUTION=GENERATOR:never-generator'

first_generator_definition=$'ID=first-generator\nCONTRACT_VERSION=1.0\nPURPOSE=first generator'
failing_validator_definition=$'ID=failing-validator\nPURPOSE=failing validator\nIMPLEMENTATION=phoenix::validator_failure_test'
never_generator_definition=$'ID=never-generator\nCONTRACT_VERSION=1.0\nPURPOSE=never generator'

failure_calls=""

_phoenix::plugin_compatibility_check() {
  return 0
}

phoenix::generator_exists() {
  return 1
}

phoenix::validator_exists() {
  return 1
}

phoenix::generator_register() {
  local target_id="${1:-}"
  local target_definition="${2:-}"

  case "$target_id" in
    first-generator)
      [[ "$target_definition" == "$first_generator_definition" ]] || return 1
      failure_calls="${failure_calls}GENERATOR:first-generator"$'\n'
      return 0
      ;;

    never-generator)
      failure_calls="${failure_calls}GENERATOR:never-generator"$'\n'
      return 0
      ;;

    *)
      return 1
      ;;
  esac
}

phoenix::validator_register() {
  local target_id="${1:-}"
  local target_definition="${2:-}"

  [[ "$target_id" == "failing-validator" ]] || return 1
  [[ "$target_definition" == "$failing_validator_definition" ]] || return 1

  failure_calls="${failure_calls}VALIDATOR:failing-validator"$'\n'
  return 1
}

expect_failure \
  "application fails when a mandatory lower registration fails" \
  _phoenix::plugin_contributions_apply \
  "failure-plugin" \
  "$failure_definition" \
  "GENERATOR" \
  "never-generator" \
  "$never_generator_definition" \
  "VALIDATOR" \
  "failing-validator" \
  "$failing_validator_definition" \
  "GENERATOR" \
  "first-generator" \
  "$first_generator_definition"

expected_failure_calls=$'GENERATOR:first-generator\nVALIDATOR:failing-validator\n'

if [[ "$failure_calls" == "$expected_failure_calls" ]]; then
  pass "application stops immediately after first lower registration failure"
else
  fail "application stops immediately after first lower registration failure"
fi

if [[ "$failure_calls" == *"GENERATOR:first-generator"* ]]; then
  pass "successful earlier registration is not rolled back"
else
  fail "successful earlier registration is not rolled back"
fi

if [[ "$failure_calls" != *"GENERATOR:never-generator"* ]]; then
  pass "contributions after failure are not applied"
else
  fail "contributions after failure are not applied"
fi
echo
echo "===== Summary ====="
printf 'PASS=%s FAIL=%s\n' "$PASS_COUNT" "$FAIL_COUNT"

if [[ "$FAIL_COUNT" -ne 0 ]]; then
  exit 1
fi

exit 0