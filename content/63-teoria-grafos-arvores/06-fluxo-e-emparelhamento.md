---
title: Fluxo e emparelhamento — teoria
summary: Max-flow min-cut, complexidades, catálogo de modelagens, König, Hall, Dilworth, Menger, limites inferiores, custo mínimo, Gomory-Hu e fatos de matching.
status: done
complexity: Dinic O(V²E); unitário O(E√V)
tags: fluxo, corte mínimo, matching, könig, hall, dilworth, menger, mcmf, teoria
---

## Teorema central

**Fluxo máximo = corte mínimo** (soma das capacidades das arestas que saem do lado de `s` no melhor corte `S | T`). Depois de rodar o fluxo, o lado `S` = vértices **alcançáveis de `s` no grafo residual**; as arestas do corte são as saturadas de `S` para `T`.

## Algoritmos e complexidades

| Algoritmo | Complexidade | Quando |
|---|---|---|
| Ford–Fulkerson (DFS) | O(E · F) | F (fluxo) pequeno |
| Edmonds–Karp (BFS) | O(V E²) | didático |
| **Dinic** | O(V² E); **O(E √V)** com capacidades unitárias/bipartido | padrão de contest |
| Dinic com scaling | O(V E log C) | capacidades enormes |
| Push–relabel (FIFO/HLPP) | O(V³) / O(V² √E) | grafos densos |
| Kuhn (matching) | O(V E) | bipartido pequeno, fácil |
| Hopcroft–Karp | O(E √V) | bipartido grande |
| Hungarian | O(n³) | atribuição de custo mínimo (matriz n×n) |
| MCMF (SPFA/Dijkstra com potenciais) | O(F · E log V) | custo mínimo |
| Blossom (Edmonds) | O(V³) | matching em grafo **geral** |

Na prática Dinic é bem mais rápido que o pior caso.

## Modelagens clássicas

| Problema | Rede |
|---|---|
| Emparelhamento bipartido | s → esquerda (cap 1), esquerda → direita (cap 1), direita → t (cap 1) |
| Cada pessoa pega até k tarefas | s → pessoa com cap k |
| **Capacidade em vértice** | dividir `v_in → v_out` com cap (igual ao truque da aula de vértices auxiliares) |
| Caminhos aresta-disjuntos s→t | cap 1 em cada aresta; resposta = fluxo |
| Caminhos vértice-disjuntos | cap 1 em `v_in → v_out` |
| Aresta não dirigida (u, v, c) | `add(u, v, c, c)` (duas direções com cap c) |
| Várias fontes/sumidouros | super-fonte e super-sumidouro |
| **Projeto de seleção** (escolher itens com lucro, dependências "se pegar A tem que pegar B") | s → item lucro positivo (cap lucro), item → t custo (cap custo), A → B (cap ∞). Resposta = Σ lucros positivos − corte mínimo |
| Fechamento de peso máximo | mesmo que projeto de seleção |
| Separar em dois grupos com custos de "ficar em lados diferentes" | corte mínimo |
| Cobertura de vértices bipartida | König: = matching |
| Cobertura de DAG por caminhos | n − matching (ver complementos) |
| Atribuição com custo | MCMF ou Hungarian |
| Limites inferiores `l ≤ f ≤ c` | cap `c - l`, demanda: `excesso[v] += l` em v, `-= l` em u; super s→v (excesso>0), v→super t; aresta t→s ∞; viável ⇔ satura tudo |

## Teoremas de emparelhamento e cobertura

- **König** (bipartido): cobertura mínima de vértices = emparelhamento máximo.
- **Gallai**: em qualquer grafo, conj. independente máximo + cobertura mínima de vértices = V. Sem vértices isolados: emparelhamento máximo + cobertura mínima por arestas = V.
- Bipartido: **independente máximo = V − matching**.
- **Hall**: a esquerda inteira pode ser emparelhada ⇔ para todo subconjunto `S` da esquerda, `|N(S)| ≥ |S|`. Deficiência: matching = `|L| - max_S(|S| - |N(S)|)`.
- Bipartido `k`-regular sempre tem emparelhamento perfeito (e se decompõe em `k` emparelhamentos).
- **Dilworth**: menor nº de cadeias que cobrem uma ordem parcial = maior anticadeia = `n -` matching no fecho transitivo.
- **Menger**: nº máximo de caminhos aresta-disjuntos (vértice-disjuntos) entre s e t = menor corte de arestas (vértices) que separa s de t.
- **Tutte–Berge** (geral): matching máximo = `min_U (|V| + |U| - odd(G - U)) / 2`.

## Fluxo de custo mínimo

- Encontrar caminho aumentante de **menor custo** repetidamente (Bellman-Ford/SPFA; ou Dijkstra com **potenciais** `c'(u,v) = c + π(u) - π(v)`, π = distâncias da rodada anterior).
- Aresta reversa tem custo `-c`. Custos negativos iniciais: inicialize π com Bellman-Ford.
- Fluxo máximo de custo máximo: negue os custos.
- Fixar o valor do fluxo K: pare quando atingir K (limite o último aumento).

## Cortes globais

- **Stoer–Wagner**: corte mínimo global (sem s,t fixos) em O(V³) ou O(VE + V² log V).
- **Gomory–Hu**: n−1 fluxos dão o corte mínimo entre todos os pares (menor aresta no caminho da árvore).
- Karger (aleatório): contração de arestas.

## Pegadinhas

- `long long` nas capacidades; `INF` grande o suficiente mas sem estourar ao somar.
- Dinic: lembre de zerar o ponteiro `it[]` a cada BFS.
- Reconstruir o matching: arestas esquerda→direita com cap 0 (saturadas).
- Grafo não dirigido em fluxo: **uma** aresta com cap nos dois sentidos (não duas arestas separadas com reversas de cap 0 — funciona, mas dobra arestas).
