---
title: Kruskal
summary: Árvore geradora mínima por arestas.
status: done
complexity: O(E log E)
tags: agm, dsu
---

## Ideia

Ordena as arestas e aceita as que ligam componentes diferentes. Usa o `DSU` do tópico de Union-Find.

## Código

```cpp
ll kruskal(int n, vector<array<ll, 3>> e) { // {w, u, v}
    sort(e.begin(), e.end());
    DSU dsu(n); ll total = 0;
    for (auto [w, u, v] : e) if (dsu.unite(u, v)) total += w;
    return total;
}
```
