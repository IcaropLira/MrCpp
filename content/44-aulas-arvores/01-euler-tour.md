---
title: Euler Tour: subárvore vira intervalo
summary: tin/tout com DFS iterativa; Subtree Queries, Path Queries, Ki e Danil (lazy de inversão).
status: done
complexity: O((n + q) log n)
tags: euler tour, tin, tout, bit, lazy, aula
---

## Ideia

Numere os vértices na ordem da DFS (`tin`). `tout[v]` = último `tin` da subárvore. Então a subárvore de `v` é exatamente o intervalo `[tin[v], tout[v]]`, e o vértice `v` mora na posição `tin[v]`.

### Subtree Queries (CSES 1137)

Juiz: <https://cses.fi/problemset/task/1137>  
Complexidade: `O((n + q) log n)`

Ponto em `tin[s]`, soma em `[tin[s], tout[s]]`.

```cpp
// CSES 1137 - Subtree Queries: subárvore de v = intervalo [tin[v], tout[v]] -> BIT
// DFS iterativa (árvore em linha com n = 2e5 estoura a pilha recursiva em alguns juízes)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int n, timer_ = 0;
vector<vector<int>> adj;
vector<int> tin, tout;

void euler(int root) {
    vector<pair<int,int>> st = {{root, 0}};          // (nó, pai); nó negativo = saída
    while (!st.empty()) {
        auto [v, p] = st.back(); st.pop_back();
        if (v > 0) {
            tin[v] = ++timer_;                       // entrada: "("
            st.push_back({-v, p});                   // agenda a saída: ")"
            for (int u : adj[v]) if (u != p) st.push_back({u, v});
        } else tout[-v] = timer_;                    // último tin da subárvore
    }
}

vector<ll> bit;
void add(int i, ll x) { for (; i <= n; i += i & -i) bit[i] += x; }
ll pref(int i) { ll s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int q; cin >> n >> q;
    vector<ll> val(n + 1);
    for (int i = 1; i <= n; i++) cin >> val[i];
    adj.assign(n + 1, {}); tin.assign(n + 1, 0); tout.assign(n + 1, 0);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    euler(1);
    bit.assign(n + 1, 0);
    for (int v = 1; v <= n; v++) add(tin[v], val[v]);   // v mora na posição tin[v]
    while (q--) {
        int t; cin >> t;
        if (t == 1) { int s; ll x; cin >> s >> x; add(tin[s], x - val[s]); val[s] = x; }
        else { int s; cin >> s; cout << pref(tout[s]) - pref(tin[s] - 1) << '\n'; }
    }
}
```

Exemplo testado — entrada:

```text
4 3
2 1 3 5
1 2
1 3
2 4
2 2
1 4 7
2 2
```

saída:

```text
6
8
```


### Path Queries (CSES 1138)

Juiz: <https://cses.fi/problemset/task/1138>  
Complexidade: `O((n + q) log n)`

O valor de `v` vale para toda a subárvore de `v`: range add em `[tin, tout]`; o caminho raiz→s é a consulta pontual `pref(tin[s])`.

```cpp
// CSES 1138 - Path Queries: soma do caminho 1 -> s
// val[v] vale para toda a subárvore de v: range add em [tin, tout] e consulta pontual pref(tin[s])
// DFS iterativa (árvore em linha com n = 2e5 estoura a pilha recursiva em alguns juízes)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int n, timer_ = 0;
vector<vector<int>> adj;
vector<int> tin, tout;

void euler(int root) {
    vector<pair<int,int>> st = {{root, 0}};          // (nó, pai); nó negativo = saída
    while (!st.empty()) {
        auto [v, p] = st.back(); st.pop_back();
        if (v > 0) {
            tin[v] = ++timer_;                       // entrada: "("
            st.push_back({-v, p});                   // agenda a saída: ")"
            for (int u : adj[v]) if (u != p) st.push_back({u, v});
        } else tout[-v] = timer_;                    // último tin da subárvore
    }
}

vector<ll> bit;
void add(int i, ll x) { for (; i <= n; i += i & -i) bit[i] += x; }
ll pref(int i) { ll s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; }

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int q; cin >> n >> q;
    vector<ll> val(n + 1);
    for (int i = 1; i <= n; i++) cin >> val[i];
    adj.assign(n + 1, {}); tin.assign(n + 1, 0); tout.assign(n + 1, 0);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    euler(1);
    bit.assign(n + 2, 0);
    auto soma_sub = [&](int v, ll d) { add(tin[v], d); if (tout[v] + 1 <= n) add(tout[v] + 1, -d); };
    for (int v = 1; v <= n; v++) soma_sub(v, val[v]);
    while (q--) {
        int t; cin >> t;
        if (t == 1) { int s; ll x; cin >> s >> x; soma_sub(s, x - val[s]); val[s] = x; }
        else { int s; cin >> s; cout << pref(tin[s]) << '\n'; }
    }
}
```

Exemplo testado — entrada:

```text
4 4
2 1 3 5
1 2
1 3
2 4
2 4
1 2 6
2 4
2 3
```

saída:

```text
8
13
5
```


### Ki (ABC138 D)

Juiz: <https://atcoder.jp/contests/abc138/tasks/abc138_d>  
Complexidade: `O(n + q)`

Tudo offline: vetor de diferenças sobre `tin`.

```cpp
// ABC138 D - Ki: +x em toda a subárvore de p (offline) -> vetor de diferenças sobre tin/tout
// (alternativa ainda mais simples: cnt[p] += x e depois propaga de pai para filho)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    vector<int> tin(n + 1), tout(n + 1);
    int timer_ = 0;
    vector<pair<int,int>> st = {{1, 0}};
    while (!st.empty()) {
        auto [v, p] = st.back(); st.pop_back();
        if (v > 0) { tin[v] = ++timer_; st.push_back({-v, p}); for (int u : adj[v]) if (u != p) st.push_back({u, v}); }
        else tout[-v] = timer_;
    }
    vector<ll> d(n + 2, 0);
    while (q--) { int p; ll x; cin >> p >> x; d[tin[p]] += x; d[tout[p] + 1] -= x; }
    for (int i = 1; i <= n; i++) d[i] += d[i - 1];
    for (int v = 1; v <= n; v++) cout << d[tin[v]] << " \n"[v == n];
}
```

Exemplo testado — entrada:

```text
4 2
1 2
1 3
2 4
1 1
2 10
```

saída:

```text
1 11 1 11
```


### Danil and a Part-time Job (CF 877E)

Juiz: <https://codeforces.com/contest/877/problem/E>  
Complexidade: `O((n + q) log n)`

Inverter a subárvore = inverter um intervalo → segtree com lazy XOR.

```cpp
// CF 877E - Danil and a Part-time Job: pow v inverte a subárvore, get v conta acesas
// Euler tour + segtree com inversão preguiçosa (lazy XOR): cnt = tamanho - cnt
#include <bits/stdc++.h>
using namespace std;

int n;
vector<int> cnt, lz, base;
void aplica(int v, int tl, int tr) { cnt[v] = (tr - tl + 1) - cnt[v]; lz[v] ^= 1; }
void push(int v, int tl, int tr) {
    if (!lz[v]) return;
    int tm = (tl + tr) / 2;
    aplica(2 * v, tl, tm); aplica(2 * v + 1, tm + 1, tr); lz[v] = 0;
}
void build(int v, int tl, int tr) {
    if (tl == tr) { cnt[v] = base[tl]; return; }
    int tm = (tl + tr) / 2;
    build(2 * v, tl, tm); build(2 * v + 1, tm + 1, tr);
    cnt[v] = cnt[2 * v] + cnt[2 * v + 1];
}
void inverte(int v, int tl, int tr, int l, int r) {
    if (r < tl || tr < l) return;
    if (l <= tl && tr <= r) { aplica(v, tl, tr); return; }
    push(v, tl, tr);
    int tm = (tl + tr) / 2;
    inverte(2 * v, tl, tm, l, r); inverte(2 * v + 1, tm + 1, tr, l, r);
    cnt[v] = cnt[2 * v] + cnt[2 * v + 1];
}
int conta(int v, int tl, int tr, int l, int r) {
    if (r < tl || tr < l) return 0;
    if (l <= tl && tr <= r) return cnt[v];
    push(v, tl, tr);
    int tm = (tl + tr) / 2;
    return conta(2 * v, tl, tm, l, r) + conta(2 * v + 1, tm + 1, tr, l, r);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    cin >> n;
    vector<vector<int>> filhos(n + 1);
    for (int i = 2; i <= n; i++) { int p; cin >> p; filhos[p].push_back(i); }
    vector<int> t(n + 1), tin(n + 1), tout(n + 1);
    for (int i = 1; i <= n; i++) cin >> t[i];
    int timer_ = 0;
    vector<int> st = {1};
    while (!st.empty()) {                                // pais dados: só desce
        int v = st.back(); st.pop_back();
        if (v > 0) { tin[v] = ++timer_; st.push_back(-v); for (int u : filhos[v]) st.push_back(u); }
        else tout[-v] = timer_;
    }
    base.assign(n + 1, 0);
    for (int v = 1; v <= n; v++) base[tin[v]] = t[v];
    cnt.assign(4 * n, 0); lz.assign(4 * n, 0);
    build(1, 1, n);
    int q; cin >> q;
    while (q--) {
        string cmd; int v; cin >> cmd >> v;
        if (cmd == "pow") inverte(1, 1, n, tin[v], tout[v]);
        else cout << conta(1, 1, n, tin[v], tout[v]) << '\n';
    }
}
```

Exemplo testado — entrada:

```text
4
1 1 1
1 0 0 1
9
get 1
get 2
get 3
get 4
pow 1
get 1
get 2
get 3
get 4
```

saída:

```text
2
0
0
1
2
1
1
0
```
