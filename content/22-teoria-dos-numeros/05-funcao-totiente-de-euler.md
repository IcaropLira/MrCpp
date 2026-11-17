---
title: Função totiente de Euler
summary: phi(n): quantos inteiros em [1, n] são coprimos com n; por fatoração e por crivo.
status: done
complexity: O(√n) por valor; O(N log log N) para todos até N
tags: teoria dos números, totiente, euler, crivo
---

## Ideia

`phi(n) = n · prod (1 - 1/p)` sobre os primos `p` que dividem `n`. Para um valor, fatore `n` em `O(√n)`. Para todos até `N`, o crivo começa com `phi[i] = i` e, para cada primo `p`, faz `phi[m] -= phi[m] / p` nos múltiplos `m` de `p`. O teorema de Euler diz `a^phi(n) ≡ 1 (mod n)` quando `gcd(a, n) = 1`.

## Código

```cpp
ll phi(ll n) {
    ll r = n;
    for (ll p = 2; p * p <= n; p++) {
        if (n % p) continue;
        while (n % p == 0) n /= p;
        r -= r / p;
    }
    if (n > 1) r -= r / n;
    return r;
}

// phi[0..N]
vector<int> crivo_phi(int N) {
    vector<int> phi(N + 1);
    iota(phi.begin(), phi.end(), 0);
    for (int p = 2; p <= N; p++)
        if (phi[p] == p)  // p é primo (ninguém menor o alterou)
            for (int m = p; m <= N; m += p) phi[m] -= phi[m] / p;
    return phi;
}
```

## Complexidade e cuidados

- `phi(1) = 1`; `phi(p) = p - 1` para primo; `phi(p^k) = p^(k-1) (p - 1)`; é multiplicativa.
- `sum_{d | n} phi(d) = n`.
- Redução de expoentes grandes: se `gcd(a, n) = 1`, `a^e ≡ a^(e mod phi(n))`; sem coprimalidade use `e >= log2(n)` e some `phi(n)`.
- `crivo_phi(1e7)` usa 40 MB; para um único `n` grande use fatoração (Pollard rho).
