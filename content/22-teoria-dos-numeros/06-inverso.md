---
title: Inverso modular
summary: Inverso modular.
status: done
complexity: O(log m)
tags: modular, inverso
---

## Ideia

Com módulo primo, o pequeno teorema de Fermat dá `a^(m-2)`. Para qualquer módulo coprimo, use `egcd`.

## Código

```cpp
const ll MOD = 1e9 + 7;
ll inv(ll a) { return power(a, MOD - 2, MOD); } // power: tópico de exponenciação modular

vector<ll> inverses(int n) { // inversos de 1..n em O(n)
    vector<ll> r(n + 1, 1);
    for (int i = 2; i <= n; i++) r[i] = (MOD - MOD / i) * r[MOD % i] % MOD;
    return r;
}
```
