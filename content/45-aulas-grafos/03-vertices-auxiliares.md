---
title: Vértices auxiliares e grafo de estados (aula)
summary: Ponte aluno–música, vértice de entrada/saída, cupom (2 camadas), Bicycles e Micro-ondas (K+1 camadas).
status: done
complexity: O((V + E) log E) no grafo transformado
tags: modelagem, vértices auxiliares, grafo de estados, dijkstra, camadas, aula
---

## Dijkstra

```cpp
// Dijkstra O((n + m) log m); vértices 1..n
vector<long long> dijkstra(int n, const vector<vector<pair<int,long long>>> &adj, int s) {
    const long long INF = LLONG_MAX / 4;
    vector<long long> dist(n + 1, INF);
    priority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;
    dist[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [d, v] = pq.top(); pq.pop();
        if (d > dist[v]) continue;                      // entrada velha
        for (auto [to, c] : adj[v]) if (d + c < dist[to]) { dist[to] = d + c; pq.push({dist[to], to}); }
    }
    return dist;
}
```

### Grupos de conversa (alunos e músicas)

Complexidade: `O(n + m + ΣS)`

Em vez de `O(n²)` arestas aluno–aluno, um vértice por música: aluno — música — aluno. Arestas = soma dos conjuntos.

```cpp
// Grupos de conversa: aluno -- música (vértice auxiliar) -- aluno. Arestas: soma dos conjuntos.
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<int>> adj(n + m + 1);                 // alunos 1..n, músicas n+1..n+m
    for (int i = 1; i <= n; i++) {
        int k; cin >> k;
        while (k--) { int mu; cin >> mu; adj[i].push_back(n + mu); adj[n + mu].push_back(i); }
    }
    vector<bool> vis(n + m + 1, false);
    int ans = 0;
    for (int i = 1; i <= n; i++) if (!vis[i]) {         // só conta componentes que têm aluno
        ans++; vis[i] = true;
        vector<int> st = {i};
        while (!st.empty()) {
            int v = st.back(); st.pop_back();
            for (int u : adj[v]) if (!vis[u]) { vis[u] = true; st.push_back(u); }
        }
    }
    cout << ans << '\n';
}
```

Exemplo testado — entrada:

```text
4 5
2 1 2
2 2 3
2 3 4
1 5
```

saída:

```text
2
```


### Menor caminho com trânsito (peso no vértice)

Complexidade: `O((n + m) log m)`

Cada cidade vira `v_in → v_out` com custo `A[v]`; estrada `v—u` vira `v_out → u_in` e `u_out → v_in`. Resposta `dist[N_out]`.

```cpp
// Peso no vértice: cada cidade v vira v(in) -> v(out) com custo A[v]; estrada v-u vira v(out)->u(in) e u(out)->v(in)
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: dijkstra() (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<pair<int,long long>>> adj(2 * n + 1);   // v: entrada, v + n: saída
    for (int v = 1; v <= n; v++) { long long a; cin >> a; adj[v].push_back({v + n, a}); }
    for (int i = 0; i < m; i++) {
        int v, u; long long w; cin >> v >> u >> w;
        adj[v + n].push_back({u, w});
        adj[u + n].push_back({v, w});
    }
    cout << dijkstra(2 * n, adj, 1)[2 * n] << '\n';       // 1(in) -> N(out)
}
```

Exemplo testado — entrada:

```text
4 4
3 2 9 1
1 2 5
2 4 3
1 3 1
3 4 1
```

saída:

```text
14
```


### Flight Discount (CSES 1195)

Juiz: <https://cses.fi/problemset/task/1195>  
Complexidade: `O((n + m) log m)`

Estado `(v, usou?)`: duas cópias; seta `(a,0) → (b,1)` com `⌊c/2⌋`, sem volta.

```cpp
// CSES 1195 - Flight Discount: grafo de estados (v, usou cupom?) -> 2 camadas, seta 0 -> 1 com c/2
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: dijkstra() (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<pair<int,long long>>> adj(2 * n + 1);   // v: sem cupom, v + n: com cupom
    for (int i = 0; i < m; i++) {
        int a, b; long long c; cin >> a >> b >> c;
        adj[a].push_back({b, c});                         // camada 0
        adj[a + n].push_back({b + n, c});                 // camada 1
        adj[a].push_back({b + n, c / 2});                 // usa o cupom: só desce
    }
    auto d = dijkstra(2 * n, adj, 1);
    cout << min(d[n], d[2 * n]) << '\n';
}
```

Exemplo testado — entrada:

```text
3 4
1 2 3
2 3 1
1 3 7
2 1 5
```

saída:

```text
2
```


### Bicycles (CF 1915G)

Juiz: <https://codeforces.com/problemset/problem/1915/G>  
Complexidade: `O(n·m·log(n·m))`

Estado `(cidade, bike em uso)`; ao chegar em `v` pode trocar para a bike de `v` (vale a pena só se for mais rápida).

```cpp
// CF 1915G - Bicycles: estado (cidade, bike que está usando). Dijkstra em n*n estados.
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n, m; cin >> n >> m;
        vector<vector<pair<int,ll>>> g(n + 1);
        for (int i = 0; i < m; i++) { int u, v; ll w; cin >> u >> v >> w; g[u].push_back({v, w}); g[v].push_back({u, w}); }
        vector<ll> s(n + 1); for (int i = 1; i <= n; i++) cin >> s[i];
        const ll INF = LLONG_MAX / 4;
        vector<vector<ll>> dist(n + 1, vector<ll>(n + 1, INF));   // dist[v][b]
        priority_queue<tuple<ll,int,int>, vector<tuple<ll,int,int>>, greater<>> pq;
        dist[1][1] = 0; pq.push({0, 1, 1});
        while (!pq.empty()) {
            auto [d, v, b] = pq.top(); pq.pop();
            if (d > dist[v][b]) continue;
            int nb = (s[v] < s[b] ? v : b);              // troca para a bike de v se for melhor (custo 0)
            for (auto [u, w] : g[v]) {
                ll nd = d + w * s[nb];
                if (nd < dist[u][nb]) { dist[u][nb] = nd; pq.push({nd, u, nb}); }
            }
        }
        cout << *min_element(dist[n].begin() + 1, dist[n].end()) << '\n';
    }
}
```

Exemplo testado — entrada:

```text
1
3 2
1 2 2
1 3 10
4 1 5
```

saída:

```text
20
```


### Micro-ondas (Gym 106679 M)

Juiz: <https://codeforces.com/gym/106679/problem/M>  
Complexidade: `O(K (N + M) log(K M))`

No máximo K links especiais → K+1 camadas; link de micro-ondas sobe de camada.

```cpp
// Gym 106679 M - Micro-ondas: no máximo K links de micro-ondas -> K+1 camadas (v, k)
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: dijkstra() (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m, K; cin >> n >> m >> K;
    vector<vector<pair<int,long long>>> adj((K + 1) * n + 1);     // (v, k) -> v + k*n
    for (int e = 0; e < m; e++) {
        int i, j; long long f, w; cin >> i >> j >> f >> w;
        for (int k = 0; k <= K; k++) {
            adj[i + k * n].push_back({j + k * n, f});              // fibra: mesma camada
            adj[j + k * n].push_back({i + k * n, f});
            if (w != -1 && k < K) {                                // micro-ondas: k -> k+1
                adj[i + k * n].push_back({j + (k + 1) * n, w});
                adj[j + k * n].push_back({i + (k + 1) * n, w});
            }
        }
    }
    auto d = dijkstra((K + 1) * n, adj, 1);
    long long ans = LLONG_MAX;
    for (int k = 0; k <= K; k++) ans = min(ans, d[n + k * n]);
    cout << ans << '\n';
}
```

Exemplo testado — entrada:

```text
3 3 1
1 2 4 1
2 3 4 1
1 3 7 -1
```

saída:

```text
5
```
