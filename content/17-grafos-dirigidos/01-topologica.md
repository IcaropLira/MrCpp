---
title: Ordenação topológica
summary: Ordenação topológica (Kahn).
status: done
complexity: O(V + E)
tags: dag, ordem
---

## Ideia

Remove repetidamente vértices sem arestas de entrada. Se sobrar vértice, há ciclo.

## Código

```cpp
vector<int> topo(const vector<vector<int>>& g) { // vazio se há ciclo
    int n = g.size(); vector<int> deg(n), order;
    for (auto& adj : g) for (int v : adj) deg[v]++;
    queue<int> q;
    for (int i = 0; i < n; i++) if (!deg[i]) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : g[u]) if (!--deg[v]) q.push(v);
    }
    return (int)order.size() == n ? order : vector<int>();
}
```
