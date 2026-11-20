---
title: Ordenação topológica e DP em DAG (aula)
summary: Kahn, ordem lexicográfica, contagem de caminhos mínimos, Chat Screenshots, Game Routes e Endless Walk.
status: done
complexity: O(n + m)
tags: topológica, kahn, dag, dijkstra, aula
---

## Kahn

```cpp
// Kahn: ordem topológica em O(n + m). Se ordem.size() < n, há ciclo.
vector<int> kahn(int n, const vector<vector<int>> &adj) {
    vector<int> grau(n + 1, 0), ordem;
    for (int v = 1; v <= n; v++) for (int to : adj[v]) grau[to]++;
    queue<int> fila;
    for (int v = 1; v <= n; v++) if (grau[v] == 0) fila.push(v);   // sem pré-requisito
    while (!fila.empty()) {
        int v = fila.front(); fila.pop();
        ordem.push_back(v);
        for (int to : adj[v]) if (--grau[to] == 0) fila.push(to);   // apaga a seta v -> to
    }
    return ordem;
}
```

### Tarefas do Sandro (SPOJ TOPOSORT)

Juiz: <https://www.spoj.com/problems/TOPOSORT/>  
Complexidade: `O((n + m) log n)`

O juiz pede a ordem **lexicograficamente menor** → troque a fila por min-heap. Ciclo → `Sandro fails.`

```cpp
// SPOJ TOPOSORT (tarefas do Sandro): ordem topológica LEXICOGRAFICAMENTE MENOR -> min-heap
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<int>> adj(n + 1);
    vector<int> grau(n + 1, 0);
    for (int i = 0; i < m; i++) { int x, y; cin >> x >> y; adj[x].push_back(y); grau[y]++; }
    priority_queue<int, vector<int>, greater<int>> pq;       // fila comum serve se qualquer ordem vale
    for (int v = 1; v <= n; v++) if (!grau[v]) pq.push(v);
    vector<int> ordem;
    while (!pq.empty()) {
        int v = pq.top(); pq.pop(); ordem.push_back(v);
        for (int to : adj[v]) if (--grau[to] == 0) pq.push(to);
    }
    if ((int)ordem.size() < n) { cout << "Sandro fails.\n"; return 0; }   // sobrou alguém: ciclo
    for (int i = 0; i < n; i++) cout << ordem[i] << " \n"[i == n - 1];
}
```

Exemplo testado — entrada:

```text
8 9
1 4
1 2
4 2
4 3
3 2
5 2
3 5
8 2
8 6
```

saída:

```text
1 4 3 5 7 8 2 6
```


### Investigation (CSES 1202) — e Problema Motivador 2

Juiz: <https://cses.fi/problemset/task/1202>  
Complexidade: `O((n + m) log m)`

Dijkstra; mantenha só as setas ótimas `dist[v] + c == dist[to]` (formam um DAG); DP na ordem topológica: `ways`, menor e maior nº de voos.

```cpp
// CSES 1202 - Investigation: Dijkstra + DAG de arestas ótimas (dist[v]+c == dist[to]) em ordem topológica
// conta rotas mínimas, menor e maior nº de voos entre elas
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll MOD = 1e9 + 7, INF = LLONG_MAX / 4;
// >>> cole aqui: kahn() (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<pair<int,ll>>> adj(n + 1);
    for (int i = 0; i < m; i++) { int a, b; ll c; cin >> a >> b >> c; adj[a].push_back({b, c}); }
    vector<ll> dist(n + 1, INF); dist[1] = 0;
    priority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<>> pq; pq.push({0, 1});
    while (!pq.empty()) {
        auto [d, v] = pq.top(); pq.pop();
        if (d > dist[v]) continue;                           // entrada velha
        for (auto [to, c] : adj[v]) if (d + c < dist[to]) { dist[to] = d + c; pq.push({dist[to], to}); }
    }
    vector<vector<int>> dag(n + 1);
    for (int v = 1; v <= n; v++) if (dist[v] < INF)
        for (auto [to, c] : adj[v]) if (dist[v] + c == dist[to]) dag[v].push_back(to);  // seta ótima
    vector<ll> ways(n + 1, 0); vector<int> mn(n + 1, INT_MAX), mx(n + 1, INT_MIN);
    ways[1] = 1; mn[1] = mx[1] = 0;
    for (int v : kahn(n, dag)) {
        if (!ways[v] && v != 1) continue;                    // inalcançável por rota ótima
        for (int to : dag[v]) {
            ways[to] = (ways[to] + ways[v]) % MOD;
            mn[to] = min(mn[to], mn[v] + 1);
            mx[to] = max(mx[to], mx[v] + 1);
        }
    }
    cout << dist[n] << ' ' << ways[n] << ' ' << mn[n] << ' ' << mx[n] << '\n';
}
```

Exemplo testado — entrada:

```text
4 5
1 4 5
1 2 4
2 4 5
1 3 2
3 4 3
```

saída:

```text
5 2 1 2
```


### Chat Screenshots (CF 1931F)

Juiz: <https://codeforces.com/problemset/problem/1931/F>  
Complexidade: `O(n · k)`

Cada print (sem o autor) dá setas consecutivas; compatível ⇔ sem ciclo.

```cpp
// CF 1931F - Chat Screenshots: cada print dá arestas a[i] -> a[i+1] (sem o autor); existe ordem <=> DAG
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: kahn() (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n, k; cin >> n >> k;
        vector<vector<int>> adj(n + 1);
        for (int j = 0; j < k; j++) {
            vector<int> a(n); for (auto &x : a) cin >> x;
            for (int i = 1; i + 1 < n; i++) adj[a[i]].push_back(a[i + 1]);   // pula o autor a[0]
        }
        cout << ((int)kahn(n, adj).size() == n ? "YES" : "NO") << '\n';
    }
}
```

Exemplo testado — entrada:

```text
2
3 2
1 2 3
2 1 3
3 3
1 2 3
2 3 1
3 1 2
```

saída:

```text
YES
NO
```


### Game Routes (CSES 1681)

Juiz: <https://cses.fi/problemset/task/1681>  
Complexidade: `O(n + m)`

`ways[to] += ways[v]` na ordem topológica.

```cpp
// CSES 1681 - Game Routes: contar caminhos 1 -> n num DAG (DP em ordem topológica)
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1e9 + 7;
// >>> cole aqui: kahn() (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < m; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); }
    vector<long long> ways(n + 1, 0); ways[1] = 1;
    for (int v : kahn(n, adj)) for (int to : adj[v]) ways[to] = (ways[to] + ways[v]) % MOD;  // "empurra"
    cout << ways[n] << '\n';
}
```

Exemplo testado — entrada:

```text
4 5
1 2
1 3
2 3
2 4
3 4
```

saída:

```text
3
```


### Endless Walk (ABC245 F)

Juiz: <https://atcoder.jp/contests/abc245/tasks/abc245_f>  
Complexidade: `O(n + m)`

Inverta as arestas e rode Kahn: remove quem não tem saída. Sobra = alcança ciclo.

```cpp
// ABC245 F - Endless Walk: inverte as arestas e roda Kahn; quem é removido não anda para sempre
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: kahn() (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<int>> radj(n + 1);
    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; radj[v].push_back(u); }   // seta invertida
    cout << n - (int)kahn(n, radj).size() << '\n';             // sobra = alcança ciclo
}
```

Exemplo testado — entrada:

```text
5 5
1 2
2 3
3 2
1 4
4 5
```

saída:

```text
3
```
