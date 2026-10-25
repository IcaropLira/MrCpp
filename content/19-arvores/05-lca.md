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
