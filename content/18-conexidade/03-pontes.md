---
title: Pontes
summary: Pontes de um grafo não dirigido.
status: done
complexity: O(V + E)
tags: grafos, low-link
---

## Ideia

`low[u]` é o menor tempo de entrada alcançável por `u`. A aresta pai–filho é ponte se `low[filho] > tin[pai]`.

## Código

```cpp
vector<pair<int, int>> bridges;
vector<int> tin, low; int timer;
void dfs(int u, int p, const vector<vector<int>>& g) {
    tin[u] = low[u] = timer++;
    for (int v : g[u]) {
        if (v == p) continue;
        if (tin[v] >= 0) low[u] = min(low[u], tin[v]);
        else {
            dfs(v, u, g);
            low[u] = min(low[u], low[v]);
            if (low[v] > tin[u]) bridges.push_back({u, v});
        }
    }
}
```

## Uso

Antes de chamar: `tin.assign(n, -1); low.assign(n, 0); timer = 0;`. Não trata arestas paralelas.
