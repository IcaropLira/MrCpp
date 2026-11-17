---
title: Hopcroft-Karp
summary: Emparelhamento bipartido máximo em O(E · sqrt(V)): vários caminhos de aumento por fase.
status: done
complexity: O(E √V)
tags: emparelhamento, bipartido, hopcroft-karp
---

## Ideia

Em cada fase, uma BFS calcula a distância (em camadas) de cada vértice livre da esquerda e uma DFS acha um conjunto *máximo* de caminhos de aumento disjuntos e de menor comprimento. São no máximo `O(√V)` fases, e cada uma custa `O(E)`.

## Código

```cpp
struct HopcroftKarp {
    int nl, nr;
    vector<vector<int>> adj;
    vector<int> ml, mr, dist, it;
    HopcroftKarp(int nl, int nr) : nl(nl), nr(nr), adj(nl), ml(nl, -1), mr(nr, -1) {}

    void add(int u, int v) { adj[u].push_back(v); }
    bool bfs() {
        dist.assign(nl, -1);
        queue<int> q;
        for (int u = 0; u < nl; u++) if (ml[u] < 0) dist[u] = 0, q.push(u);
        bool achou = false;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : adj[u]) {
                int w = mr[v];
                if (w < 0) achou = true;
                else if (dist[w] < 0) dist[w] = dist[u] + 1, q.push(w);
            }
        }
        return achou;
    }
    bool dfs(int u) {
        for (int& i = it[u]; i < (int)adj[u].size(); i++) {
            int v = adj[u][i], w = mr[v];
            if (w < 0 || (dist[w] == dist[u] + 1 && dfs(w))) { ml[u] = v; mr[v] = u; return true; }
        }
        dist[u] = -1;
        return false;
    }
    int resolve() {
        int res = 0;
        while (bfs()) {
            it.assign(nl, 0);
            for (int u = 0; u < nl; u++) if (ml[u] < 0 && dfs(u)) res++;
        }
        return res;
    }
};
```

## Complexidade e cuidados

- O ponteiro `it[u]` garante que cada aresta é testada uma vez por fase.
- Resultado idêntico ao de Kuhn (mesmo tamanho; o emparelhamento em si pode diferir).
- A DFS é recursiva com profundidade até `√V` em média, mas pode chegar a `nl` no pior caso.
- Para grafos densos pequenos Kuhn costuma ser suficiente e mais simples.
