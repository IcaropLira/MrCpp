---
title: Componentes fortemente conexas — Kosaraju
summary: Particiona um digrafo em componentes nas quais todo vértice alcança os demais.
status: done
complexity: O(V + E)
tags: grafos, scc, kosaraju
---

## Quando usar

Condensar um digrafo em uma DAG, detectar ciclos entre grupos de vértices e resolver problemas de alcançabilidade por componentes.

## Ideia

Faça DFS no grafo original e guarde os vértices na ordem de término. Depois percorra o grafo transposto na ordem inversa. Cada DFS da segunda passagem forma uma SCC.

## Código

~~~cpp
struct SCC {
    int n;
    vector<vector<int>> g, rg;
    vector<int> vis, comp, order;

    SCC(int n) : n(n), g(n), rg(n), vis(n), comp(n, -1) {}

    void add_edge(int u, int v) {
        g[u].push_back(v);
        rg[v].push_back(u);
    }

    void dfs1(int u) {
        vis[u] = 1;
        for (int v : g[u]) if (!vis[v]) dfs1(v);
        order.push_back(u);
    }

    void dfs2(int u, int c) {
        comp[u] = c;
        for (int v : rg[u]) if (comp[v] == -1) dfs2(v, c);
    }

    int run() {
        for (int u = 0; u < n; u++)
            if (!vis[u]) dfs1(u);

        reverse(order.begin(), order.end());
        int qtd = 0;
        for (int u : order) if (comp[u] == -1)
            dfs2(u, qtd++);
        return qtd;
    }
};

// comp[u] identifica a SCC de u.
// A condensação é formada ligando comp[u] -> comp[v]
// para cada aresta u -> v com comp[u] != comp[v].
~~~

## Cuidados

- O grafo é dirigido; não confunda componentes fortemente conexas com componentes conexas.
- A condensação das SCCs é sempre um DAG.
- A implementação recursiva pode estourar a pilha em cadeias grandes; use DFS iterativa se necessário.
- IDs das componentes dependem da ordem de execução; não atribua significado numérico a eles.
