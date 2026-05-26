#!/bin/bash
set -e

echo "========================================"
echo "  Link-in-Bio E2E Test Suite"
echo "========================================"
echo ""

BASE_URL="${BASE_URL:-http://localhost:3000/connect}"
export BASE_URL
E2E_RUN_ID="${E2E_RUN_ID:-$(date +%s)}"
export TEST_USER_NAME="${TEST_USER_NAME:-Test User}"
export TEST_USER_EMAIL="${TEST_USER_EMAIL:-test-${E2E_RUN_ID}@example.com}"
export TEST_USER_PASSWORD="${TEST_USER_PASSWORD:-TestPassword123!}"
export TEST_USER_SLUG="${TEST_USER_SLUG:-testuser-${E2E_RUN_ID}}"

# Ensure dev server is running at the configured app base path.
if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
  echo "ERROR: Dev server not running at $BASE_URL"
  echo "Start it with: npm run dev"
  exit 1
fi

# Create screenshots directory
mkdir -p tests/e2e/screenshots

# Track results
PASSED=0
FAILED=0
TESTS=()

run_test() {
  local name=$1
  local script=$2
  echo ""
  echo "----------------------------------------"
  echo "Running: $name"
  echo "----------------------------------------"
  if bash "$script"; then
    PASSED=$((PASSED + 1))
    TESTS+=("PASS: $name")
  else
    FAILED=$((FAILED + 1))
    TESTS+=("FAIL: $name")
  fi
}

# Run tests in order
run_test "Signup Flow" "tests/e2e/signup.sh"
run_test "Login Flow" "tests/e2e/login.sh"
run_test "Profile Editing" "tests/e2e/editor.sh"
run_test "Link CRUD" "tests/e2e/links.sh"
run_test "Drag-and-Drop Reorder" "tests/e2e/reorder.sh"

# Summary
echo ""
echo "========================================"
echo "  Results: $PASSED passed, $FAILED failed"
echo "========================================"
for t in "${TESTS[@]}"; do
  echo "  $t"
done
echo ""

if [ $FAILED -gt 0 ]; then
  echo "SOME TESTS FAILED"
  exit 1
else
  echo "ALL TESTS PASSED"
  exit 0
fi
