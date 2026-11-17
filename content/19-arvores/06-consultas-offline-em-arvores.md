---
title: Consultas offline em árvores
summary: LCA de várias consultas de uma vez com DSU (algoritmo de Tarjan) e distâncias na árvore.
status: done
complexity: O((n + q) · α(n))
tags: árvores, lca, offline, dsu
---

## Ideia

Quando todas as consultas são conhecidas de antemão, dá para respondê-las durante uma única DFS. Quando a DFS termina um vértice `u`, ele é fundido ao pai no DSU e o representante do conjunto guarda o ancestral ainda aberto. Para a consulta `(u, v)`, no instante em que o segundo dos dois termina, o ancestral comum mais profundo é o ancestral guardado do primeiro.

## Código

```cpp
// árvore enraizada em 0 (vértices 0..n-1, não dirigida). Devolve o LCA de cada consulta (u, v)
vector<int> lca_offline(const vector<vector<int>>& g, const vector<pair<int, int>>& Q) {
    int n = g.size();
    vector<vector<pair<int, int>>> qs(n);  // (outro extremo, índice da consulta)
    for (int i = 0; i < (int)Q.size(); i++) {
        qs[Q[i].first].push_back({Q[i].second, i});
        qs[Q[i].second].push_back({Q[i].first, i});
    }
    vector<int> dsu(n), anc(n), pai(n, -1), it(n, 0), ans(Q.size(), -1);
    vector<char> fim(n, false);
    iota(dsu.begin(), dsu.end(), 0);
    iota(anc.begin(), anc.end(), 0);
    function<int(int)> find = [&](int x) { return dsu[x] == x ? x : dsu[x] = find(dsu[x]); };
    vector<int> pilha = {0};
    while (!pilha.empty()) {
        int u = pilha.back();
        if (it[u] < (int)g[u].size()) {
            int v = g[u][it[u]++];
            if (v != pai[u]) pai[v] = u, pilha.push_back(v);
        } else {
            fim[u] = true;
            for (auto [v, i] : qs[u]) if (fim[v]) ans[i] = anc[find(v)];
            pilha.pop_back();
            if (!pilha.empty()) {  // funde u no pai
                int p = pilha.back();
                dsu[find(u)] = find(p);
                anc[find(p)] = p;
            }
        }
    }
    return ans;
}

// distância entre u e v em árvore com pesos: dep[u] + dep[v] - 2 * dep[lca]
```

## Complexidade e cuidados

- Consulta `(u, u)` devolve `u`.
- `find` é recursivo com compressão de caminho: a profundidade da recursão é pequena por causa da compressão, mas a DFS em si é iterativa.
- Para consultas online use binary lifting ou Euler tour + sparse table (`O(1)` por consulta).
- A árvore deve ser conexa; com floresta rode uma DFS por raiz.
