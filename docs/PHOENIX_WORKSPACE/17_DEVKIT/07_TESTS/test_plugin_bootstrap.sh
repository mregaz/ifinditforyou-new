set -u

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_DIR="$(cd "${TEST_DIR}/.." && pwd)"

source "${DEVKIT_DIR}/06_PLUGINS/definition.sh"
source "${DEVKIT_DIR}/06_PLUGINS/registry.sh"
source "${DEVKIT_DIR}/06_PLUGINS/contributions.sh"
source "${DEVKIT_DIR}/06_PLUGINS/bootstrap.sh"

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

echo "===== Plugin Bootstrap Tests ====="
echo

if declare -F _phoenix::plugin_bootstrap >/dev/null 2>&1; then
  pass "bootstrap helper exists"
else
  fail "bootstrap helper exists"
fi

echo
echo "===== Bootstrap orchestration ====="

PLUGIN_REGISTER_CALLS=0
PREFLIGHT_CALLS=0
APPLY_CALLS=0

phoenix::plugin_register() {
  PLUGIN_REGISTER_CALLS=$((PLUGIN_REGISTER_CALLS + 1))
  return 0
}

_phoenix::plugin_contributions_preflight() {
  PREFLIGHT_CALLS=$((PREFLIGHT_CALLS + 1))
  return 0
}

_phoenix::plugin_contributions_apply() {
  APPLY_CALLS=$((APPLY_CALLS + 1))
  return 0
}

expect_success \
  "canonical bootstrap succeeds" \
  _phoenix::plugin_bootstrap \
  "marketplace-pack" \
  $'ID=marketplace-pack\nCONTRACT_VERSION=1.0'

[[ "$PREFLIGHT_CALLS" -eq 1 ]] \
  && pass "bootstrap performs preflight exactly once" \
  || fail "bootstrap performs preflight exactly once"

[[ "$PLUGIN_REGISTER_CALLS" -eq 1 ]] \
  && pass "bootstrap registers plugin exactly once" \
  || fail "bootstrap registers plugin exactly once"

[[ "$APPLY_CALLS" -eq 1 ]] \
  && pass "bootstrap applies contributions exactly once" \
  || fail "bootstrap applies contributions exactly once"

echo
echo "===== Preflight failure containment ====="

PLUGIN_REGISTER_CALLS=0
PREFLIGHT_CALLS=0
APPLY_CALLS=0

_phoenix::plugin_contributions_preflight() {
  PREFLIGHT_CALLS=$((PREFLIGHT_CALLS + 1))
  return 1
}

expect_failure \
  "preflight failure makes bootstrap fail" \
  _phoenix::plugin_bootstrap \
  "marketplace-pack" \
  $'ID=marketplace-pack\nCONTRACT_VERSION=1.0'

[[ "$PLUGIN_REGISTER_CALLS" -eq 0 ]] \
  && pass "plugin registration is not attempted after failed preflight" \
  || fail "plugin registration is not attempted after failed preflight"

[[ "$APPLY_CALLS" -eq 0 ]] \
  && pass "contribution application is not attempted after failed preflight" \
  || fail "contribution application is not attempted after failed preflight"

echo
echo "===== Plugin registration failure containment ====="

PLUGIN_REGISTER_CALLS=0
PREFLIGHT_CALLS=0
APPLY_CALLS=0

_phoenix::plugin_contributions_preflight() {
  PREFLIGHT_CALLS=$((PREFLIGHT_CALLS + 1))
  return 0
}

phoenix::plugin_register() {
  PLUGIN_REGISTER_CALLS=$((PLUGIN_REGISTER_CALLS + 1))
  return 1
}

expect_failure \
  "plugin registration failure makes bootstrap fail" \
  _phoenix::plugin_bootstrap \
  "marketplace-pack" \
  $'ID=marketplace-pack\nCONTRACT_VERSION=1.0'

[[ "$APPLY_CALLS" -eq 0 ]] \
  && pass "contribution application is not attempted after plugin registration failure" \
  || fail "contribution application is not attempted after plugin registration failure"

echo
echo "===== Contribution application failure ====="

PLUGIN_REGISTER_CALLS=0
PREFLIGHT_CALLS=0
APPLY_CALLS=0

phoenix::plugin_register() {
  PLUGIN_REGISTER_CALLS=$((PLUGIN_REGISTER_CALLS + 1))
  return 0
}

_phoenix::plugin_contributions_apply() {
  APPLY_CALLS=$((APPLY_CALLS + 1))
  return 1
}

expect_failure \
  "contribution application failure makes bootstrap fail" \
  _phoenix::plugin_bootstrap \
  "marketplace-pack" \
  $'ID=marketplace-pack\nCONTRACT_VERSION=1.0'

[[ "$PLUGIN_REGISTER_CALLS" -eq 1 ]] \
  && pass "plugin registration occurs before contribution application failure" \
  || fail "plugin registration occurs before contribution application failure"

[[ "$APPLY_CALLS" -eq 1 ]] \
  && pass "contribution application is attempted after successful plugin registration" \
  || fail "contribution application is attempted after successful plugin registration"

echo
echo "===== Argument validation ====="

expect_failure \
  "missing bootstrap arguments are rejected" \
  _phoenix::plugin_bootstrap

expect_failure \
  "single bootstrap argument is rejected" \
  _phoenix::plugin_bootstrap \
  "marketplace-pack"

echo
echo "===== Results ====="
echo "PASS=${PASS_COUNT}"
echo "FAIL=${FAIL_COUNT}"

[[ "$FAIL_COUNT" -eq 0 ]]
