---
title: Pontes, bridge forest e cortes
summary: Constrói a floresta de componentes 2-arestas-conexas e explica consultas após remoção de pontes.
status: done
complexity: O(V + E) para construir; O(log V) com LCA para consultas de distância
tags: pontes, bridge tree, lowlink, cortes
---

## Bridge forest

Depois de encontrar todas as pontes, remova-as conceitualmente e pinte cada componente conexa restante com um ID. Cada ponte vira uma aresta entre dois IDs. O resultado é uma floresta.

~~~cpp
// g: lista de {vizinho, id}; isBridge[id]: marcado pela DFS de pontes.
vector<int> comp(n, -1);
int comps = 0;

function<void(int)> paint = [&](int u) {
    comp[u] = comps;
    for (auto [v, id] : g[u])
        if (!isBridge[id] && comp[v] == -1) paint(v);
};

for (int u = 0; u < n; u++)
    if (comp[u] == -1) {
        paint(u);
        comps++;
    }

vector<vector<int>> forest(comps);
for (int id = 0; id < m; id++) if (isBridge[id]) {
    auto [u, v] = edges[id];
    forest[comp[u]].push_back(comp[v]);
    forest[comp[v]].push_back(comp[u]);
}
~~~

## Aplicações

- Número de pontes entre duas componentes: distância na floresta.
- Pontes que separam dois vértices: arestas no caminho único entre suas componentes.
- Consultas de conectividade após remoção de pontes: compare as componentes e a separação na floresta.

## Não confundir

- Bridge forest contrai componentes 2-arestas-conexas.
- Block-cut tree contrai componentes biconexas por vértices e mantém nós de articulação.
- A DFS de pontes deve ignorar a aresta pai pelo ID, não pelo vértice.

## Cuidados

A floresta pode ter várias componentes; LCA precisa tratar cada raiz. isBridge deve ser indexado pelos IDs originais das arestas.
