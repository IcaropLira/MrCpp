---
title: Miller-Rabin
summary: Teste de primalidade determinístico para qualquer inteiro de 64 bits.
status: done
complexity: O(k · log n) por teste, k = 12 bases
tags: teoria dos números, primalidade, miller-rabin
---

## Ideia

Escreva `n - 1 = d · 2^s` com `d` ímpar. Para uma base `a`, se `n` é primo então `a^d ≡ 1` ou `a^(d·2^r) ≡ -1` para algum `r < s`. Um composto que passa para a base `a` é um pseudoprimo forte; as 12 primeiras bases primas (2, 3, ..., 37) não têm pseudoprimo forte comum abaixo de `3,18 · 10^23`, logo o teste é exato para `n < 2^64`. O produto modular usa `__int128`.

## Código

```cpp
using u64 = unsigned long long;
using u128 = unsigned __int128;

u64 mulmod(u64 a, u64 b, u64 m) { return (u128)a * b % m; }
u64 powmod(u64 a, u64 e, u64 m) {
    u64 r = 1;
    for (a %= m; e; e >>= 1, a = mulmod(a, a, m)) if (e & 1) r = mulmod(r, a, m);
    return r;
}

bool primo(u64 n) {
    if (n < 2) return false;
    for (u64 p : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        if (n % p == 0) return n == p;
    }
    u64 d = n - 1;
    int s = 0;
    while (!(d & 1)) d >>= 1, s++;
    for (u64 a : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        u64 x = powmod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool composto = true;
        for (int r = 1; r < s && composto; r++) {
            x = mulmod(x, x, n);
            if (x == n - 1) composto = false;
        }
        if (composto) return false;
    }
    return true;
}
```

## Complexidade e cuidados

- Para `n` pequeno (até `1e6`) um crivo é mais simples; Miller-Rabin vale quando há muitas consultas ou `n` grande.
- Com bases só `{2, 3, 5, 7}` o teste é exato apenas para `n < 3.2e9`; as 12 bases cobrem todo `u64`.
- Sem `__int128` use multiplicação russa para `mulmod` quando `n > 2^32`.
- É a base do Pollard rho: teste primalidade antes de tentar fatorar.
