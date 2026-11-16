---
title: Pontes e pontos de articulação
summary: Detecta arestas e vértices cuja remoção aumenta o número de componentes.
status: done
complexity: O(V + E)
tags: grafos, low-link, conectividade
---

## Ideia

Na DFS, tin[u] é o instante de entrada e low[u] é o menor tin alcançável pela subárvore de u, usando arestas de árvore e no máximo uma aresta de retorno.

- A aresta de árvore (u,v) é ponte se low[v] > tin[u].
- Um vértice u não-raiz é articulação se existe filho v com low[v] >= tin[u].
- A raiz é articulação se possui pelo menos dois filhos na floresta DFS.

## Código

~~~cpp
struct Bridges {
    int n, timer = 0;
    vector<vector<pair<int,int>>> g; // {vizinho, id da aresta}
    vector<int> tin, low;
    vector<pair<int,int>> bridges;
    vector<int> articulation;

    Bridges(int n) : n(n), g(n), tin(n, -1), low(n, -1) {}

    void add_edge(int u, int v, int id) {
        g[u].push_back({v, id});
        g[v].push_back({u, id});
    }

    void dfs(int u, int parentEdge = -1) {
        tin[u] = low[u] = timer++;
        int children = 0;
        bool cut = false;
        for (auto [v, id] : g[u]) {
            if (id == parentEdge) continue;
            if (tin[v] != -1) low[u] = min(low[u], tin[v]);
            else {
                dfs(v, id);
                low[u] = min(low[u], low[v]);
                if (low[v] > tin[u]) bridges.push_back({u, v});
                if (parentEdge != -1 && low[v] >= tin[u]) cut = true;
                children++;
            }
        }
        if (parentEdge == -1 && children > 1) cut = true;
        if (cut) articulation.push_back(u);
    }

    void run() {
        for (int u = 0; u < n; u++)
            if (tin[u] == -1) dfs(u);
    }
};

// Passe um ID diferente para cada aresta.
// Ignorar o ID da aresta-pai, e não o vértice-pai,
// é essencial para multigrafos com arestas paralelas.
~~~

## Cuidados

- Funciona em grafos desconexos.
- A identificação por ID trata corretamente arestas paralelas.
- Arestas-ponte podem ser usadas para construir a Bridge Tree.
- A DFS recursiva pode estourar a pilha em grafos muito profundos; use versão iterativa se V for muito grande.
