---
title: Algoritmo de Kosaraju
summary: Componentes fortemente conexos.
status: done
complexity: O(V + E)
tags: scc, grafos dirigidos
---

## Ideia

DFS no grafo, DFS no reverso na ordem inversa de saída. Cada árvore da segunda DFS é um componente.

## Código

```cpp
vector<int> kosaraju(const vector<vector<int>>& g, const vector<vector<int>>& gr) {
    int n = g.size(), c = 0;
    vector<int> order, comp(n, -1); vector<bool> vis(n);
    function<void(int)> d1 = [&](int u) { vis[u] = true; for (int v : g[u]) if (!vis[v]) d1(v); order.push_back(u); };
    function<void(int)> d2 = [&](int u) { comp[u] = c; for (int v : gr[u]) if (comp[v] < 0) d2(v); };
    for (int i = 0; i < n; i++) if (!vis[i]) d1(i);
    for (int i = n - 1; i >= 0; i--) if (comp[order[i]] < 0) d2(order[i]), c++;
    return comp; // comp[u]: id do componente, em ordem topológica
}
```
