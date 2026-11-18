---
title: LCA (binary lifting)
summary: Menor ancestral comum, k-ésimo ancestral, distância e k-ésimo vértice no caminho.
status: done
complexity: O(n log n) construção; O(log n) por consulta
tags: árvores, lca, binary lifting, distância, caminhos
---

## Ideia

`up[j][v]` é o ancestral de `v` a `2^j` arestas de distância. A recorrência é:

- `up[0][v] = pai[v]`;
- `up[j][v] = up[j-1][up[j-1][v]]`.

Para consultar o LCA, primeiro igualamos as profundidades. Depois subimos os dois vértices do maior salto para o menor, sempre que seus ancestrais forem diferentes.

## Código

Árvore não direcionada, conexa, com vértices `0..n-1`. A DFS é iterativa para evitar estouro de pilha em árvores profundas. Métodos de k-ésimo ancestral e caminho devolvem `-1` quando `k` é inválido.

```cpp
#include <bits/stdc++.h>
using namespace std;

struct LCA {
    int LOG;
    vector<int> depth;
    vector<vector<int>> up;

    LCA(const vector<vector<int>>& g, int root = 0) {
        int n = (int)g.size();
        assert(n > 0 && 0 <= root && root < n);

        LOG = 1;
        while ((1LL << LOG) <= n) LOG++;

        depth.assign(n, 0);
        up.assign(LOG, vector<int>(n, root));

        vector<int> pai(n, -1), st = {root};
        pai[root] = root;

        while (!st.empty()) {
            int u = st.back();
            st.pop_back();

            for (int v : g[u]) {
                if (pai[v] != -1) continue;
                pai[v] = u;
                depth[v] = depth[u] + 1;
                st.push_back(v);
            }
        }

        for (int v = 0; v < n; v++) up[0][v] = pai[v];

        for (int j = 1; j < LOG; j++)
            for (int v = 0; v < n; v++)
                up[j][v] = up[j-1][up[j-1][v]];
    }

    int kth_ancestor(int v, int k) const {
        if (k < 0 || k > depth[v]) return -1;

        for (int j = 0; j < LOG; j++)
            if (k & (1LL << j)) v = up[j][v];

        return v;
    }

    int query(int a, int b) const {
        if (depth[a] < depth[b]) swap(a, b);

        int diff = depth[a] - depth[b];
        for (int j = 0; j < LOG; j++)
            if (diff & (1LL << j)) a = up[j][a];

        if (a == b) return a;

        for (int j = LOG - 1; j >= 0; j--)
            if (up[j][a] != up[j][b])
                a = up[j][a], b = up[j][b];

        return up[0][a];
    }

    int distance(int a, int b) const {
        int w = query(a, b);
        return depth[a] + depth[b] - 2 * depth[w];
    }

    // k=0 devolve a; -1 indica k fora do caminho.
    int kth_on_path(int a, int b, int k) const {
        int w = query(a, b);
        int x = depth[a] - depth[w];
        int y = depth[b] - depth[w];

        if (k < 0 || k > x + y) return -1;
        if (k <= x) return kth_ancestor(a, k);
        return kth_ancestor(b, x + y - k);
    }
};
```

Uso: `LCA lca(g, 0)`, `lca.query(u, v)`, `lca.distance(u, v)` e `lca.kth_on_path(u, v, k)`.

## Consultas derivadas

- **K-ésimo ancestral:** `kth_ancestor(v, k)`, em `O(log n)`.
- **Distância em arestas:** `depth[u] + depth[v] - 2 * depth[lca(u,v)]`.
- **K-ésimo vértice no caminho:** `k` é 0-indexado a partir de `u`; se `w = LCA(u,v)`, `a = depth[u]-depth[w]` e `b = depth[v]-depth[w]`, subimos `k` a partir de `u` quando `k <= a`; caso contrário, `a+b-k` a partir de `v`.

## Complexidade e cuidados

- Construção: `O(n log n)`; memória: `O(n log n)`.
- LCA, k-ésimo ancestral, distância e k-ésimo vértice: `O(log n)` por consulta.
- A árvore deve ser não vazia, conexa e sem ciclos; os índices precisam estar em `0..n-1`.
- A raiz é ancestral de si mesma. `kth_ancestor(v, k)` devolve `-1` se `k > depth[v]`.
- `kth_on_path(u, v, k)` exige `0 <= k <= distance(u,v)`; fora desse intervalo devolve `-1`.
- A DFS iterativa evita a profundidade de recursão `O(n)` que poderia estourar a pilha.
