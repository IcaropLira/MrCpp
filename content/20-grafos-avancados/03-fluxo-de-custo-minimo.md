---
title: Fluxo de custo mínimo
summary: Encontra fluxo de custo mínimo entre fonte e sorvedouro.
status: done
complexity: O(F · V · E) com SPFA por caminho
tags: grafos, fluxo, custo
---

## Quando usar

Quando cada unidade enviada por uma aresta possui custo e queremos enviar o máximo possível ou uma quantidade limitada com custo total mínimo.

## Ideia

Mantemos arestas residuais com custo oposto na reversa. A cada iteração, SPFA encontra o caminho de menor custo residual; enviamos o gargalo desse caminho e atualizamos as capacidades.

## Código

~~~cpp
struct MinCostMaxFlow {
    struct Edge { int to, rev; long long cap, cost; };
    int n;
    vector<vector<Edge>> g;

    MinCostMaxFlow(int n) : n(n), g(n) {}

    void add_edge(int u, int v, long long cap, long long cost) {
        Edge a{v, (int)g[v].size(), cap, cost};
        Edge b{u, (int)g[u].size(), 0, -cost};
        g[u].push_back(a);
        g[v].push_back(b);
    }

    pair<long long,long long> run(int s, int t, long long limit = (1LL<<62)) {
        const long long INF = (1LL<<62);
        long long flow = 0, cost = 0;
        vector<long long> dist(n);
        vector<int> pv(n), pe(n);
        vector<bool> inq(n);

        while (flow < limit) {
            fill(dist.begin(), dist.end(), INF);
            fill(inq.begin(), inq.end(), false);
            queue<int> q;
            dist[s] = 0; q.push(s); inq[s] = true;

            while (!q.empty()) {
                int u = q.front(); q.pop(); inq[u] = false;
                for (int i = 0; i < (int)g[u].size(); i++) {
                    Edge& e = g[u][i];
                    if (e.cap > 0 && dist[e.to] > dist[u] + e.cost) {
                        dist[e.to] = dist[u] + e.cost;
                        pv[e.to] = u; pe[e.to] = i;
                        if (!inq[e.to]) q.push(e.to), inq[e.to] = true;
                    }
                }
            }

            if (dist[t] == INF) break;
            long long add = limit - flow;
            for (int v = t; v != s; v = pv[v])
                add = min(add, g[pv[v]][pe[v]].cap);
            for (int v = t; v != s; v = pv[v]) {
                Edge& e = g[pv[v]][pe[v]];
                e.cap -= add;
                g[v][e.rev].cap += add;
            }
            flow += add;
            cost += add * dist[t];
        }
        return {flow, cost};
    }
};
~~~

## Cuidados

- A resposta é o par {fluxo enviado, custo total}.
- A complexidade é O(FVE) no pior caso, com F como número de caminhos aumentantes.
- SPFA pode ser lento em casos adversariais. Para maior desempenho, use potenciais + Dijkstra.
- A implementação pressupõe ausência de ciclos negativos relevantes que tornem o custo ilimitado.
