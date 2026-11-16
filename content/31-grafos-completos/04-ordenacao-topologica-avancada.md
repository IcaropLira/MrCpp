---
title: Ordenação topológica — variantes e propriedades
summary: Ordem lexicograficamente mínima, unicidade, detecção de ciclo e DP em DAG.
status: done
complexity: O((V + E) log V) lexicográfica; O(V + E) padrão
tags: dag, topologica, kahn, dp
---

## Kahn lexicográfico

Troque a fila por min-heap para obter a menor ordem topológica lexicograficamente. O custo passa a O((V+E) log V).

~~~cpp
vector<int> topo_lexicografica(const vector<vector<int>>& g) {
    int n = g.size();
    vector<int> indeg(n);
    for (auto& adj : g) for (int v : adj) indeg[v]++;

    priority_queue<int, vector<int>, greater<int>> pq;
    for (int u = 0; u < n; u++) if (!indeg[u]) pq.push(u);

    vector<int> ord;
    while (!pq.empty()) {
        int u = pq.top(); pq.pop();
        ord.push_back(u);
        for (int v : g[u])
            if (--indeg[v] == 0) pq.push(v);
    }
    if ((int)ord.size() != n) return {};
    return ord;
}
~~~

## Como saber se a ordem é única

Durante Kahn, se em algum passo houver mais de um vértice com grau de entrada zero, existem pelo menos duas escolhas possíveis e a ordem não é única. Se sempre houver exatamente um, a ordem é única.

~~~cpp
bool topo_unica(const vector<vector<int>>& g) {
    int n = g.size();
    vector<int> in(n);
    for (auto& adj : g) for (int v : adj) in[v]++;
    queue<int> q;
    for (int u = 0; u < n; u++) if (!in[u]) q.push(u);

    int seen = 0;
    bool unique = true;
    while (!q.empty()) {
        if (q.size() > 1) unique = false;
        int u = q.front(); q.pop();
        seen++;
        for (int v : g[u]) if (--in[v] == 0) q.push(v);
    }
    return seen == n && unique;
}
~~~

## DP em DAG

A ordem topológica permite processar estados em uma passagem. Exemplo: caminhos mais longos a partir de s.

~~~cpp
vector<int> longest_path_dag(const vector<vector<int>>& g, int s) {
    const int NEG = -1e9;
    int n = g.size();
    vector<int> dp(n, NEG);
    auto ord = topo_lexicografica(g);
    if ((int)ord.size() != n) return {};
    dp[s] = 0;
    for (int u : ord) if (dp[u] != NEG)
        for (int v : g[u])
            dp[v] = max(dp[v], dp[u] + 1);
    return dp;
}
~~~

## Cuidados

- Uma ordem topológica só existe em DAGs; arestas paralelas não quebram Kahn, mas aumentam o grau de entrada e são decrementadas individualmente.
- Unicidade é propriedade do DAG inteiro, não da ordem escolhida.
- Para contar todas as ordens topológicas, a DP por subconjuntos custa O(2^V V) e só serve para V pequeno.
