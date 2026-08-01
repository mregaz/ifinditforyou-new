#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

source "$PROJECT_ROOT/core/runtime.sh"

echo "========================================"
echo " Phoenix DevKit Runtime Certification"
echo "========================================"
echo

echo "Testing runtime_info..."
output="$(phoenix::runtime_info)"

if [[ "$output" == "Phoenix DevKit Runtime v0.1" ]]; then
  echo "✓ runtime_info"
else
  echo "✗ runtime_info"
  exit 1
fi

echo

echo "Testing is_command_available..."

phoenix::is_command_available bash
echo "✓ bash found"

if phoenix::is_command_available command_that_does_not_exist; then
  echo "✗ invalid command detected as existing"
  exit 1
fi

echo "✓ invalid command rejected"

echo

echo "Testing require_command..."

phoenix::require_command bash
echo "✓ require_command success"

if phoenix::require_command command_that_does_not_exist; then
  echo "✗ require_command failed"
  exit 1
fi

echo "✓ missing command detected"

echo

echo "Testing fail..."

if phoenix::fail "Test error"; then
  echo "✗ fail returned success"
  exit 1
fi

echo "✓ fail"

echo
echo "========================================"
echo " Runtime Module Certified"
echo "========================================"
