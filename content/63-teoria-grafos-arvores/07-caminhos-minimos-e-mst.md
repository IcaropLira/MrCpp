---
title: Caminhos mínimos e árvores geradoras — teoria
summary: Qual algoritmo usar (BFS, 0-1 BFS, Dijkstra, Bellman-Ford, Floyd, Johnson), ciclos negativos, potenciais, propriedades de MST, DSU e variações.
status: done
complexity: Dijkstra O((V + E) log V)
tags: dijkstra, bellman-ford, floyd, bfs, mst, kruskal, prim, dsu, teoria
---

## Qual algoritmo?

| Grafo | Algoritmo | Complexidade |
|---|---|---|
| sem peso | BFS | O(V + E) |
| pesos 0/1 | 0-1 BFS (deque: peso 0 na frente, 1 atrás) | O(V + E) |
| pesos ≥ 0 | **Dijkstra** com heap | O((V + E) log V) |
| denso, pesos ≥ 0 | Dijkstra O(V²) sem heap | O(V²) |
| pesos negativos | Bellman–Ford (ou SPFA, pior caso igual) | O(V E) |
| DAG (qualquer peso) | relaxar em ordem topológica | O(V + E) |
| todos os pares, V ≤ 500 | Floyd–Warshall | O(V³) |
| todos os pares, esparso, peso negativo | Johnson (Bellman-Ford + V Dijkstras com potenciais) | O(V E log V) |
| pesos pequenos inteiros (≤ C) | Dial (baldes) | O(V C + E) |

## Dijkstra

- Correto só com pesos **não negativos**. Ignore entradas velhas (`if (d > dist[v]) continue`).
- Multifonte: coloque todas as fontes com distância 0.
- Caminho: guarde `pai[v]` ao relaxar.
- Arestas que estão em algum caminho mínimo: `dist_s[u] + w + dist_t[v] == dist_s[t]` (rode Dijkstra de s e de t no grafo reverso).
- Contar caminhos mínimos: DAG das arestas ótimas (ver Ordenação Topológica).
- Variações por estado (grafo de camadas): ver Vértices Auxiliares.

## Bellman–Ford e ciclos negativos

- `V - 1` rodadas relaxando todas as arestas. Se a rodada `V` ainda relaxa algo → **ciclo negativo alcançável**.
- Para achar o ciclo: pegue um vértice relaxado na rodada V, ande `V` vezes por `pai` (cai dentro do ciclo), depois percorra até voltar.
- Vértices afetados por ciclo negativo (distância −∞): os alcançáveis a partir dos relaxados na rodada V.
- **Sistemas de restrições de diferença** `x_v - x_u ≤ w`: aresta `u → v` com peso `w`; viável ⇔ sem ciclo negativo; solução = distâncias a partir de uma fonte virtual ligada a todos com 0.

## Floyd–Warshall

`for k for i for j: d[i][j] = min(d[i][j], d[i][k] + d[k][j])` (**k por fora!**). Ciclo negativo ⇔ `d[i][i] < 0`. Fecho transitivo: mesma ideia com `or`/bitset (O(V³/64)). Minimax: `max` no lugar de `+`.

## Potenciais (Johnson / MCMF)

`w'(u, v) = w(u, v) + h(u) - h(v)` ≥ 0 se `h` = distâncias de Bellman-Ford. Caminhos mínimos se preservam: `dist(u, v) = dist'(u, v) - h(u) + h(v)`.

## Árvore geradora mínima (MST)

- **Propriedade do corte**: a aresta mais leve que cruza qualquer corte pertence a alguma MST.
- **Propriedade do ciclo**: a aresta mais pesada de um ciclo (se única) não está em nenhuma MST.
- **Kruskal**: ordena arestas, adiciona se une componentes (DSU). O(E log E).
- **Prim**: heap a partir de um vértice. O(E log V); O(V²) denso.
- **Borůvka**: cada componente pega sua aresta mais leve; O(E log V); bom para grafos implícitos (ex.: MST com peso xor).
- Todas as MSTs têm o mesmo multiconjunto de pesos. MST única ⇔ nenhuma aresta fora da árvore empata com a maior do caminho.
- **Caminho minimax** (minimizar a maior aresta) entre u e v: está na MST.
- 2ª melhor MST: trocar uma aresta (ver Complementos de grafos).
- MST de Manhattan: O(n log n) com 4 varreduras (só 8 vizinhos candidatos por ponto).
- Arborescência mínima (dirigida): Chu–Liu/Edmonds.

## DSU (union-find)

Com **união por tamanho + compressão de caminho**: O(α(n)) ≈ constante. Só união por tamanho (sem compressão): O(log n) e permite **rollback** (desfazer) — usado em conectividade offline/divisão e conquista no tempo. DSU com paridade (bipartição dinâmica) e com pesos ("diferença até o representante").
