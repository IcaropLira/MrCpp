---
title: Subconjuntos
summary: Percorre todos os subconjuntos com máscara.
status: done
complexity: O(2^n · n)
tags: busca completa, bitmask
---

## Ideia

Cada bit da máscara diz se o elemento entra no subconjunto.

## Código

```cpp
for (int mask = 0; mask < (1 << n); mask++)
    for (int i = 0; i < n; i++)
        if (mask >> i & 1) { /* a[i] pertence ao subconjunto */ }
```
