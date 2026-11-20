---
title: Intervals: DP com Lazy de máximo
summary: AtCoder DP W: t[j] = melhor com último 1 em j; intervalos somam em faixas.
status: done
complexity: O((n + m) log n)
tags: dp, lazy, segtree, máximo, aula
---

## Ideia

`t[j]` = melhor pontuação se o último `'1'` está em `j` (`j = 0`: nenhum). Em `i`: `t[i] = max(t[0..i−1])`; cada intervalo `[l, i]` que termina em `i` soma sua pontuação a `t[l..i]` (o último 1 está dentro dele). Range add + max query = lazy.

### Intervals (AtCoder DP W)

Juiz: <https://atcoder.jp/contests/dp/tasks/dp_w>  
Complexidade: `O((n + m) log n)`

Agrupe os intervalos pelo fim `r`.

```cpp
// AtCoder DP W - Intervals: t[j] = melhor pontuação com o último '1' em j
// em i: t[i] = max(t[0..i-1]); depois, cada intervalo [l, i] com pontuação a soma a em t[l..i]
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int n;
vector<ll> t, lz;
void push(int v) { for (int c : {2 * v, 2 * v + 1}) { t[c] += lz[v]; lz[c] += lz[v]; } lz[v] = 0; }
void add(int v, int tl, int tr, int l, int r, ll x) {
    if (r < tl || tr < l) return;
    if (l <= tl && tr <= r) { t[v] += x; lz[v] += x; return; }   // o máximo sobe x
    push(v);
    int tm = (tl + tr) / 2;
    add(2 * v, tl, tm, l, r, x); add(2 * v + 1, tm + 1, tr, l, r, x);
    t[v] = max(t[2 * v], t[2 * v + 1]);
}
ll query(int v, int tl, int tr, int l, int r) {
    if (r < tl || tr < l) return LLONG_MIN;
    if (l <= tl && tr <= r) return t[v];
    push(v);
    int tm = (tl + tr) / 2;
    return max(query(2 * v, tl, tm, l, r), query(2 * v + 1, tm + 1, tr, l, r));
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int m; cin >> n >> m;
    vector<vector<pair<int,ll>>> fim(n + 1);
    for (int i = 0; i < m; i++) { int l, r; ll a; cin >> l >> r >> a; fim[r].push_back({l, a}); }
    t.assign(4 * (n + 1), 0); lz.assign(4 * (n + 1), 0);   // posição 0 = nenhum '1'
    for (int i = 1; i <= n; i++) {
        ll melhor = query(1, 0, n, 0, i - 1);
        add(1, 0, n, i, i, melhor);                        // coloca o último '1' em i
        for (auto [l, a] : fim[i]) add(1, 0, n, l, i, a);  // último '1' em [l, i] ganha a
    }
    cout << max(0LL, t[1]) << '\n';
}
```

Exemplo testado — entrada:

```text
5 3
1 3 10
2 4 -10
3 5 10
```

saída:

```text
20
```
