---
title: Compressão de coordenadas
summary: Reduzir valores grandes a índices 0..m−1 preservando a ordem — essencial para BIT/segtree por valor.
status: done
complexity: O(n log n)
tags: compressão, coordenadas, ordenação, busca binária, teoria
---

## Quando usar

Quando só importa **a ordem relativa** ("quantos maiores/menores que eu"), mas os valores são grandes (10⁹, negativos, até reais). Depois da compressão, o maior valor é ≤ n (n ≤ 2·10⁵) e cabe como índice de BIT/segtree.

## Como

1. Copie o array para um auxiliar e **ordene**.
2. Remova repetidos (`erase(unique(...))`).
3. Para cada `A[i]`, seu novo valor é o índice dele no auxiliar (busca binária: `lower_bound`).

```cpp
vector<long long> v(a.begin(), a.end());
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());
for (auto &x : a) x = lower_bound(v.begin(), v.end(), x) - v.begin(); // 0..m-1 (+1 para BIT)
```

## Cuidados

- Para consultas de faixa `[x - d, x + d]` em valores comprimidos, use `lower_bound(x - d)` e `upper_bound(x + d) - 1` (Pillars).
- Comprima **juntos** todos os valores que serão comparados (array + valores das consultas).
- "Estritamente menor" = prefixo até `p - 1`; "menor ou igual" = até `p`.
