---
title: Fluxo máximo — Dinic
summary: Calcula o fluxo máximo entre uma fonte e um sorvedouro.
status: done
complexity: O(V²E) geral; O(E√V) em redes unitárias
tags: grafos, fluxo, dinic
---

## Quando usar

Quando cada aresta possui capacidade e queremos maximizar o fluxo de s até t. Também serve como base para cortes mínimos e várias reduções.

## Ideia

BFS constrói o grafo em níveis usando apenas arestas residuais positivas. DFS envia fluxo respeitando os níveis. O ponteiro atual evita reexaminar arestas já saturadas ou inúteis na mesma fase.

## Código

~~~cpp
struct Dinic {
    struct Edge { int to, rev; long long cap; };
    int n;
    vector<vector<Edge>> g;
    vector<int> level, ptr;

    Dinic(int n) : n(n), g(n), level(n), ptr(n) {}

    void add_edge(int u, int v, long long cap) {
        Edge a{v, (int)g[v].size(), cap};
        Edge b{u, (int)g[u].size(), 0};
        g[u].push_back(a);
        g[v].push_back(b);
    }

    bool bfs(int s, int t) {
        fill(level.begin(), level.end(), -1);
        queue<int> q;
        q.push(s); level[s] = 0;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (const Edge& e : g[u])
                if (e.cap > 0 && level[e.to] == -1) {
                    level[e.to] = level[u] + 1;
                    q.push(e.to);
                }
        }
        return level[t] != -1;
    }

    long long dfs(int u, int t, long long pushed) {
        if (pushed == 0) return 0;
        if (u == t) return pushed;
        for (int& cid = ptr[u]; cid < (int)g[u].size(); cid++) {
            Edge& e = g[u][cid];
            if (e.cap <= 0 || level[e.to] != level[u] + 1) continue;
            long long tr = dfs(e.to, t, min(pushed, e.cap));
            if (!tr) continue;
            e.cap -= tr;
            g[e.to][e.rev].cap += tr;
            return tr;
        }
        return 0;
    }

    long long flow(int s, int t) {
        if (s == t) return 0;
        long long ans = 0, pushed;
        const long long INF = (1LL << 62);
        while (bfs(s, t)) {
            fill(ptr.begin(), ptr.end(), 0);
            while ((pushed = dfs(s, t, INF))) ans += pushed;
        }
        return ans;
    }
};
~~~

## Modelagem

- Capacidade de vértice: divida v em v_in e v_out e ligue-os com capacidade desejada.
- Superfonte: conecte uma nova fonte às origens possíveis.
- Supersorvedouro: conecte os destinos possíveis a um novo sorvedouro.
- Corte mínimo: após o fluxo, alcance a partir de s usando arestas residuais positivas.

## Cuidados

- Use long long para capacidades e fluxo total.
- A implementação considera arestas dirigidas; para uma aresta não dirigida, adicione duas arestas dirigidas com a capacidade especificada.
- O bound geral é O(V²E); o desempenho depende da estrutura da rede.
