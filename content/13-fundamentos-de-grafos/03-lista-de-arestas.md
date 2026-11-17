---
title: Lista de arestas
summary: Vetor de (u, v, w): ideal para ordenar por peso, Kruskal e Bellman-Ford; conversão para adjacência.
status: done
complexity: O(m) de memória; O(m log m) para ordenar
tags: grafos, lista de arestas
---

## Ideia

Guardar só as arestas é a representação mais simples e basta quando o algoritmo percorre *todas* as arestas (Kruskal, Bellman-Ford) ou precisa ordená-las. Para consultar os vizinhos de um vértice, converta para lista de adjacência em `O(n + m)`.

## Código

```cpp
struct Aresta { int u, v; ll w; };

// vértices 0..n-1; se dirigido == false, cada aresta entra nos dois sentidos
vector<vector<pair<int, ll>>> para_adjacencia(int n, const vector<Aresta>& E, bool dirigido) {
    vector<vector<pair<int, ll>>> g(n);
    for (auto& e : E) {
        g[e.u].push_back({e.v, e.w});
        if (!dirigido) g[e.v].push_back({e.u, e.w});
    }
    return g;
}

// grau de cada vértice (não dirigido; laço conta 2)
vector<int> graus(int n, const vector<Aresta>& E) {
    vector<int> d(n, 0);
    for (auto& e : E) d[e.u]++, d[e.v]++;
    return d;
}

// remove laços e deixa só a aresta de menor peso entre cada par não ordenado
vector<Aresta> simplifica(vector<Aresta> E) {
    for (auto& e : E) if (e.u > e.v) swap(e.u, e.v);
    sort(E.begin(), E.end(), [](const Aresta& a, const Aresta& b) {
        return tie(a.u, a.v, a.w) < tie(b.u, b.v, b.w);
    });
    vector<Aresta> r;
    for (auto& e : E)
        if (e.u != e.v && (r.empty() || r.back().u != e.u || r.back().v != e.v)) r.push_back(e);
    return r;
}
```

## Complexidade e cuidados

- `simplifica` trata o grafo como não dirigido; para dirigido, não troque `u` e `v`.
- Guarde também o índice da aresta se precisar identificar qual foi usada (por exemplo em pontes com arestas paralelas).
- Para ordenar por peso: `sort(E.begin(), E.end(), [](auto& a, auto& b){ return a.w < b.w; })`.
- Confira se o enunciado numera os vértices de 0 ou de 1.
