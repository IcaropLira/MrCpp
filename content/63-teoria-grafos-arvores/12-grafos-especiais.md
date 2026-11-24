---
title: Grafos especiais e suas propriedades
summary: Árvore, floresta, DAG, bipartido, completo, grafo funcional, cacto, torneio, grafo de intervalos, cordal, grade, planar e expansões — o que cada um permite resolver rápido.
status: done
complexity: —
tags: grafos especiais, dag, bipartido, funcional, cacto, torneio, intervalos, teoria
---

| Classe | Como reconhecer | O que fica fácil |
|---|---|---|
| **Árvore** | conexo com n − 1 arestas | DP, LCA, caminhos únicos, centróide, HLD |
| Floresta | acíclico | DSU, DP por componente |
| **DAG** | dirigido sem ciclo (Kahn processa todos) | caminho mais longo/curto, contagem de caminhos, DP |
| **Bipartido** | 2-colorível / sem ciclo ímpar | matching (König), cobertura = matching, independente = n − matching |
| Completo `Kₙ` | `n(n-1)/2` arestas | Cayley `nⁿ⁻²` árvores geradoras; MST = Prim O(n²) |
| **Funcional** (out-grau 1) | `nxt[v]` | cada componente: um ciclo + árvores; binary lifting de sucessores; detecção de ciclo O(1) memória |
| Permutação | funcional e bijetora | só ciclos disjuntos; ordem = mmc dos tamanhos |
| **Unicíclico** | conexo com n arestas | ache o ciclo e trate as árvores penduradas |
| **Cacto** | cada aresta em ≤ 1 ciclo | DP como em árvore tratando cada ciclo como bloco |
| **Torneio** | todo par com exatamente uma seta | sempre tem caminho hamiltoniano; fortemente conexo ⇔ tem ciclo hamiltoniano; SCCs ordenadas linearmente |
| Grafo de **intervalos** | vértices = intervalos, aresta se cruzam | coloração = máximo de sobreposição (varredura); independente máximo = guloso por fim |
| Cordal | toda volta ≥ 4 tem corda | ordem de eliminação perfeita (LexBFS); clique/coloração polinomiais |
| **Grade** | vértices (i, j) | bipartida, BFS, DP em perfil |
| **Planar** | `E ≤ 3V - 6` | 4-colorível, dual, grau médio < 6 |
| Euleriano | graus pares (ou in = out) | Hierholzer O(E) |
| Regular (grau k) | todos com grau k | bipartido k-regular tem matching perfeito |
| Grafo de divisibilidade / múltiplos | aresta a → ka | n log n arestas (harmônica); DAG |
| Grafo de números com `a & b`/`a | b` | máscaras | SOS DP, vértices virtuais por bit |

## Dicas

- Grafo dirigido? Condense SCCs → DAG antes de pensar em DP.
- Grafo com m = n − 1 + poucas arestas extras (k ≤ 20): árvore geradora + 2k vértices especiais (virtual tree / Dijkstra a partir deles).
- Grafo denso pequeno (n ≤ 20): bitmask. n ≤ 40: meet in the middle (clique máxima).
- Grafo enorme mas implícito: não materialize; gere vizinhos.
