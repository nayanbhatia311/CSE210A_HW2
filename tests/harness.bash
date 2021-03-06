#!/usr/bin/env bash

check() {
    run sh -c "echo '$1' | node while.js"
    echo "$1 = $2, your code outputs $output"
    [ "$output" = "$2" ]
}

checkOr() {
    run sh -c "echo '$1' | node while.js"
    echo "$1 = $2 or $3, your code outputs $output"
    [ "$output" = "$2" ] || [ "$output" = "$3" ]
}
