---
title: Busca binária
summary: Menor valor que satisfaz um predicado monótono.
status: done
complexity: O(log n)
tags: busca, binary search
---

## Ideia

Se o predicado é falso até certo ponto e verdadeiro depois, a busca binária encontra a fronteira em `log` passos. Serve para buscar em vetores ordenados e também para "buscar a resposta".

## Código

```cpp
template <class F> ll bsearch(ll lo, ll hi, F ok) { // menor x em [lo, hi] com ok(x)
    while (lo <= hi) {
        ll m = lo + (hi - lo) / 2;
        ok(m) ? hi = m - 1 : lo = m + 1;
    }
    return lo; // hi + 1 se ninguém satisfaz
}
```

## Uso

`ll x = bsearch(0, 1e9, [&](ll m) { return f(m) >= k; });`
