---
title: Limites, complexidade e memória
summary: Qual complexidade passa para cada n, quantas operações por segundo, tamanhos de tipos e memória.
status: done
complexity: ~10⁸ operações simples por segundo
tags: complexidade, limites, memória, tle, mle, teoria
---

## Tabela: n → complexidade que passa (≈ 1 s)

| n | Complexidade aceitável | Técnicas típicas |
|---|---|---|
| ≤ 10–11 | O(n!) | permutações, backtracking |
| ≤ 20–25 | O(2ⁿ · n) | bitmask, subconjuntos |
| ≤ 40 | O(2^(n/2)) | meet in the middle |
| ≤ 100–500 | O(n³) | Floyd, DP de intervalos |
| ≤ 2 000–5 000 | O(n²) | DP quadrática, todos os pares |
| ≤ 10⁵–10⁶ | O(n log n) / O(n log² n) | ordenação, segtree, BIT, LCA, small to large |
| ≤ 10⁷–10⁸ | O(n) | dois ponteiros, prefixos, crivo linear |
| ≥ 10⁹ | O(√n), O(log n), O(1) | fórmula, busca binária, exponenciação, matriz |

- Regra prática: **~10⁸ operações simples por segundo** em C++. 10¹⁰ (ex.: `O(n · q)` com `n = q = 10⁵`) **não passa**.
- `log₂(10⁵) ≈ 17`, `log₂(2·10⁵) ≈ 18`, `log₂(10⁶) ≈ 20`, `log₂(10⁹) ≈ 30`, `log₂(10¹⁸) ≈ 60`.
- Segtree recursiva tem constante alta (visita até ~4·log n nós por query); BIT é ~3–5× mais rápida.

## Tipos e overflow

| Tipo | Bytes | Limite aproximado |
|---|---|---|
| `int` | 4 | ±2,1·10⁹ (2³¹ − 1) |
| `long long` | 8 | ±9,2·10¹⁸ (2⁶³ − 1) |
| `unsigned long long` | 8 | 1,8·10¹⁹ |
| `__int128` | 16 | ±1,7·10³⁸ (não tem `cin/cout`) |
| `double` | 8 | ~15 dígitos significativos |
| `long double` | 16 (x86) | ~18 dígitos |

- Produto de dois valores até 10⁹ → até 10¹⁸: **`long long`**. Soma de 10⁵ valores até 10⁹ → 10¹⁴: `long long`.
- Produto modular `a * b % MOD` com `MOD ≈ 10⁹`: `a, b < MOD` em `long long` cabe (10¹⁸). Com `MOD ≈ 10¹⁸`: `__int128`.
- Geometria com `|coord| ≤ 10⁹`: `cross` chega a ~2·10¹⁸ → ainda cabe em `long long`, mas **não** some vários cross sem cuidado (área de polígono com muitos vértices pode estourar só em casos extremos).

## Memória

- 256 MB ≈ 6,4·10⁷ `int` ≈ 3,2·10⁷ `long long`.
- `int a[N][LOG]` com `N = 2·10⁵`, `LOG = 18` → 3,6·10⁶ ints ≈ 14 MB (ok).
- Trie com `array<int,26>` por nó: 104 bytes/nó → 10⁶ nós ≈ 104 MB. Use nós ≤ (soma dos tamanhos + 1), **não** um `N` gigante fixo.
- Segtree: `4n` posições. Lazy: mais `4n`.
- Pilha de recursão: DFS recursiva com profundidade 10⁵–10⁶ pode estourar (Codeforces tem pilha grande; muitos juízes não, ex. alguns setups de SPOJ/URI). Árvore em linha é o caso de teste clássico → **DFS iterativa ou BFS em ordem** (ver as aulas de Euler Tour e Pontes).

## Como estimar

1. Leia os limites **antes** de pensar no algoritmo: eles dizem a complexidade-alvo.
2. Conte o laço mais interno × número de vezes que ele roda.
3. Soma em multitestes: se o enunciado garante `Σn ≤ 2·10⁵`, trabalho proporcional a `n` por teste está ok; **não** zere vetores de tamanho fixo `MAXN` a cada teste (isso é `T · MAXN`).
