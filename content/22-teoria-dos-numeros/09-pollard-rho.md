---
title: Pollard rho
summary: Fatora inteiros de até 64 bits em O(n^(1/4)) esperado, usando Miller-Rabin para parar.
status: done
complexity: O(n^(1/4)) esperado
tags: teoria dos números, fatoração, pollard rho
---

## Ideia

Iterando `x -> x² + c (mod n)`, a sequência entra em ciclo módulo cada fator primo `p` de `n` depois de cerca de `√p` passos, mas só entra em ciclo módulo `n` bem mais tarde. Quando dois valores coincidem módulo `p` mas não módulo `n`, `gcd(|x - y|, n)` é um fator não trivial. Floyd (tartaruga e lebre) detecta o ciclo. Fatore recursivamente e use Miller-Rabin para saber quando um fator já é primo.

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
bool primo(u64 n) {  // Miller-Rabin determinístico para 64 bits
    if (n < 2) return false;
    for (u64 p : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) if (n % p == 0) return n == p;
    u64 d = n - 1; int s = 0;
    while (!(d & 1)) d >>= 1, s++;
    for (u64 a : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        u64 x = powmod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool composto = true;
        for (int r = 1; r < s && composto; r++) { x = mulmod(x, x, n); if (x == n - 1) composto = false; }
        if (composto) return false;
    }
    return true;
}

mt19937_64 rng_rho(712367);

u64 rho(u64 n) {  // n composto e ímpar: devolve um divisor não trivial
    while (true) {
        u64 c = rng_rho() % (n - 1) + 1, x = rng_rho() % n, y = x, d = 1;
        auto f = [&](u64 v) { return (u64)(((u128)mulmod(v, v, n) + c) % n); };
        while (d == 1) {
            x = f(x); y = f(f(y));
            d = __gcd(x > y ? x - y : y - x, n);
        }
        if (d != n) return d;  // d == n: ciclo coincidiu; tenta outro c
    }
}

void fatora(u64 n, vector<u64>& out) {
    if (n == 1) return;
    if (primo(n)) { out.push_back(n); return; }
    u64 d = rho(n);
    fatora(d, out);
    fatora(n / d, out);
}

// fatores primos de n em ordem crescente, com repetição
vector<u64> fatorar(u64 n) {
    vector<u64> r;
    for (u64 p = 2; p < 100 && p * p <= n; p++)
        while (n % p == 0) r.push_back(p), n /= p;
    fatora(n, r);
    sort(r.begin(), r.end());
    return r;
}
```

## Complexidade e cuidados

- As divisões por primos pequenos antes do `rho` evitam o caso `n` par, que o `rho` não trata.
- Para muitas consultas, agrupe os `gcd` de 64 em 64 passos (versão de Brent): fica mais rápido por um fator constante.
- Perfeitos quadrados de primos (`p²`) também são fatorados corretamente.
- O pior caso é um semiprimo com dois fatores de ~`1e9`: cerca de `3 · 10^4` iterações.
