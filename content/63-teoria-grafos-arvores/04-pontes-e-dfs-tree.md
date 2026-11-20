---
title: Pontes e DFS tree — teoria
summary: Definição de ponte, DFS tree, back edges, tin/low, condição low[v] > tin[pai] e aplicações.
status: done
complexity: O(n + m)
tags: pontes, bridges, dfs tree, back edge, low, articulação, teoria
---

## Definição

**Ponte** = aresta que, removida, deixa o grafo **desconectado** (aumenta o nº de componentes). No problema da aula: estrada "necessária".

## Solução ingênua

Remover cada aresta e testar conectividade com DFS: `M` arestas × `O(N + M)` = **O(M·(N + M))**. Lento.

## DFS tree

A **DFS tree** é formada pelas arestas que a DFS usa para descobrir vértices novos. As demais arestas (num grafo **não dirigido**) são **back edges**: sempre ligam um vértice a um **ancestral** (nunca há "cross edges" em DFS não dirigida).

## Por que back edges importam

Se uma back edge **passa por cima** da aresta `(v, u)` da árvore, `(v, u)` **não é ponte**: mesmo removendo-a, dá para descer e usar a back edge para voltar a um vértice mais acima.

> **Ponte = aresta da DFS tree que nenhuma back edge cobre.**

## tin e low

- `tin[v]` = tempo de entrada de `v` na DFS.
- `low[v]` = menor `tin` alcançável a partir da subárvore de `v` usando **no máximo uma back edge** ("back edge que aponta mais para cima").

Cálculo:
- Ao entrar: `low[v] = tin[v]`.
- Back edge `v → to` (to já visitado, não é a aresta do pai): `low[v] = min(low[v], tin[to])`.
- Filho `to` da árvore: depois de visitá-lo, `low[v] = min(low[v], low[to])` (usa o low dos filhos para melhorar o do pai).

## Condição

A aresta da árvore `(p, v)` é ponte ⇔ **`low[v] > tin[p]`** (nada abaixo de `v` sobe até `p` ou acima). Equivalente a `low[v] == tin[v]`.

Exemplo (Necessary Roads, arestas 1-2, 2-3, 1-3, 3-4): back edge 3→1 cobre (1,2) e (2,3); `low[3] = 1`, `low[2] = 1`, `low[4] = 4`; `(3,4)`: `4 > 3` → ponte.

## Pontos de articulação (bônus)

Vértice `p` (não raiz) é articulação se existe filho `v` com **`low[v] ≥ tin[p]`**; a raiz é articulação se tem ≥ 2 filhos na DFS tree.

## Pegadinhas

- **Arestas paralelas**: pular "o vértice pai" (`to == pr`) ignora também a cópia paralela e transforma em ponte uma aresta que não é. Pule pela **id da aresta**.
- **Recursão**: caminho com 10⁵ vértices → pilha explícita (ver código da aula).
- **Grafo desconexo**: rode a DFS de todo vértice não visitado.
- Grafo **dirigido**: o conceito análogo é SCC (Tarjan/Kosaraju), não pontes.

## Aplicações

- Estradas necessárias (listar pontes).
- **Non-academic Problem**: remover exatamente uma aresta minimizando pares ainda ligados. Só ponte separa; o lado que se solta é a subárvore de `v` na DFS tree (`sz[v]`). Resposta `min C(s,2) + C(n-s,2)`; sem ponte, `C(n,2)`.
- **Bridge tree**: contraia componentes 2-aresta-conexas → árvore cujas arestas são as pontes.
- 2-aresta-conexidade, orientação de arestas para virar fortemente conexo (possível ⇔ sem pontes).
