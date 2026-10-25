---
title: Bellman-Ford
summary: Caminhos mínimos com pesos negativos.
status: done
complexity: O(V · E)
tags: grafos, caminho mínimo
---

## Ideia

Relaxa todas as arestas `V` vezes. Se ainda melhora na última, há ciclo negativo.

## Código

```cpp
bool bellman(int n, int s, const vector<array<ll, 3>>& e, vector<ll>& d) { // e: {u, v, w}
    d.assign(n, 1e18); d[s] = 0;
    for (int i = 0; i < n; i++) {
        bool changed = false;
        for (auto [u, v, w] : e) if (d[u] < 1e18 && d[u] + w < d[v]) d[v] = d[u] + w, changed = true;
        if (!changed) return true;
    }
    return false; // ciclo negativo alcançável
}
```
