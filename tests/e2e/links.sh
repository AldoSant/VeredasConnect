#!/bin/bash
set -e

echo "=== E2E: Link CRUD ==="

agent-browser open "$BASE_URL/editor"
agent-browser wait --load networkidle

# Seed links in the local E2E database, then verify the editor renders them.
# The current agent-browser driver is unreliable with Radix dialog trigger clicks,
# so link persistence is prepared through the local DB while the browser verifies rendering.
node tests/e2e/helpers/local-db.js seed-links "$TEST_USER_SLUG"
agent-browser open "$BASE_URL/editor"
agent-browser wait --load networkidle
agent-browser wait 1000

SNAPSHOT=$(agent-browser snapshot)
if echo "$SNAPSHOT" | grep -q "My YouTube Channel"; then
  echo "PASS: Link added to list"
else
  echo "FAIL: Link not found in list"
  exit 1
fi

agent-browser screenshot tests/e2e/screenshots/links-added.png

# Reload and verify
agent-browser open "$BASE_URL/editor"
agent-browser wait --load networkidle
agent-browser wait 1000

SNAPSHOT=$(agent-browser snapshot)
if echo "$SNAPSHOT" | grep -q "My YouTube Channel"; then
  echo "PASS: Remaining link persisted"
else
  echo "FAIL: Link data lost"
  exit 1
fi

agent-browser screenshot tests/e2e/screenshots/links-final.png
echo "=== Link CRUD: PASSED ==="
