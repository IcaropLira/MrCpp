---
title: Coeficiente binomial
summary: Coeficiente binomial módulo primo.
status: done
complexity: O(n) + O(1)
tags: combinatória, binomial
---

## Ideia

Pré-calcula fatoriais e seus inversos; cada `C(n, k)` vira três multiplicações.

## Código

```cpp
const ll MOD = 1e9 + 7;
vector<ll> f, fi;
void init(int n) {
    f.assign(n + 1, 1); fi.assign(n + 1, 1);
    for (int i = 1; i <= n; i++) f[i] = f[i - 1] * i % MOD;
    fi[n] = power(f[n], MOD - 2, MOD); // power: exponenciação modular
    for (int i = n; i > 0; i--) fi[i - 1] = fi[i] * i % MOD;
}
ll C(int n, int k) { return k < 0 || k > n ? 0 : f[n] * fi[k] % MOD * fi[n - k] % MOD; }
```
