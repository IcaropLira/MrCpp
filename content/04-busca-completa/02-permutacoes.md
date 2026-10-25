---
title: Permutações
summary: Todas as permutações em ordem lexicográfica.
status: done
complexity: O(n! · n)
tags: busca completa
---

## Ideia

`next_permutation` gera a próxima; ordene antes para começar da primeira.

## Código

```cpp
sort(a.begin(), a.end());
do { /* usa a */ } while (next_permutation(a.begin(), a.end()));
```
