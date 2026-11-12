---
title: Union-Find (DSU)
summary: Union-Find e árvore geradora mínima (Kruskal).
status: done
complexity: O(α(n)) amortizado por operação; O(E log E) no Kruskal
tags: dsu, kruskal, mst
---

## Ideia

Cada conjunto é uma árvore com um representante. A compressão de caminho e a união por tamanho deixam as operações quase constantes. Kruskal ordena as arestas e junta as que ligam componentes diferentes.

## Código

```cpp
using ll = long long;

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

## Complexidade e cuidados

- `find` e `unite`: `O(α(n))` amortizado por operação com compressão de caminho e união por tamanho.
- Kruskal: ordenar as `E` arestas custa `O(E log E)`; as `E` uniões custam `O(E α(V))`. Total `O(E log E)`.
- Se o grafo for desconexo, o código retorna o peso da floresta geradora mínima; para exigir uma árvore geradora, conte as uniões aceitas e verifique se foram `n-1`.
- Pesos negativos são permitidos. O peso total usa `long long`.

## Uso

`dsu.unite(a, b)` devolve `false` se já estavam juntos.
