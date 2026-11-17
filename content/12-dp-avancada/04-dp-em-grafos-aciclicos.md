---
title: DP em grafos acíclicos
summary: Processar em ordem topológica: maior caminho e número de caminhos a partir de uma origem.
status: done
complexity: O(V + E)
tags: dp, dag, ordem topológica
---

## Ideia

Em um DAG existe uma ordem em que toda aresta vai de um vértice anterior a um posterior. Processando nessa ordem, quando se chega em `v` todos os seus predecessores já têm o valor final. A DP é então uma relaxação por aresta: `best[v] = max(best[u] + w)` e `ways[v] += ways[u]`.

## Código

```cpp
// vértices 0..n-1, g[u] = {(v, w)}; origem s.
// best[v] = maior peso de um caminho s -> v (ou NEG), ways[v] = nº de caminhos (mod MOD)
// devolve false se o grafo tem ciclo
bool dag_dp(const vector<vector<pair<int, ll>>>& g, int s, vector<ll>& best, vector<ll>& ways) {
    const ll NEG = LLONG_MIN / 4, MOD = 1e9 + 7;
    int n = g.size();
    vector<int> in(n, 0), ord;
    for (int u = 0; u < n; u++) for (auto [v, w] : g[u]) in[v]++;
    queue<int> q;
    for (int u = 0; u < n; u++) if (!in[u]) q.push(u);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        ord.push_back(u);
        for (auto [v, w] : g[u]) if (--in[v] == 0) q.push(v);
    }
    if ((int)ord.size() < n) return false;
    best.assign(n, NEG);
    ways.assign(n, 0);
    best[s] = 0; ways[s] = 1;
    for (int u : ord) {
        if (best[u] == NEG) continue;  // inalcançável a partir de s
        for (auto [v, w] : g[u]) {
            best[v] = max(best[v], best[u] + w);
            ways[v] = (ways[v] + ways[u]) % MOD;
        }
    }
    return true;
}
```

## Complexidade e cuidados

- Para o caminho *mínimo* troque `max` por `min` e `NEG` por `INF`; funciona com pesos negativos (ao contrário de Dijkstra).
- Em grafo com ciclo, caminho simples máximo é NP-difícil; aqui a ordem topológica não existe e a função devolve `false`.
- Arestas paralelas contam como caminhos distintos em `ways`.
- Muitos problemas viram DAG: estados de uma DP já são vértices e as transições são arestas.
