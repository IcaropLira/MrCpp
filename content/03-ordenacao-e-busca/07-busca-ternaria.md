---
title: Busca ternária
summary: Máximo/mínimo de função unimodal, em inteiros e em reais.
status: done
complexity: O(log n)
tags: busca, busca ternária, unimodal
---

## Ideia

Para uma função estritamente decrescente e depois crescente (ou o contrário), compare `f` em dois pontos `m1 < m2`. Se `f(m1) < f(m2)`, o mínimo não está depois de `m2`; se `f(m1) > f(m2)`, não está antes de `m1`. Descarta-se um terço do intervalo por passo. Em inteiros termine com uma varredura curta.

## Código

```cpp
// mínimo de f em [lo, hi] (inteiros), f estritamente decrescente e depois crescente
template <class F> ll ternary_min(ll lo, ll hi, F f) {
    while (hi - lo > 2) {
        ll m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
        if (f(m1) < f(m2)) hi = m2 - 1;
        else if (f(m1) > f(m2)) lo = m1 + 1;
        else lo = m1, hi = m2;  // empate: o mínimo está entre os dois
    }
    ll best = lo;
    for (ll x = lo + 1; x <= hi; x++) if (f(x) < f(best)) best = x;
    return best;
}

// mínimo de f em [lo, hi] (reais), f unimodal
template <class F> double ternary_min_real(double lo, double hi, F f) {
    for (int it = 0; it < 100; it++) {
        double m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3;
        if (f(m1) < f(m2)) hi = m2; else lo = m1;
    }
    return (lo + hi) / 2;
}
```

## Complexidade e cuidados

- Platôs fora do ponto ótimo quebram a busca ternária (ela não sabe para que lado ir); nesse caso use busca binária sobre `f(x+1) - f(x)` quando a função for convexa.
- Para maximizar, aplique a busca em `-f`.
- Em reais, 100 iterações bastam para `double`; a precisão final é limitada pelo ruído de `f`.
- Cada passo custa 2 avaliações de `f`; a busca binária na diferença custa 2 também, mas é mais robusta.
