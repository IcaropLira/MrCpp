---
title: Fatoração
summary: Fatoração por divisão até √n.
status: done
complexity: O(√n)
tags: primos, fatoração
---

## Ideia

Testa divisores até a raiz; o que sobra maior que 1 é primo.

## Código

```cpp
vector<pair<ll, int>> factor(ll n) {
    vector<pair<ll, int>> f;
    for (ll p = 2; p * p <= n; p++) if (n % p == 0) {
        int e = 0;
        while (n % p == 0) n /= p, e++;
        f.push_back({p, e});
    }
    if (n > 1) f.push_back({n, 1});
    return f;
}
```

## Uso

Para muitos números, use o crivo com menor fator primo.
