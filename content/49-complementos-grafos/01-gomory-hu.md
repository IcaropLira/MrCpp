---
title: Árvore de Gomory-Hu
summary: n−1 fluxos máximos dão o corte mínimo entre todos os pares de um grafo não dirigido.
status: done
complexity: O(n · maxflow)
tags: gomory-hu, corte mínimo, fluxo, dinic
---

## Struct Dinic

```cpp
// Dinic: O(V² E) geral; O(E √V) em grafos de capacidade unitária / bipartidos
struct Dinic {
    struct E { int to; long long cap; };
    int n; vector<E> e; vector<vector<int>> g; vector<int> lvl, it;
    Dinic(int n_) : n(n_), g(n_), lvl(n_), it(n_) {}
    int add(int u, int v, long long c, long long rc = 0) {   // rc = c para aresta não dirigida
        e.push_back({v, c}); g[u].push_back(e.size() - 1);
        e.push_back({u, rc}); g[v].push_back(e.size() - 1);
        return e.size() - 2;
    }
    bool bfs(int s, int t) {
        fill(lvl.begin(), lvl.end(), -1); lvl[s] = 0;
        queue<int> q; q.push(s);
        while (!q.empty()) { int u = q.front(); q.pop(); for (int id : g[u]) if (e[id].cap > 0 && lvl[e[id].to] < 0) { lvl[e[id].to] = lvl[u] + 1; q.push(e[id].to); } }
        return lvl[t] >= 0;
    }
    long long dfs(int u, int t, long long f) {
        if (u == t) return f;
        for (int &i = it[u]; i < (int)g[u].size(); i++) {
            int id = g[u][i], v = e[id].to;
            if (e[id].cap > 0 && lvl[v] == lvl[u] + 1)
                if (long long p = dfs(v, t, min(f, e[id].cap))) { e[id].cap -= p; e[id ^ 1].cap += p; return p; }
        }
        return 0;
    }
    long long maxflow(int s, int t) {
        long long fl = 0;
        while (bfs(s, t)) { fill(it.begin(), it.end(), 0); while (long long p = dfs(s, t, LLONG_MAX)) fl += p; }
        return fl;
    }
    // depois do maxflow: lado S do corte mínimo = vértices alcançáveis de s no residual (lvl >= 0)
    bool lado_s(int v) const { return lvl[v] >= 0; }
};
```

## Gomory-Hu (Gusfield)

Corte mínimo entre `a` e `b` = **menor aresta no caminho** `a–b` da árvore. Com LCA + máximo/mínimo no salto, cada consulta fica O(log n).

```cpp
// Árvore de Gomory-Hu (grafo NÃO dirigido): n−1 maxflows e o corte mínimo entre QUALQUER par
// = menor aresta no caminho entre eles na árvore. (Algoritmo de Gusfield, sem contrair vértices.)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
// >>> cole aqui: struct Dinic (bloco no início deste tópico)

int main() {
    int n, m; cin >> n >> m;                          // vértices 0..n-1
    vector<array<ll,3>> ed(m);
    for (auto &[u, v, c] : ed) cin >> u >> v >> c;
    vector<int> par(n, 0); vector<ll> w(n, 0);        // árvore: aresta (i, par[i]) com peso w[i]
    for (int i = 1; i < n; i++) {
        Dinic d(n);
        for (auto [u, v, c] : ed) d.add(u, v, c, c);
        w[i] = d.maxflow(i, par[i]);
        for (int j = i + 1; j < n; j++) if (d.lado_s(j) && par[j] == par[i]) par[j] = i;
    }
    // consultas: corte mínimo entre a e b = mínimo no caminho da árvore (aqui O(n) por consulta)
    vector<vector<pair<int,ll>>> t(n);
    for (int i = 1; i < n; i++) { t[i].push_back({par[i], w[i]}); t[par[i]].push_back({i, w[i]}); }
    int q; cin >> q;
    while (q--) {
        int a, b; cin >> a >> b;
        vector<ll> best(n, -1); best[a] = LLONG_MAX;
        vector<int> st = {a};
        while (!st.empty()) { int u = st.back(); st.pop_back(); for (auto [v, c] : t[u]) if (best[v] < 0) { best[v] = min(best[u], c); st.push_back(v); } }
        cout << best[b] << '\n';
    }
}
```

Exemplo testado — entrada:

```text
4 5
0 1 3
1 2 2
2 3 4
3 0 1
0 2 2
3
0 2
1 3
0 3
```

saída:

```text
5
5
5
```

> Verificação: 300 grafos aleatórios, todos os pares contra um maxflow por par.
