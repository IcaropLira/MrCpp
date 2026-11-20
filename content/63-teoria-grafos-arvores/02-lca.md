---
title: LCA e binary lifting — teoria
summary: Definição, propriedades, solução trivial O(N), tabela p[u][k], recorrência, "meta-busca binária", fórmulas de distância e k-ésimo vértice.
status: done
complexity: O(N log N) pré · O(log N) por consulta
tags: lca, binary lifting, ancestral, sparse table, teoria
---

## Definição

`LCA(A, B)` = o nó **mais profundo** que tem A e B como descendentes (numa árvore enraizada).

## Propriedades

- `LCA(B, B) = B`.
- Se `U` é ancestral de `V`, então `LCA(U, V) = U`.
- `LCA(u, v) = LCA(v, u)`; `LCA(u, LCA(v, w)) = LCA(u, v, w)`.

## Solução trivial

Marque todos os ancestrais de `u`; suba de `v` até achar um marcado. O(N) por consulta → O(X·N) para X consultas; com N = X = 10⁵, **10¹⁰**: não passa.

## Binary lifting

Tabela **`p[u][k]`** = vértice onde paramos ao dar um salto de tamanho `2ᵏ` para cima a partir de `u`.
Ex. da aula: `p[9][0] = 4`, `p[9][1] = 6`, `p[9][2] = 1`.

### Recorrência (é uma DP)

Se `x` é o ancestral `2ᵏ` de `v` e `u` é o ancestral `2ᵏ` de `x`, então `u` é o ancestral `2^(k+1)` de `v`:

```
p[u][0] = pai(u)
p[u][k] = p[ p[u][k-1] ][k-1]          (k > 0)
```

Pré-processamento `O(N log N)` de tempo e memória.

### Por que alcança qualquer ancestral

Todo nível é soma de potências de 2 **distintas** (o binário de `k`). Percorrer as potências em ordem **decrescente** é o que garante isso ("meta-busca binária").

### Algoritmo LCA(u, v)

1. **Igualar níveis**: suba o mais profundo `dep[u] - dep[v]` níveis (bits da diferença).
2. Se ficaram iguais → esse é o LCA (um era ancestral do outro).
3. Para `k` de `log` até 0: se `p[u][k] ≠ p[v][k]`, suba os dois (`u = p[u][k]`, `v = p[v][k]`). Se forem iguais, **não suba** (poderia passar do LCA: "subir demais").
4. Resposta: `p[u][0]`.

Custo: `O(2 log N)` por consulta ⇒ total `O(N log N + Q log N)`.

## Fórmulas

- Distância (arestas): `dep[a] + dep[b] - 2·dep[LCA]` (o trecho raiz→LCA entra duas vezes na soma).
- Distância com pesos: `dist[a] + dist[b] - 2·dist[LCA]` (`dist` = soma dos pesos até a raiz).
- **k-ésimo vértice do caminho a→b** (1-indexado): seja `s = dep[a] - dep[L]`, `total = s + dep[b] - dep[L] + 1`. Se `k ≤ s + 1`: `subir(a, k-1)`; senão `subir(b, total - k)`.
- **Contar caminhos por vértice** (diferença em árvore): `+1` em `a` e `b`, `-1` no `L`, `-1` no `pai(L)`; resposta de `v` = soma da subárvore de `v`.
  Para contagem por **aresta**: `+1` em `a` e `b`, `-2` em `L`.
- **Mínimo/máximo de aresta no caminho**: tabela junto com o salto:
  `m[u][0] = peso(u, pai(u))`, `m[u][k] = min(m[u][k-1], m[ p[u][k-1] ][k-1])`.

## Detalhes de implementação

- `LOG` com `2^LOG > n` (n ≤ 2·10⁵ → 18; n ≤ 10⁴ → 14).
- Sentinela: pai da raiz = 0 (e `p[0][k] = 0`) → "passou da raiz" vira 0 (Company Queries I imprime −1); ou pai da raiz = ela mesma.
- Preencha `j` por fora e `v` por dentro (ou em ordem BFS) para que `p[pai][j-1]` já esteja pronto.

## Alternativas

| Método | Pré | Consulta |
|---|---|---|
| Binary lifting | O(n log n) | O(log n) |
| Euler tour + sparse table (RMQ) | O(n log n) | O(1) |
| HLD | O(n) | O(log n) |
| Tarjan offline (DSU) | — | O(α) amortizado, offline |

## Lista de exercícios da aula

SPOJ LCA (super easy) · HackerEarth Lowest Common Ancestor (easy) · HackerRank BST LCA (easy) · TOJ 2241 (easy) · Timus 1471 (easy) · CSES 1687, 1688, 1135, 1136 · SPOJ QTREE2.
