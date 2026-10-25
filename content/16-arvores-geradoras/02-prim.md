---
title: Prim
summary: Árvore geradora mínima por vértices.
status: done
complexity: O(E log V)
tags: agm
---

## Ideia

Cresce a árvore a partir do vértice 0, sempre pela aresta mais barata que sai dela.

## Código

```cpp
ll prim(const vector<vector<pair<int, ll>>>& g) { // grafo conexo
    vector<bool> in(g.size()); ll total = 0;
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    pq.push({0, 0});
    while (!pq.empty()) {
        auto [w, u] = pq.top(); pq.pop();
        if (in[u]) continue;
        in[u] = true, total += w;
        for (auto [v, c] : g[u]) if (!in[v]) pq.push({c, v});
    }
    return total;
}
```
