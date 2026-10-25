---
title: Exponenciação modular
summary: Potência modular por quadrados.
status: done
complexity: O(log e)
tags: modular, potência, número
---

## Ideia

Eleva ao quadrado a base a cada passo e multiplica no resultado quando o bit do expoente é 1.

## Código

```cpp
ll power(ll b, ll e, ll m) {
    ll r = 1; b %= m;
    for (; e > 0; e >>= 1, b = b * b % m)
        if (e & 1) r = r * b % m;
    return r;
}
```

## Uso

Inverso modular com `m` primo: `power(a, m - 2, m)`.
