#!/bin/bash
set -euo pipefail

MSG="${1:?Usage: pnpm ship \"<message>\"}"

REPO="kheriox-technologies/luxuriahomes-admin"
BASE="master"
HEAD="develop"

# --- Guards ---
if ! command -v gh >/dev/null 2>&1; then
  echo "❌ GitHub CLI (gh) is not installed. Run: brew install gh && gh auth login"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "❌ GitHub CLI is not authenticated. Run: gh auth login"
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "$HEAD" ]]; then
  echo "❌ You are on '$CURRENT_BRANCH'. Switch to '$HEAD' before shipping."
  exit 1
fi

# --- Format + commit ---
echo "→ Running ultracite fix..."
pnpm dlx ultracite fix

git add -A
if git diff --cached --quiet; then
  echo "✓ No changes to commit, proceeding with existing commits"
else
  git commit -m "$MSG"
  echo "✓ Committed: $MSG"
fi

# --- Push ---
git push origin "$HEAD"
echo "✓ Pushed $HEAD"

# --- Create-or-reuse PR ---
PR=$(gh pr list --repo "$REPO" --head "$HEAD" --base "$BASE" --state open --json number --jq '.[0].number')
if [[ -z "$PR" ]]; then
  gh pr create --repo "$REPO" --base "$BASE" --head "$HEAD" --title "$MSG" --body "Automated release via ship.sh"
  PR=$(gh pr list --repo "$REPO" --head "$HEAD" --base "$BASE" --state open --json number --jq '.[0].number')
  echo "✓ Created PR #$PR"
else
  echo "✓ Reusing open PR #$PR"
fi

# --- Merge ---
gh pr merge "$PR" --repo "$REPO" --merge
echo "✓ Merged PR #$PR into $BASE"

# --- Re-sync local develop with master ---
git fetch origin "$BASE"
git merge --ff-only "origin/$BASE"
git push origin "$HEAD"
echo "✓ Synced $HEAD with $BASE"

echo "🚀 Shipped: $MSG"
