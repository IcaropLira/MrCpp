---
title: Caminho mais longo a partir de cada nó
summary: Para cada vértice, a maior distância até outro vértice, usando as pontas do diâmetro.
status: done
complexity: O(n)
tags: árvores, diâmetro, excentricidade
---

## Ideia

A vértice mais distante de qualquer nó é sempre uma das duas pontas de algum diâmetro. Logo, achando as pontas `a` e `b` do diâmetro (duas buscas: de qualquer nó até `a`, de `a` até `b`), a resposta de `v` é `max(dist(a, v), dist(b, v))`. Vale para pesos não negativos.

## Código

```cpp
// árvore com vértices 0..n-1, g[u] = {(v, w)}, w >= 0. Devolve, para cada v, a maior distância até outro vértice
vector<ll> excentricidades(const vector<vector<pair<int, ll>>>& g) {
    int n = g.size();
    auto dists = [&](int s) {
        vector<ll> d(n, -1);
        vector<int> pilha = {s};
        d[s] = 0;
        while (!pilha.empty()) {
            int u = pilha.back(); pilha.pop_back();
            for (auto [v, w] : g[u])
                if (d[v] < 0) d[v] = d[u] + w, pilha.push_back(v);
        }
        return d;
    };
    auto mais_longe = [&](const vector<ll>& d) { return int(max_element(d.begin(), d.end()) - d.begin()); };
    vector<ll> d0 = dists(0);
    int a = mais_longe(d0);
    vector<ll> da = dists(a);
    int b = mais_longe(da);
    vector<ll> db = dists(b);
    vector<ll> r(n);
    for (int v = 0; v < n; v++) r[v] = max(da[v], db[v]);
    return r;
}
```

## Complexidade e cuidados

- Com `n = 1` a resposta é 0.
- O menor valor de `r` é o raio e o vértice que o atinge é um centro da árvore.
- Para outras funções que dependem da raiz (soma de distâncias, por exemplo) use *rerooting*: um DFS para baixo e outro para cima.
- Não vale com pesos negativos.
