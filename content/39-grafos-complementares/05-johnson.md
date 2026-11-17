---
title: Johnson
summary: Caminhos mínimos entre todos os pares com pesos negativos, via Bellman-Ford e Dijkstra.
status: done
complexity: O(V·E + V·E log V)
tags: grafos, caminhos minimos, johnson, bellman-ford, dijkstra
---

## Ideia

Floyd-Warshall custa O(V³). Em grafos esparsos, Johnson faz melhor: Bellman-Ford a partir de uma origem virtual ligada a todos com peso 0 dá potenciais `h[v]`. Reponderar `w'(u,v) = w(u,v) + h[u] - h[v]` deixa todas as arestas não negativas sem alterar quais caminhos são mínimos. Dijkstra de cada vértice resolve o resto, e a distância real é `d'(s,t) - h[s] + h[t]`.

## Código

```cpp
const ll INF = LLONG_MAX / 4;

struct Edge { int u, v; ll w; };

// vértices 0..n-1, arestas dirigidas. Devolve false se há ciclo negativo.
// D[s][t] = distância mínima, ou INF se t é inalcançável a partir de s
bool johnson(int n, const vector<Edge>& E, vector<vector<ll>>& D) {
    vector<ll> h(n, 0);  // origem virtual: todos começam com 0
    for (int it = 0; it < n; it++) {
        bool ch = false;
        for (auto& e : E) if (h[e.u] + e.w < h[e.v]) h[e.v] = h[e.u] + e.w, ch = true;
        if (!ch) break;
        if (it == n - 1) return false;
    }
    vector<vector<pair<int, ll>>> g(n);
    for (auto& e : E) g[e.u].push_back({e.v, e.w + h[e.u] - h[e.v]});
    D.assign(n, vector<ll>(n, INF));
    for (int s = 0; s < n; s++) {
        priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
        vector<ll>& d = D[s];
        d[s] = 0; pq.push({0, s});
        while (!pq.empty()) {
            auto [du, u] = pq.top(); pq.pop();
            if (du > d[u]) continue;
            for (auto [v, w] : g[u]) if (du + w < d[v]) d[v] = du + w, pq.push({d[v], v});
        }
        for (int t = 0; t < n; t++) if (d[t] < INF) d[t] += h[t] - h[s];
    }
    return true;
}
```

## Uso

`vector<vector<ll>> D; if (!johnson(n, E, D)) { /* ciclo negativo */ }`

## Complexidade e cuidados

- Vértices de 0 a n-1; grafo dirigido (para não dirigido com peso negativo, a aresta já é um ciclo negativo).
- Bellman-Ford com `n` relaxações sobre as `n` rodadas; mudança na última rodada indica ciclo negativo, em qualquer parte do grafo (a origem virtual alcança tudo).
- Pesos reponderados são ≥ 0, condição necessária para o Dijkstra.
- Memória O(V²) para a matriz; se só precisa de algumas origens, rode Dijkstra apenas nelas.
- Para grafos densos, Floyd-Warshall é mais simples.
