---
title: Segment Tree — teoria
summary: Árvore binária de intervalos; merge associativo, 3 casos da query, enumeração 2i/2i+1, complexidades e propriedades.
status: done
complexity: build O(n) · update O(log n) · query O(log n)
tags: segtree, segment tree, árvore binária, merge, teoria
---

## Árvore binária (base)

- Cada nó tem no máximo 2 filhos (esquerdo e direito); o topo é a **raiz**.
- A quantidade de nós **dobra** a cada nível: 1, 2, 4, 8, … → altura máxima `log₂ N`.

## O que é

Árvore binária em que **cada nó representa um subarray contínuo** do array original (como no merge sort):

- Raiz: `[1, n]`. Folhas: `[i, i]`. Nó `[l, r]` tem filhos `[l, m]` e `[m+1, r]`, `m = (l + r) / 2`.
- Cada nó guarda `merge(esquerda, direita)`. Ex.: soma → `atual = 10 + 40 = 50`.

## Operações suportadas pelo merge

Qualquer operação **associativa**: `A ∗ (B ∗ C) = (A ∗ B) ∗ C`. Ex.: `+`, `·`, `max`, `min`, `gcd`, `and`, `or`, `xor`, composição de funções/matrizes, concatenação de hashes, "maior subarray" (guardando prefixo/sufixo/total/melhor). **Não** precisa ser comutativa (mantenha a ordem esquerda, direita), nem ter inverso.

## Operações

- **Build**: desce até as folhas `[i, i]`, coloca `a[i]`, e na volta faz `seg[v] = merge(filhos)`. Custa **O(n)**: são `2n - 1` nós, cada um processado uma vez. (O slide da aula diz O(N log N) — é um limite superior válido, mas o exato é O(n).)
- **Update pontual**: busca objetiva — "a posição está à esquerda ou à direita?" — até a folha; atualiza e **sempre recalcula o pai** na volta. O(log n) (um nó por nível).
- **Query [L, R]**: em cada nó, 3 casos:
  1. **Totalmente contido** em `[L, R]` → devolve o valor do nó (não desce).
  2. **Totalmente disjunto** → devolve o **neutro** (não desce).
  3. **Parte dentro, parte fora** → divide e combina os dois lados.
  Visita no máximo ~**4·log n** nós (≤ 2 nós "parciais" por nível). O(log n).

## Truques de implementação

- `vector<int> adj[N]` para guardar a árvore gasta memória à toa: enumere os nós como heap — raiz `1`, filho esquerdo `2·v`, direito `2·v + 1`. Pai de `v` é `v / 2`.
- Tamanho do vetor: `4n` (seguro para qualquer `n`).
- Versão iterativa (bottom-up, folhas em `n..2n-1`): mais curta e rápida para ponto + intervalo sem lazy.
- Neutros: soma 0, produto 1, mín `+INF`, máx `-INF`, gcd 0, xor 0, or 0, and "todos os bits 1".

## Comparação

| Estrutura | Update | Query | Observação |
|---|---|---|---|
| Prefix sum | O(n) | O(1) | estático |
| BIT | O(log n) | O(log n) | precisa de inverso (soma/xor) para `[l, r]`; constante baixa |
| Segtree | O(log n) | O(log n) | qualquer associativa; constante alta (recursiva) |
| Sparse table | — | O(1) | estática, idempotente (min/max/gcd) |
| Lazy segtree | O(log n) em intervalo | O(log n) | updates em intervalo |

## Ideias que aparecem

- **Segtree indexada pelo valor** (não pela posição) para DP: "melhor dp com valor < x".
- **Descer na segtree** para achar o k-ésimo / primeira posição com soma ≥ x em O(log n).
- Nó como `struct` com vários campos (mín + índice do mín, máx + índice…).
