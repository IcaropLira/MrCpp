---
title: Técnicas em árvores — visão geral
summary: Quando usar Euler tour, binary lifting, HLD, centroid decomposition, small to large/sack, virtual tree, rerooting e Mo em árvores.
status: done
complexity: veja a tabela
tags: hld, centroid, virtual tree, árvores, técnicas, teoria
---

## Tabela de decisão

| Pergunta | Técnica | Custo |
|---|---|---|
| agregado/atualização em **subárvore** | Euler tour + BIT/segtree | O(log n) |
| k-ésimo ancestral, LCA, agregado em caminho **estático** | binary lifting | O(log n) |
| LCA em O(1) | Euler tour 2n−1 + sparse table | O(1) consulta |
| atualização + consulta em **caminho** u–v | **HLD** (caminhos pesados + segtree) | O(log² n) |
| contar/otimizar sobre **todos os pares/caminhos** (dist = k, dist ≤ k, caminho de soma x) | **centroid decomposition** | O(n log n) a O(n log² n) |
| "mais próximo vértice marcado" com atualizações | centroid (ancestrais no centroide) | O(log n) por op |
| frequências/conjuntos da subárvore para todo v | small to large / sack (DSU on tree) | O(n log n) |
| consultas envolvendo só k vértices especiais | **virtual tree** (k log k vértices) | O(k log n) |
| resposta para todas as raízes | rerooting | O(n) |
| consultas de caminho offline com "distintos no caminho" | Mo em árvore (Euler 2n) | O(n √n) |
| floresta dinâmica (link/cut) | link-cut tree / Euler tour tree | O(log n) amortizado |

## HLD em uma linha

Cada vértice tem um filho **pesado** (maior subárvore). Qualquer caminho raiz→v cruza ≤ log n arestas leves ⇒ o caminho u–v são O(log n) segmentos contíguos se numerarmos com DFS visitando o filho pesado primeiro (a subárvore continua contígua: Euler tour de graça).

## Centroid em uma linha

Ache o centroide c, resolva os caminhos que **passam por c**, remova c e recurse nas componentes (cada uma ≤ metade). Cada vértice está em O(log n) níveis.

## Virtual tree em uma linha

Ordene os k vértices por `tin`, adicione os LCAs de vizinhos consecutivos (no máximo k − 1 novos), ligue cada um ao ancestral mais próximo com uma pilha. DP na árvore pequena.

## Lembretes

- Árvore em linha / estrela são os piores casos de recursão e de algoritmos quadráticos — teste com elas.
- Vários problemas "de grafo" ficam fáceis depois de transformar em árvore: DFS tree, bridge tree, block-cut tree, MST, árvore de Gomory-Hu, árvore de dominadores.
