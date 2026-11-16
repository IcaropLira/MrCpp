---
title: SCC incremental por inserções — baseline
summary: Mantém componentes fortemente conexas após inserções de arestas recomputando Kosaraju; referência correta para limites pequenos.
status: done
complexity: O(Q(V + E))
tags: grafos, scc, incremental, kosaraju
---

## Quando usar

Quando arestas são apenas inseridas e há consultas após cada inserção, mas os limites são pequenos o suficiente para recomputar SCC. É uma solução incremental correta, porém não é o algoritmo online otimizado.

## Ideia

Inserir arestas nunca separa uma SCC: componentes podem apenas se fundir. A cada atualização, reconstrua as SCCs e, se necessário, a DAG de condensação. Para Q atualizações, o custo total é O(Q(V+E)).

## Código

~~~cpp
struct SCC {
    int n;
    vector<vector<int>> g, rg;
    vector<int> comp, order;

    SCC(int n) : n(n), g(n), rg(n) {}

    void add_edge(int u, int v) {
        g[u].push_back(v);
        rg[v].push_back(u);
    }

    void dfs1(int u, vector<char>& vis) {
        vis[u] = 1;
        for (int v : g[u]) if (!vis[v]) dfs1(v, vis);
        order.push_back(u);
    }

    void dfs2(int u, int c) {
        comp[u] = c;
        for (int v : rg[u]) if (comp[v] == -1) dfs2(v, c);
    }

    int build() {
        vector<char> vis(n);
        order.clear();
        for (int u = 0; u < n; u++)
            if (!vis[u]) dfs1(u, vis);

        comp.assign(n, -1);
        int cnt = 0;
        reverse(order.begin(), order.end());
        for (int u : order)
            if (comp[u] == -1) dfs2(u, cnt++);
        return cnt;
    }

    bool same(int u, int v) const {
        return comp[u] == comp[v];
    }
};
~~~

## Uso

Depois de cada add_edge(u,v), chame build(). same(u,v) só deve ser usado após a última reconstrução.

## Limites e observações

- Este arquivo não afirma oferecer SCC incremental em O(log n) ou amortizado sublinear: cada build é Kosaraju completo.
- Para muitas atualizações em grafos grandes, use algoritmo especializado de SCC incremental ou reformule o problema offline.
- A recursão pode estourar a pilha em grafos profundos; use DFS iterativa quando necessário.
