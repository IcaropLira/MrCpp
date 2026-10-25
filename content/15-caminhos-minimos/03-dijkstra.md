---
title: Dijkstra
summary: Caminhos mínimos com pesos não negativos.
status: done
complexity: O((V + E) log V)
tags: grafos, caminho mínimo
---

## Ideia

Sempre expande o vértice com menor distância conhecida. A fila de prioridade pode ter entradas antigas, que são ignoradas.

## Código

```cpp
const ll INF = 1e18;
vector<ll> dijkstra(const vector<vector<pair<int, ll>>>& g, int s) {
    vector<ll> d(g.size(), INF);
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    d[s] = 0; pq.push({0, s});
    while (!pq.empty()) {
        auto [du, u] = pq.top(); pq.pop();
        if (du > d[u]) continue;
        for (auto [v, w] : g[u])
            if (d[u] + w < d[v]) d[v] = d[u] + w, pq.push({d[v], v});
    }
    return d;
}
```

## Uso

Com pesos negativos, use Bellman-Ford.
