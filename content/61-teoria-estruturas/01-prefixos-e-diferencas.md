---
title: Prefix sum e vetor de diferenças
summary: Soma de intervalo em O(1) sem updates; somar em intervalo offline com diferenças; versões 2D e xor.
status: done
complexity: O(n) pré · O(1) consulta
tags: prefix sum, diferenças, 2d, xor, teoria
---

## Fórmulas

- `pref[0] = 0`, `pref[i] = pref[i-1] + a[i]` → `soma(l, r) = pref[r] - pref[l-1]`.
- Funciona para qualquer operação **com inverso** e associativa: soma (inverso: subtração), **xor** (inverso: o próprio xor), produto mod primo (inverso modular). Para mín/máx **não** (sem inverso) → sparse table/segtree.
- `xor(l..r) = px[r] ^ px[l-1]`.
- Diferenças: somar `x` em `[l, r]` → `d[l] += x`, `d[r+1] -= x`; ao final `a[i] = d[1] + … + d[i]`. Offline, O(1) por update.
- 2D: `P[i][j] = a[i][j] + P[i-1][j] + P[i][j-1] - P[i-1][j-1]`; retângulo `(x1,y1)-(x2,y2)` = `P[x2][y2] - P[x1-1][y2] - P[x2][y1-1] + P[x1-1][y1-1]`.

## Limitação (motivação da Segtree/BIT)

O prefixo é **estático**: um update em `a[k]` muda `pref[k..n]` → O(n). Com updates intercalados use BIT ou segtree.

## Onde aparece nas aulas

- Segtree: primeira solução do problema motivador (sem updates).
- DP do sapo: `dp[i] = pref[i-1] - pref[i-K-1]` (transição O(K) → O(1)).
- Candies: soma de janela de estados anteriores.
- Trie bit: `xor(l..r) = p[r] ^ p[l-1]` reduz O(N³) → O(N²) → com trie O(N·30).
- Euler tour (Ki): diferenças sobre a ordem `tin`.
- String hashing: "prefix sum" de hash com multiplicação pela base.
