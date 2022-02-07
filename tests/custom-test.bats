load harness

@test "custom-1" {
  check 'if false ∧ -3 < 4 then x := -1 else y := 2' '{y → 2}'
}


@test "custom-2" {
  check 'if ( true ∨ true ) then x := z + y else x := y + 1 ; skip' '{x → 0}'
}

@test "custom-3" {
  check 'while c * a = -3 ∧ 3 * b = c + R do c := b * c ; b := 1 - 0' '{b → 1}'
}

@test "custom-4" {
  check 'if ( y * 4 < -1 - x ∧ -1 = 0 + y ) then z := ( -1 - -1 ) * -4 else z := 2 * -4 ; if ( y - -3 = y * z ∨ n * y < 1 * 2 ) then skip else if ( 1 < 0 - x ∨ true ) then x := y + -4 else y := -4 * y' '{z → -8}'
}


@test "custom-5" {
  check 'if ( false ∨ 3 < y + X ) then l := lv + -1 else x := -4 - z ; while -1 - p = 2 - -3 ∧ false do while ( ¬ ( 2 * -2 < y * y ) ) do skip' '{x → -4}'
}

