---
title: Pontes (bridges)
summary: Arestas cuja remoção aumenta o número de componentes conexos de um grafo não direcionado.
status: done
complexity: O(V + E)
tags: grafos, low-link, pontes, dfs
---

## Ideia

Na DFS, tin[v] é o instante em que v foi descoberto. low[v] é o menor tin alcançável a partir da subárvore de v usando arestas da árvore DFS e, no máximo, uma aresta de retorno.

Para uma aresta de árvore v-u, com u filho de v:

- Se low[u] > tin[v], não existe caminho alternativo da subárvore de u até v ou algum ancestral de v: a aresta (v,u) é ponte.
- Se low[u] <= tin[v], existe uma rota alternativa e a aresta não é ponte.

## Implementação que também trata arestas paralelas

Em multigrafos, ignorar apenas o vértice pai é incorreto: uma segunda aresta paralela até o pai é uma aresta de retorno válida. Guarde o id de cada aresta e ignore somente a aresta exata usada para chegar ao vértice.

```cpp
vector<vector<pair<int,int>>> g; // {vizinho, id da aresta}
vector<int> tin, low;
vector<pair<int,int>> bridges;
int timer;

void dfs(int u, int parentEdge) {
    tin[u] = low[u] = timer++;

    for (auto [v,id] : g[u]) {
        if (id == parentEdge) continue;

        if (tin[v] != -1) {
            low[u] = min(low[u], tin[v]);
        } else {
            dfs(v, id);
            low[u] = min(low[u], low[v]);
            if (low[v] > tin[u])
                bridges.push_back({u,v});
        }
    }
}

void find_bridges(int n, const vector<pair<int,int>>& edges) {
    g.assign(n, {});
    for (int id = 0; id < (int)edges.size(); id++) {
        auto [u,v] = edges[id];
        g[u].push_back({v,id});
        g[v].push_back({u,id});
    }

    tin.assign(n, -1);
    low.assign(n, 0);
    bridges.clear();
    timer = 0;

    for (int v = 0; v < n; v++)
        if (tin[v] == -1) dfs(v, -1);
}
```

A entrada de arestas deve estar 0-based. O laço externo também cobre grafos desconexos. Cada aresta recebe um id único, inclusive arestas paralelas.

## Complexidade

- Cada vértice é descoberto uma vez: O(V).
- Cada incidência de aresta é examinada uma vez: O(E).
- Tempo total: O(V+E); memória: O(V+E).

## Pontos de articulação

A mesma DFS encontra pontos de articulação:

- Vértice raiz da DFS: é articulação se tiver pelo menos dois filhos na árvore DFS.
- Vértice não raiz v: é articulação se existir filho u com low[u] >= tin[v].

A desigualdade é diferente da ponte: para ponte usamos >; para articulação não raiz usamos >=.

## Cuidados

1. O grafo deve ser não direcionado.
2. Não use a condição de ponte em grafo direcionado.
3. Trate cada componente conexa.
4. Em multigrafos, ignore a aresta pai pelo id, não todas as arestas para o vértice pai.
5. Timer e vetores devem ser reinicializados a cada caso de teste.
