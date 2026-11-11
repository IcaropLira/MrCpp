---
title: LCA (binary lifting)
summary: Menor ancestral comum com binary lifting.
status: done
complexity: O(n log n) + O(log n)
tags: árvores, lca
---

## Ideia

`up[j][u]` é o ancestral de `u` a `2^j` passos. Iguala as profundidades e sobe os dois juntos.

## Código

```cpp
struct LCA {
    int LOG; vector<int> depth; vector<vector<int>> up;
    LCA(const vector<vector<int>>& g, int root = 0) {
        int n = g.size(); LOG = __lg(n) + 1;
        depth.assign(n, 0); up.assign(LOG, vector<int>(n, root));
        function<void(int, int)> dfs = [&](int u, int p) {
            up[0][u] = p;
            for (int j = 1; j < LOG; j++) up[j][u] = up[j-1][up[j-1][u]];
            for (int v : g[u]) if (v != p) depth[v] = depth[u] + 1, dfs(v, u);
        };
        dfs(root, root);
    }
    int query(int a, int b) {
        if (depth[a] < depth[b]) swap(a, b);
        for (int j = LOG - 1; j >= 0; j--) if (depth[a] - (1 << j) >= depth[b]) a = up[j][a];
        if (a == b) return a;
        for (int j = LOG - 1; j >= 0; j--) if (up[j][a] != up[j][b]) a = up[j][a], b = up[j][b];
        return up[0][a];
    }
};
```

## Outras consultas que saem da mesma tabela

Não pare no LCA. Com `depth` e `up`, você ganha de graça:

- **K-ésimo ancestral:** subir `k` níveis usando os bits de `k`.
- **Distância entre dois vértices:** `depth[u] + depth[v] - 2*depth[w]`, onde `w = LCA(u,v)`.
- **K-ésimo vértice no caminho:** encontre `w = LCA(u,v)`. Seja `a = depth[u]-depth[w]` e `b = depth[v]-depth[w]`. Se `k <= a`, suba `k` a partir de `u`; caso contrário, suba `a+b-k` a partir de `v`. Aqui `k=0` representa o próprio `u`.
- **Ancestralidade:** com tempos de entrada/saída da DFS, confira se `tin[u] <= tin[v] && tout[v] <= tout[u]`.

Adicione estes métodos ao struct, mantendo `up[j][v]` como o ancestral a (2^j) passos:

```cpp
int kth_ancestor(int v, int k) {
    for (int j = 0; j < LOG; j++)
        if (k & (1 << j)) v = up[j][v];
    return v;
}

int distance(int u, int v) {
    int w = query(u, v);
    return depth[u] + depth[v] - 2 * depth[w];
}

int kth_on_path(int u, int v, int k) {
    int w = query(u, v);
    int a = depth[u] - depth[w];
    int b = depth[v] - depth[w];
    if (k <= a) return kth_ancestor(u, k);
    return kth_ancestor(v, a + b - k);
}
```

Para `n` grande, considere DFS iterativa para evitar estouro de pilha. Se `k` ou a profundidade puderem alcançar valores que não cabem em `int`, ajuste o tipo e o número de níveis.
