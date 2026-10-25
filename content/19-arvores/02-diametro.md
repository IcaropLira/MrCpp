---
title: Diâmetro da árvore
summary: Diâmetro de uma árvore.
status: done
complexity: O(n)
tags: árvores, bfs
---

## Ideia

A folha mais distante de qualquer vértice é uma ponta do diâmetro. Duas buscas resolvem.

## Código

```cpp
pair<int, int> far(const vector<vector<int>>& g, int s) { // {vértice mais distante, distância}
    vector<int> d(g.size(), -1); queue<int> q; q.push(s); d[s] = 0; int last = s;
    while (!q.empty()) {
        int u = q.front(); q.pop(); last = u;
        for (int v : g[u]) if (d[v] < 0) d[v] = d[u] + 1, q.push(v);
    }
    return {last, d[last]};
}
int diameter(const vector<vector<int>>& g) { return far(g, far(g, 0).first).second; }
```
