---
title: Operações de bits
summary: Truques com bits.
status: done
complexity: O(1)
tags: bits, bitmask
---

## Ideia

Operações que aparecem em quase todo problema com máscaras.

## Código

```cpp
x & (x - 1)    // remove o bit mais baixo
x & -x         // isola o bit mais baixo
x >> i & 1     // testa o bit i
__builtin_popcount(x), __builtin_ctz(x), __lg(x)  // use a versão ll para 64 bits
```
