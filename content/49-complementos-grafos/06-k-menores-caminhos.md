---
title: k menores caminhos (passeios)
summary: Dijkstra em que cada vértice sai da fila até k vezes (CSES 1196 Flight Routes).
status: done
complexity: O(k (n + m) log(k m))
tags: k shortest paths, dijkstra, flight routes
---

## Ideia

A `j`-ésima vez que `v` sai da heap é o `j`-ésimo menor passeio até `v`. Permite repetir vértices; para caminhos **simples** use Yen (bem mais caro); para k grande, Eppstein.

### Flight Routes (CSES 1196)

Juiz: <https://cses.fi/problemset/task/1196>  
Complexidade: `O(k (n + m) log(k m))`

Não empurre para quem já saiu k vezes.

```cpp
// CSES 1196 - Flight Routes: os k menores preços de 1 a n (passeios; vértices podem repetir)
// Dijkstra que deixa cada vértice sair da fila até k vezes: a j-ésima saída de v é o j-ésimo menor custo.
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, k; cin >> n >> m >> k;
    vector<vector<pair<int,ll>>> adj(n + 1);
    for (int i = 0; i < m; i++) { int a, b; ll c; cin >> a >> b >> c; adj[a].push_back({b, c}); }
    vector<int> cnt(n + 1, 0);
    priority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<>> pq; pq.push({0, 1});
    vector<ll> res;
    while (!pq.empty() && (int)res.size() < k) {
        auto [d, v] = pq.top(); pq.pop();
        if (cnt[v] >= k) continue;
        cnt[v]++;
        if (v == n) res.push_back(d);
        for (auto [to, c] : adj[v]) if (cnt[to] < k) pq.push({d + c, to});
    }
    for (size_t i = 0; i < res.size(); i++) cout << res[i] << " \n"[i + 1 == res.size()];
}
```

Exemplo testado — entrada:

```text
4 6 3
1 2 1
1 3 3
2 3 2
2 4 6
3 2 8
3 4 1
```

saída:

```text
4 4 7
```
