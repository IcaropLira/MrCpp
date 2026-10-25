---
title: BFS
summary: Busca em largura e distâncias em grafos sem peso.
status: done
complexity: O(V + E)
tags: grafos, bfs, distância
---

## Ideia

Visita os vértices em ordem de distância à origem. O primeiro momento em que um vértice é alcançado já é o caminho mais curto.

## Código

```cpp
vector<int> bfs(const vector<vector<int>>& g, int s) {
    vector<int> d(g.size(), -1);
    queue<int> q; q.push(s); d[s] = 0;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u]) if (d[v] < 0) d[v] = d[u] + 1, q.push(v);
    }
    return d;
}
```

## Uso

`d[v] == -1` significa que `v` não é alcançável.
