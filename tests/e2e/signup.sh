#!/bin/bash
set -e

echo "=== E2E: Signup Flow ==="

# Navigate to signup
agent-browser open "$BASE_URL/signup"
agent-browser wait --load networkidle
agent-browser screenshot tests/e2e/screenshots/signup-page.png

# Get interactive elements
agent-browser snapshot -i

# Fill signup form
agent-browser find label "Name" fill "$TEST_USER_NAME"
agent-browser find label "Email" fill "$TEST_USER_EMAIL"
agent-browser find label "Password" fill "$TEST_USER_PASSWORD"

# Fill slug and wait for availability check
agent-browser find label "Username" fill "$TEST_USER_SLUG"
agent-browser wait 1000  # Wait for debounced slug check

# Take screenshot before submit
agent-browser screenshot tests/e2e/screenshots/signup-filled.png

# Submit the form
agent-browser find role button click --name "Create Account"

# Wait for redirect to editor
agent-browser wait 3000
agent-browser wait --load networkidle

# Verify we're on the editor page
URL=$(agent-browser get url)
if [[ "$URL" == *"/editor"* ]]; then
  echo "PASS: Redirected to editor after signup"
else
  echo "FAIL: Expected /editor, got $URL"
  exit 1
fi

agent-browser screenshot tests/e2e/screenshots/signup-success.png
echo "=== Signup Flow: PASSED ==="
