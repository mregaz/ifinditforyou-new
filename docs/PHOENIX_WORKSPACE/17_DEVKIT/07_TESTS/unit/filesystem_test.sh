#!/usr/bin/env bash

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

source "$DEVKIT_ROOT/core/filesystem.sh"

tests_run=0
tests_passed=0

assert_status() {
    local expected="${1:-}"
    local actual="${2:-}"
    local test_name="${3:-Unnamed test}"

    tests_run=$((tests_run + 1))

    if [[ "$actual" -eq "$expected" ]]; then
        printf 'PASS: %s\n' "$test_name"
        tests_passed=$((tests_passed + 1))
    else
        printf 'FAIL: %s\n' "$test_name"
        printf '  Expected status: %s\n' "$expected"
        printf '  Actual status:   %s\n' "$actual"
    fi
}

phoenix::path_exists "$DEVKIT_ROOT"
existing_status=$?

assert_status \
    0 \
    "$existing_status" \
    "path_exists returns 0 for an existing path"

phoenix::path_exists "$DEVKIT_ROOT/this-path-does-not-exist"
missing_status=$?

assert_status \
    1 \
    "$missing_status" \
    "path_exists returns 1 for a missing path"
# ------------------------------------------------------------------------------
# is_file
# ------------------------------------------------------------------------------

phoenix::is_file "$DEVKIT_ROOT/core/filesystem.sh"
file_status=$?

assert_status \
    0 \
    "$file_status" \
    "is_file returns 0 for a regular file"

phoenix::is_file "$DEVKIT_ROOT/core"
directory_as_file_status=$?

assert_status \
    1 \
    "$directory_as_file_status" \
    "is_file returns 1 for a directory"

# ------------------------------------------------------------------------------
# is_directory
# ------------------------------------------------------------------------------

phoenix::is_directory "$DEVKIT_ROOT/core"
directory_status=$?

assert_status \
    0 \
    "$directory_status" \
    "is_directory returns 0 for a directory"

phoenix::is_directory "$DEVKIT_ROOT/core/filesystem.sh"
file_as_directory_status=$?

assert_status \
    1 \
    "$file_as_directory_status" \
    "is_directory returns 1 for a regular file"

    # ------------------------------------------------------------------------------
# create_directory
# ------------------------------------------------------------------------------

create_test_directory="/tmp/phoenix-filesystem-create-test"

rm -rf "$create_test_directory"

phoenix::create_directory "$create_test_directory"
create_directory_status=$?

assert_status \
    0 \
    "$create_directory_status" \
    "create_directory returns 0 for a new directory"

if [[ -d "$create_test_directory" ]]; then
    created_directory_exists_status=0
else
    created_directory_exists_status=1
fi

assert_status \
    0 \
    "$created_directory_exists_status" \
    "create_directory creates the directory"

phoenix::remove_directory "$create_test_directory"
    # ------------------------------------------------------------------------------
# remove_directory
# ------------------------------------------------------------------------------

remove_test_directory="/tmp/phoenix-filesystem-remove-test"

mkdir -p "$remove_test_directory/subdirectory"

phoenix::remove_directory "$remove_test_directory"
remove_directory_status=$?

assert_status \
    0 \
    "$remove_directory_status" \
    "remove_directory returns 0 when removing an existing directory"

phoenix::remove_directory "$remove_test_directory"
remove_missing_directory_status=$?

assert_status \
    0 \
    "$remove_missing_directory_status" \
    "remove_directory returns 0 when the directory is already missing"
# ------------------------------------------------------------------------------
# copy_file
# ------------------------------------------------------------------------------

copy_source="/tmp/phoenix-copy-source.txt"
copy_destination="/tmp/phoenix-copy-destination.txt"

echo "Phoenix DevKit" > "$copy_source"
rm -f "$copy_destination"

phoenix::copy_file "$copy_source" "$copy_destination"
copy_status=$?

assert_status \
    0 \
    "$copy_status" \
    "copy_file returns 0 for a valid copy"

phoenix::copy_file "/tmp/file-that-does-not-exist.txt" "$copy_destination"
copy_missing_status=$?

assert_status \
    1 \
    "$copy_missing_status" \
    "copy_file returns 1 when the source file does not exist"

rm -f "$copy_source" "$copy_destination"
# ------------------------------------------------------------------------------
# move_file
# ------------------------------------------------------------------------------

move_source="/tmp/phoenix-move-source.txt"
move_destination="/tmp/phoenix-move-destination.txt"

echo "Phoenix DevKit" > "$move_source"
rm -f "$move_destination"

phoenix::move_file "$move_source" "$move_destination"
move_status=$?

assert_status \
    0 \
    "$move_status" \
    "move_file returns 0 for a valid move"

phoenix::move_file "/tmp/file-that-does-not-exist.txt" "$move_destination"
move_missing_status=$?

assert_status \
    1 \
    "$move_missing_status" \
    "move_file returns 1 when the source file does not exist"

rm -f "$move_destination"
# ------------------------------------------------------------------------------
# remove_file
# ------------------------------------------------------------------------------

remove_file_path="/tmp/phoenix-remove-file.txt"

echo "Phoenix DevKit" > "$remove_file_path"

phoenix::remove_file "$remove_file_path"
remove_file_status=$?

assert_status \
    0 \
    "$remove_file_status" \
    "remove_file returns 0 when removing an existing file"

phoenix::remove_file "$remove_file_path"
remove_missing_file_status=$?

assert_status \
    0 \
    "$remove_missing_file_status" \
    "remove_file returns 0 when the file is already missing"

rm -f "$remove_file_path"
# ------------------------------------------------------------------------------
# read_file
# ------------------------------------------------------------------------------

read_file_path="/tmp/phoenix-read-file.txt"
read_missing_path="/tmp/phoenix-read-missing.txt"

printf 'Phoenix DevKit\nFilesystem Module\n' > "$read_file_path"
rm -f "$read_missing_path"

read_output="$(phoenix::read_file "$read_file_path")"
read_status=$?

assert_status \
    0 \
    "$read_status" \
    "read_file returns 0 for a readable file"

if [[ "$read_output" == $'Phoenix DevKit\nFilesystem Module' ]]; then
    tests_run=$((tests_run + 1))
    tests_passed=$((tests_passed + 1))
    printf 'PASS: read_file returns the expected content\n'
else
    tests_run=$((tests_run + 1))
    tests_failed=$((tests_failed + 1))
    printf 'FAIL: read_file returns the expected content\n'
fi

rm -f "$read_file_path" "$read_missing_path"
# ------------------------------------------------------------------------------
# write_file
# ------------------------------------------------------------------------------

write_file_path="/tmp/phoenix-write-file.txt"

rm -f "$write_file_path"

phoenix::write_file "$write_file_path" "Phoenix DevKit"
write_status=$?

assert_status \
    0 \
    "$write_status" \
    "write_file returns 0 for a valid write"

phoenix::write_file "$write_file_path" "Filesystem Module"
write_overwrite_status=$?

write_output="$(cat "$write_file_path")"

if [[ "$write_overwrite_status" -eq 0 && "$write_output" == "Filesystem Module" ]]; then
    tests_run=$((tests_run + 1))
    tests_passed=$((tests_passed + 1))
    printf 'PASS: write_file overwrites existing content\n'
else
    tests_run=$((tests_run + 1))
    tests_failed=$((tests_failed + 1))
    printf 'FAIL: write_file overwrites existing content\n'
fi

rm -f "$write_file_path"
printf '\nTests: %d | Passed: %d | Failed: %d\n' \
    "$tests_run" \
    "$tests_passed" \
    "$((tests_run - tests_passed))"

if [[ "$tests_run" -eq "$tests_passed" ]]; then
    exit 0
fi

exit 1
