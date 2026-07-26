#!/usr/bin/env bash

set -euo pipefail

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SPRINTS_DIR="$WORKSPACE_ROOT/04_SPRINTS"

if [ $# -lt 2 ]; then
    echo "Usage:"
    echo "./tools/create_sprint.sh <number> \"Title\""
    exit 1
fi

SPRINT_NUMBER="$1"
shift

TITLE="$*"

FILENAME_TITLE="$(printf '%s' "$TITLE" \
    | tr '[:lower:]' '[:upper:]' \
    | sed 's/[^A-Z0-9]/_/g' \
    | tr -s '_' \
    | sed 's/^_//;s/_$//')"

SPRINT_DIR_NAME="SPRINT_${SPRINT_NUMBER}_${FILENAME_TITLE}"
TARGET_DIR="$SPRINTS_DIR/$SPRINT_DIR_NAME"

FILES=(
    README.md
    GOALS.md
    TASKS.md
    TEST_PLAN.md
    EXECUTION_LOG.md
    RESULTS.md
    RETROSPECTIVE.md
)

mkdir -p "$TARGET_DIR"

CREATED=0
SKIPPED=0
TODAY="$(date +%Y-%m-%d)"

echo "=============================================="
echo " PHOENIX SPRINT GENERATOR"
echo "=============================================="
echo
echo "Sprint : $SPRINT_NUMBER"
echo "Title  : $TITLE"
echo

for FILE in "${FILES[@]}"; do
    TARGET_FILE="$TARGET_DIR/$FILE"

    if [ -f "$TARGET_FILE" ]; then
        echo "SKIP   $FILE"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    case "$FILE" in

        README.md)
            cat > "$TARGET_FILE" <<EOF
# Sprint ${SPRINT_NUMBER} — ${TITLE}

**Status:** Planned

**Created:** ${TODAY}

---

## Objective

TODO

---

## Scope

TODO

---

## Deliverables

- TODO

---

## KPI

- Files modified:
- Tests passed:
- Providers completed:
- ADR created:
- Duration:

---

## Links

- ADR:
- Release:
- Master Record:

---

## Sprint Documents

- [Goals](./GOALS.md)
- [Tasks](./TASKS.md)
- [Test Plan](./TEST_PLAN.md)
- [Execution Log](./EXECUTION_LOG.md)
- [Results](./RESULTS.md)
- [Retrospective](./RETROSPECTIVE.md)

---

## Notes

TODO
EOF
            ;;

        GOALS.md)
            cat > "$TARGET_FILE" <<EOF
# Sprint ${SPRINT_NUMBER} Goals

## Primary Goal

TODO

---

## Secondary Goals

-

---

## Out of Scope

-
EOF
            ;;

        TASKS.md)
            cat > "$TARGET_FILE" <<EOF
# Sprint ${SPRINT_NUMBER} Tasks

## Planned

- [ ] TODO

---

## In Progress

- [ ] TODO

---

## Completed

- [ ] TODO

---

## Blocked

- [ ] TODO
EOF
            ;;

        TEST_PLAN.md)
            cat > "$TARGET_FILE" <<EOF
# Sprint ${SPRINT_NUMBER} Test Plan

## Unit Tests

-

---

## Integration Tests

-

---

## Manual Tests

-

---

## Validation Commands

\`\`\`bash
# Add commands here
\`\`\`

---

## Expected Result

-
EOF
            ;;

        EXECUTION_LOG.md)
            cat > "$TARGET_FILE" <<EOF
# Sprint ${SPRINT_NUMBER} Execution Log

## Session 1

**Date:** ${TODAY}

### Commands

\`\`\`bash
# Add commands here
\`\`\`

### Changes

-

### Notes

-

---

## Session 2

**Date:**

### Commands

\`\`\`bash
# Add commands here
\`\`\`

### Changes

-

### Notes

-
EOF
            ;;

        RESULTS.md)
            cat > "$TARGET_FILE" <<EOF
# Sprint ${SPRINT_NUMBER} Results

## Completed

-

---

## Metrics

- Tests passed:
- Tests failed:
- Files created:
- Files modified:
- Providers completed:
- ADR created:

---

## Problems Found

-

---

## Remaining Work

-

---

## Final Status

**Status:** PENDING
EOF
            ;;

        RETROSPECTIVE.md)
            cat > "$TARGET_FILE" <<EOF
# Sprint ${SPRINT_NUMBER} Retrospective

## What Went Well

-

---

## What Could Improve

-

---

## Lessons Learned

-

---

## Technical Debt

-

---

## Next Sprint

-
EOF
            ;;

    esac

    echo "CREATE $FILE"
    CREATED=$((CREATED + 1))
done

echo
echo "----------------------------------------------"
echo "Created : $CREATED"
echo "Skipped : $SKIPPED"
echo "Location: $TARGET_DIR"
echo "----------------------------------------------"
