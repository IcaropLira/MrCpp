---
title: Pontes com tin/low (aula)
summary: DFS iterativa com id de aresta (arestas paralelas), Necessary Roads e Non-academic Problem.
status: done
complexity: O(n + m)
tags: pontes, bridges, dfs tree, low, aula
---

## Ideia

`low[v]` = menor `tin` alcançável da subárvore de `v` usando **uma** back edge. A aresta da árvore `(p, v)` é ponte ⇔ `low[v] > tin[p]`.

### Necessary Roads (CSES 2076)

Juiz: <https://cses.fi/problemset/task/2076>  
Complexidade: `O(n + m)`

DFS com pilha explícita (caminho com 10⁵ vértices estoura a recursão) e salto pela **id** da aresta do pai.

```cpp
// CSES 2076 - Necessary Roads: pontes com tin/low, DFS ITERATIVA e id de aresta
// (pular "a aresta pelo id" e não "o vértice pai" -> funciona com arestas paralelas)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<pair<int,int>>> adj(n + 1);          // (vizinho, id da aresta)
    for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; adj[a].push_back({b, i}); adj[b].push_back({a, i}); }
    vector<int> tin(n + 1, 0), low(n + 1, 0), it(n + 1, 0), pe(n + 1, -1), par(n + 1, 0);
    vector<pair<int,int>> pontes;
    int timer_ = 0;
    for (int s = 1; s <= n; s++) if (!tin[s]) {         // cobre grafos desconexos
        tin[s] = low[s] = ++timer_;
        vector<int> st = {s};
        while (!st.empty()) {
            int v = st.back();
            if (it[v] < (int)adj[v].size()) {
                auto [to, id] = adj[v][it[v]++];
                if (id == pe[v]) continue;              // a própria aresta do pai
                if (tin[to]) low[v] = min(low[v], tin[to]);          // back edge
                else { tin[to] = low[to] = ++timer_; pe[to] = id; par[to] = v; st.push_back(to); } // desce
            } else {
                st.pop_back();
                if (v != s) {
                    int p = par[v];
                    low[p] = min(low[p], low[v]);
                    if (low[v] > tin[p]) pontes.push_back({p, v});   // nada abaixo de v sobe até p
                }
            }
        }
    }
    cout << pontes.size() << '\n';
    for (auto [a, b] : pontes) cout << a << ' ' << b << '\n';
}
```

Exemplo testado — entrada:

```text
4 4
1 2
2 3
1 3
3 4
```

saída:

```text
1
3 4
```


### Non-academic Problem (CF 1986F)

Juiz: <https://codeforces.com/problemset/problem/1986/F>  
Complexidade: `O(n + m) por caso`

Só remover ponte separa. Lado solto = `sz[v]`; resposta `min C(s,2) + C(n−s,2)`; sem ponte, `C(n,2)`.

```cpp
// CF 1986F - Non-academic Problem: remover uma aresta minimizando pares conectados
// só pontes separam; lado solto = sz[v] da subárvore na DFS tree -> C(s,2) + C(n-s,2)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n, m; cin >> n >> m;
        vector<vector<pair<int,int>>> adj(n + 1);
        for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; adj[a].push_back({b, i}); adj[b].push_back({a, i}); }
        vector<int> tin(n + 1, 0), low(n + 1, 0), it(n + 1, 0), pe(n + 1, -1), par(n + 1, 0);
        vector<ll> sz(n + 1, 1);
        int timer_ = 0;
        ll best = (ll)n * (n - 1) / 2;                  // sem ponte: tudo continua ligado
        tin[1] = low[1] = ++timer_;
        vector<int> st = {1};
        while (!st.empty()) {
            int v = st.back();
            if (it[v] < (int)adj[v].size()) {
                auto [to, id] = adj[v][it[v]++];
                if (id == pe[v]) continue;
                if (tin[to]) low[v] = min(low[v], tin[to]);
                else { tin[to] = low[to] = ++timer_; pe[to] = id; par[to] = v; st.push_back(to); }
            } else {
                st.pop_back();
                if (v != 1) {
                    int p = par[v];
                    sz[p] += sz[v];
                    low[p] = min(low[p], low[v]);
                    if (low[v] > tin[p]) { ll s = sz[v]; best = min(best, s * (s - 1) / 2 + (n - s) * (n - s - 1) / 2); }
                }
            }
        }
        cout << best << '\n';
    }
}
```

Exemplo testado — entrada:

```text
2
3 3
1 2
2 3
1 3
5 5
1 2
2 3
1 3
3 4
4 5
```

saída:

```text
3
4
```
