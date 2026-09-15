#!/usr/bin/env bash
# OWASP GenAI Crosswalk — Run all Garak evaluation profiles
# ─────────────────────────────────────────────────────────────
# Usage:
#   GARAK_MODEL_TYPE=<type> GARAK_MODEL_NAME=<name> bash evals/garak/run_all.sh
#
# Environment variables:
#   GARAK_MODEL_TYPE  — garak generator family (required; e.g. openai, huggingface, rest, ollama)
#   GARAK_MODEL_NAME  — deployment / model identifier for that generator (required)
#   <generator creds> — whatever the chosen generator needs (e.g. OPENAI_API_KEY)
#
# No default target is shipped: the script refuses to run until both variables
# are set, so a profile can never silently run against the wrong deployment.
# See evals/README.md, "Choosing a target".
#
# Every *.yaml in this directory is run, in name order. Thresholds live in the
# profiles themselves and are tabulated in evals/THRESHOLDS.md (DRAFT status).
#
# Authorisation: run only against systems you own or have written permission
# to test. Results are written to evals/results/<timestamp>/ (git-ignored).
# Exit code: 0 if all profiles pass, 1 if any fail, 2 if the target is not set.

set -euo pipefail

MODEL_TYPE="${GARAK_MODEL_TYPE:-}"
MODEL_NAME="${GARAK_MODEL_NAME:-}"

if [ -z "$MODEL_TYPE" ] || [ -z "$MODEL_NAME" ]; then
  echo "ERROR: GARAK_MODEL_TYPE and GARAK_MODEL_NAME must both be set." >&2
  echo "       No default target is shipped — see evals/README.md, 'Choosing a target'." >&2
  exit 2
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
RESULTS_DIR="$REPO_ROOT/evals/results/$(date +%Y%m%d_%H%M%S)"

mkdir -p "$RESULTS_DIR"

# Every profile in this directory, name-sorted. Adding a profile is adding a file.
PROFILES=()
while IFS= read -r p; do PROFILES+=("$p"); done < <(ls "$SCRIPT_DIR"/*.yaml | sort)

PASS=0
FAIL=0
FAILED_PROFILES=()

echo ""
echo "OWASP GenAI Crosswalk — Garak evaluation suite"
echo "Model   : $MODEL_TYPE / $MODEL_NAME"
echo "Profiles: ${#PROFILES[@]}"
echo "Results : $RESULTS_DIR"
echo "────────────────────────────────────────────────────"

for profile in "${PROFILES[@]}"; do
  name=$(basename "$profile" .yaml)
  echo ""
  echo "▶  Running: $name"

  if garak \
      --config "$profile" \
      --model_type "$MODEL_TYPE" \
      --model_name "$MODEL_NAME" \
      --report_prefix "$RESULTS_DIR/$name" \
      2>&1 | tee "$RESULTS_DIR/${name}.log"; then
    echo "✓  PASS: $name"
    ((PASS++)) || true
  else
    echo "✗  FAIL: $name"
    ((FAIL++)) || true
    FAILED_PROFILES+=("$name")
  fi
done

echo ""
echo "────────────────────────────────────────────────────"
echo "Results: $PASS passed, $FAIL failed"

if [ "${#FAILED_PROFILES[@]}" -gt 0 ]; then
  echo ""
  echo "Failed profiles:"
  for f in "${FAILED_PROFILES[@]}"; do
    echo "  ✗ $f"
  done
  echo ""
  echo "See $RESULTS_DIR for full logs."
  exit 1
fi

echo ""
echo "All profiles passed. See $RESULTS_DIR for full reports."
exit 0
