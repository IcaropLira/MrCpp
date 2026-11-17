---
title: Números de Catalan
summary: C_n conta sequências de parênteses válidas, árvores binárias e caminhos de Dyck.
status: done
complexity: O(n) com fatoriais; O(n²) pela recorrência
tags: combinatória, catalan, parênteses
---

## Ideia

`C_n = (2n)! / (n! (n+1)!)` conta: sequências de parênteses balanceadas com `n` pares, árvores binárias com `n` nós, triangulações de um polígono convexo de `n+2` lados e caminhos que não cruzam a diagonal. A recorrência `C_{n+1} = sum C_i · C_{n-i}` vem de separar o primeiro parêntese e o que o fecha.

## Código

```cpp
const ll MOD = 1e9 + 7;
ll pw(ll a, ll e) {
    ll r = 1;
    for (a %= MOD; e; e >>= 1, a = a * a % MOD) if (e & 1) r = r * a % MOD;
    return r;
}

// C_0..C_n mod MOD pela recorrência, O(n²)
vector<ll> catalan_dp(int n) {
    vector<ll> c(n + 1, 0);
    c[0] = 1;
    for (int i = 1; i <= n; i++)
        for (int j = 0; j < i; j++) c[i] = (c[i] + c[j] * c[i - 1 - j]) % MOD;
    return c;
}

// C_0..C_n mod MOD por fatoriais, O(n); vale para 2n < MOD
vector<ll> catalan_fat(int n) {
    vector<ll> f(2 * n + 2, 1), inv(2 * n + 2, 1), c(n + 1);
    for (int i = 1; i < (int)f.size(); i++) f[i] = f[i - 1] * i % MOD;
    inv.back() = pw(f.back(), MOD - 2);
    for (int i = (int)f.size() - 1; i > 0; i--) inv[i - 1] = inv[i] * i % MOD;
    for (int i = 0; i <= n; i++) c[i] = f[2 * i] * inv[i] % MOD * inv[i + 1] % MOD;
    return c;
}
```

## Complexidade e cuidados

- Valores exatos: 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, ... `C_35` já passa de `2^63`; use módulo ou inteiros grandes.
- Parênteses com `k` tipos diferentes: multiplique por `k^n`. Prefixos com restrição (nunca negativo) são o princípio da reflexão: `C(2n, n) - C(2n, n+1)`.
- Para `n` grande e consultas isoladas use fatoriais pré-calculados (`O(1)` por consulta).
- O módulo precisa ser primo e maior que `2n`.
