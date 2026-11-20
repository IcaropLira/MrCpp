---
title: Acelerando transições de DP
summary: Qual estrutura acelera cada tipo de transição — prefixo, segtree/BIT por valor, deque monotônica, lazy — com os exercícios da aula.
status: done
complexity: transição O(K) → O(1) ou O(log n)
tags: dp, otimização, segtree, bit, deque, prefix sum, lazy, teoria
---

## Fechamento da aula: qual estrutura acelera a transição?

| Forma da transição | Estrutura | Custo por estado | Exercício |
|---|---|---|---|
| soma de `dp` numa janela de **índices** (sem updates antigos) | prefix sum | O(1) | Sapo, Candies |
| min/máx de `dp` numa janela de índices que **desliza** | deque monotônica | O(1) amortizado | Rudolf and k Bridges |
| máx de `dp` com **valor** < x (ou faixa de valores) | segtree/BIT de máximo indexada pelo valor | O(log) | Flowers, Smooth Subsequence, LIS, Pillars |
| soma de `dp` com valor < x | BIT/segtree de soma por valor | O(log) | Increasing Subsequence II |
| idem, mas para cada tamanho `c` | uma BIT por tamanho | O(k log) | Subsequences (CF 597C) |
| soma em **faixa de estados** + máx global | lazy (range add, max) | O(log) | Intervals (DP W) |
| valores grandes | + compressão de coordenadas | — | LIS, Pillars |

## Padrão "segtree indexada pelo valor"

Percorra os elementos em ordem de índice (garante `j < i`). Para o elemento `i` com valor `v`:
1. `melhor = query(faixa de valores permitida)` — só contém elementos anteriores.
2. `dp[i] = melhor + ganho(i)`.
3. `update(v, dp[i])` (com `max` se o mesmo valor pode repetir).

Variação de faixa:

- Flowers: alturas `< h[i]` → `[0, h-1]`; ganho = beleza.
- Smooth: valores em `[x-D, x+D]`; ganho 1.
- LIS estrita: `< x` → `[0, p-1]`. LIS não estrita: `[0, p]`.
- Pillars: `|h_i - h_j| ≥ d` → duas faixas `[0, h-d]` e `[h+d, ∞)`; guarde `(dp, índice)` para reconstruir.

## Deque monotônica (mínimo numa janela)

Mantém índices com `dp` crescente. Para cada `j`: tira da frente quem saiu da janela; `dp[j] = dp[frente] + custo`; tira de trás quem tem `dp ≥ dp[j]` (nunca mais será mínimo); empurra `j`. Cada índice entra e sai uma vez.

## Contraexemplos (quando NÃO precisa de segtree)

- **Candies**: soma de janela de estados *da camada anterior* — prefixo basta. O(n·k).
- **Rudolf**: mínimo de janela deslizante — deque basta. O(n·m).

## Intervals (DP W) em detalhe

`t[j]` = melhor pontuação com o último `'1'` em `j` (`j = 0`: nenhum). Em `i`: `t[i] = max(t[0..i-1])`; para cada intervalo `[l, i]` que acaba em `i`, todo `t[j]` com `j ∈ [l, i]` ganha `a` (o último 1 cai dentro do intervalo). Range add + max → lazy. O(**(n + m) log n**).

## Outras otimizações clássicas (para ir além)

- Convex Hull Trick / Li Chao: `dp[i] = min(m_j·x_i + b_j)`.
- Divisão e conquista: ótimo monotônico `opt[i] ≤ opt[i+1]`.
- Knuth: DP de intervalos com `opt[i][j-1] ≤ opt[i][j] ≤ opt[i+1][j]`.
- Exponenciação de matriz: transição linear com N enorme (sapo com N = 10¹⁸ e K pequeno).
- Bitset: DP de subset-sum booleano / LCS em O(n²/64).
