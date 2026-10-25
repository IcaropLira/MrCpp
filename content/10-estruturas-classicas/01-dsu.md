---
title: Union-Find (DSU)
summary: Union-Find e árvore geradora mínima (Kruskal).
status: done
complexity: O(α(n))
tags: dsu, kruskal, mst
---

## Ideia

Cada conjunto é uma árvore com um representante. A compressão de caminho e a união por tamanho deixam as operações quase constantes. Kruskal ordena as arestas e junta as que ligam componentes diferentes.

## Código

```cpp
struct DSU {
    vector<int> p, sz;
    DSU(int n) : p(n), sz(n, 1) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    bool unite(int a, int b) {
        a = find(a), b = find(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) swap(a, b);
        p[b] = a, sz[a] += sz[b];
        return true;
    }
};

ll kruskal(int n, vector<array<ll, 3>> e) { // {w, u, v}
    sort(e.begin(), e.end());
    DSU dsu(n); ll total = 0;
    for (auto [w, u, v] : e) if (dsu.unite(u, v)) total += w;
    return total;
}
```

## Uso

`dsu.unite(a, b)` devolve `false` se já estavam juntos.
