---
title: SOS DP (soma sobre subconjuntos)
summary: f[mask] = Σ a[sub] para sub ⊆ mask em O(n·2ⁿ); versão superconjuntos e inversa (Möbius).
status: done
complexity: O(n · 2ⁿ)
tags: sos dp, bitmask, subconjuntos, zeta
---

## Ideia

Processa um bit por vez: depois do bit `i`, `f[mask]` soma todos os `sub` que diferem de `mask` só nos bits `0..i`. Ingênuo sobre submáscaras: O(3ⁿ).

- Superconjuntos: `if (!(mask >> i & 1)) f[mask] += f[mask | 1 << i]`.
- Inversa (desfazer a soma): mesmo laço com `−=`.
- Aplicações: contar pares com `a_i & a_j = 0` (`a_j ⊆ ~a_i`), "algum elemento é submáscara de x", convolução OR/AND.

## Código

```cpp
// SOS DP (soma sobre subconjuntos): f[mask] = soma de a[s] para todo s ⊆ mask, em O(n 2^n)
// Superconjuntos: troque a condição para !(mask >> i & 1) e some f[mask | 1<<i].
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    int n; cin >> n;                       // nº de bits
    vector<ll> f(1 << n);
    for (auto &x : f) cin >> x;
    for (int i = 0; i < n; i++)            // bit por bit (a ordem dos laços importa!)
        for (int mask = 0; mask < (1 << n); mask++)
            if (mask >> i & 1) f[mask] += f[mask ^ (1 << i)];
    for (int mask = 0; mask < (1 << n); mask++) cout << f[mask] << " \n"[mask + 1 == (1 << n)];
}
```

Exemplo testado — entrada:

```text
2
1 2 3 4
```

saída:

```text
1 3 4 10
```

> Verificação: 400 casos aleatórios contra a enumeração de submáscaras.
