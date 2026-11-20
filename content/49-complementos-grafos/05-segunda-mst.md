---
title: Segunda melhor MST
summary: Kruskal + binary lifting com maior e segunda maior aresta no caminho: troca uma aresta fora da árvore.
status: done
complexity: O(m log n)
tags: mst, segunda melhor, kruskal, binary lifting, lca
---

## Ideia

A 2ª melhor árvore difere da MST em **uma** troca: entra `(u, v, w)` fora da árvore e sai a maior aresta `< w` do caminho `u–v` (guarde a maior e a 2ª maior **estrita** em cada salto, para o caso de empate com `w`).

Propriedades de MST úteis: **corte** (a menor aresta de qualquer corte está em alguma MST) e **ciclo** (a maior aresta de um ciclo não está em nenhuma MST, se for única). Caminho minimax entre `u` e `v` = maior aresta do caminho na MST.

```cpp
// Segunda melhor MST (estritamente maior): Kruskal + para cada aresta fora da MST (u,v,w),
// troque pela MAIOR aresta < w no caminho u–v da MST (binary lifting guardando maior e 2ª maior).
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const int LOG = 18;

int main() {
    int n, m; cin >> n >> m;
    vector<array<ll,3>> e(m);
    for (auto &[w, u, v] : e) cin >> u >> v >> w;
    sort(e.begin(), e.end());
    vector<int> dsu(n); iota(dsu.begin(), dsu.end(), 0);
    function<int(int)> f = [&](int x) { return dsu[x] == x ? x : dsu[x] = f(dsu[x]); };
    vector<vector<pair<int,ll>>> t(n);
    vector<bool> na(m, false);
    ll mst = 0; int cnt = 0;
    for (int i = 0; i < m; i++) {
        auto [w, u, v] = e[i];
        if (f(u) != f(v)) { dsu[f(u)] = f(v); mst += w; na[i] = true; cnt++; t[u].push_back({v, w}); t[v].push_back({u, w}); }
    }
    if (cnt != n - 1) { cout << "-1 -1\n"; return 0; }            // desconexo
    // binary lifting com (maior, segunda maior estrita) no salto
    vector<array<int,LOG>> up(n); vector<array<pair<ll,ll>,LOG>> mx(n); vector<int> dep(n, 0);
    auto junta = [](pair<ll,ll> a, pair<ll,ll> b) {
        ll v[4] = {a.first, a.second, b.first, b.second}; ll m1 = *max_element(v, v + 4), m2 = LLONG_MIN;
        for (ll x : v) if (x < m1) m2 = max(m2, x);
        return make_pair(m1, m2);
    };
    vector<int> ord = {0}; vector<bool> vis(n, false); vis[0] = true;
    up[0].fill(0); mx[0].fill({LLONG_MIN, LLONG_MIN});
    for (int i = 0; i < (int)ord.size(); i++) for (auto [v, w] : t[ord[i]]) if (!vis[v]) {
        vis[v] = true; up[v][0] = ord[i]; mx[v][0] = {w, LLONG_MIN}; dep[v] = dep[ord[i]] + 1; ord.push_back(v);
    }
    for (int j = 1; j < LOG; j++) for (int v : ord) { up[v][j] = up[up[v][j - 1]][j - 1]; mx[v][j] = junta(mx[v][j - 1], mx[up[v][j - 1]][j - 1]); }
    auto caminho = [&](int a, int b) {
        pair<ll,ll> r = {LLONG_MIN, LLONG_MIN};
        if (dep[a] < dep[b]) swap(a, b);
        for (int j = LOG - 1; j >= 0; j--) if (dep[a] - (1 << j) >= dep[b]) { r = junta(r, mx[a][j]); a = up[a][j]; }
        if (a == b) return r;
        for (int j = LOG - 1; j >= 0; j--) if (up[a][j] != up[b][j]) { r = junta(r, junta(mx[a][j], mx[b][j])); a = up[a][j]; b = up[b][j]; }
        return junta(r, junta(mx[a][0], mx[b][0]));
    };
    ll best = LLONG_MAX;
    for (int i = 0; i < m; i++) if (!na[i]) {
        auto [w, u, v] = e[i];
        if (u == v) continue;
        auto [m1, m2] = caminho(u, v);
        ll tira = (m1 < w ? m1 : m2);                                  // maior aresta < w
        if (tira != LLONG_MIN) best = min(best, mst - tira + w);
    }
    cout << mst << ' ' << (best == LLONG_MAX ? -1 : best) << '\n';
}
```

Exemplo testado — entrada:

```text
4 5
0 1 1
1 2 2
2 3 3
0 3 4
0 2 5
```

saída:

```text
6 7
```

> Verificação: 400 grafos aleatórios contra enumeração de todas as árvores geradoras (imprime MST e 2ª MST estrita, −1 se não existe).
