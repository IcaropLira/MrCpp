---
title: Fluxo de custo mínimo
summary: Envia fluxo máximo limitado minimizando o custo total com potenciais e Dijkstra.
status: done
complexity: O(F E log V) após inicialização dos potenciais
tags: fluxo, custo minimo, potentials, dijkstra
---

## Quando usar

Quando cada aresta tem capacidade e custo por unidade, e queremos enviar até F unidades de s para t com custo mínimo. Aparece em atribuição, emparelhamento ponderado e alocação.

## Ideia

O custo residual pode ter arestas negativas. Inicialize potenciais com Bellman-Ford a partir de s; depois use Dijkstra com custos reduzidos c'(u,v)=c(u,v)+pot[u]-pot[v], que são não negativos quando não há ciclo negativo relevante. Após cada caminho mínimo, atualize os potenciais dos vértices alcançados e aumente o fluxo pelo gargalo.

## Código

~~~cpp
struct MinCostMaxFlow {
    struct Edge { int to, rev; long long cap, cost; };
    int n;
    vector<vector<Edge>> g;
    const long long INF = (1LL << 62);

    MinCostMaxFlow(int n) : n(n), g(n) {}

    void add_edge(int u, int v, long long cap, long long cost) {
        Edge a{v, (int)g[v].size(), cap, cost};
        Edge b{u, (int)g[u].size(), 0, -cost};
        g[u].push_back(a);
        g[v].push_back(b);
    }

    pair<long long,long long> flow(int s, int t, long long maxf) {
        vector<long long> pot(n, INF);
        pot[s] = 0;

        // Bellman-Ford inicial para permitir custos negativos.
        for (int it = 0; it < n - 1; it++) {
            bool change = false;
            for (int u = 0; u < n; u++) if (pot[u] < INF)
                for (const Edge& e : g[u])
                    if (e.cap > 0 && pot[e.to] > pot[u] + e.cost) {
                        pot[e.to] = pot[u] + e.cost;
                        change = true;
                    }
            if (!change) break;
        }
        for (auto& x : pot) if (x == INF) x = 0;

        long long sent = 0, cost = 0;
        while (sent < maxf) {
            vector<long long> dist(n, INF);
            vector<int> pv(n, -1), pe(n, -1);
            priority_queue<pair<long long,int>,
                vector<pair<long long,int>>, greater<pair<long long,int>>> pq;
            dist[s] = 0;
            pq.push({0, s});

            while (!pq.empty()) {
                auto [d, u] = pq.top(); pq.pop();
                if (d != dist[u]) continue;
                for (int i = 0; i < (int)g[u].size(); i++) {
                    const Edge& e = g[u][i];
                    if (!e.cap) continue;
                    long long nd = d + e.cost + pot[u] - pot[e.to];
                    if (nd < dist[e.to]) {
                        dist[e.to] = nd;
                        pv[e.to] = u;
                        pe[e.to] = i;
                        pq.push({nd, e.to});
                    }
                }
            }

            if (dist[t] == INF) break;
            for (int v = 0; v < n; v++)
                if (dist[v] < INF) pot[v] += dist[v];

            long long add = maxf - sent;
            for (int v = t; v != s; v = pv[v])
                add = min(add, g[pv[v]][pe[v]].cap);

            for (int v = t; v != s; v = pv[v]) {
                Edge& e = g[pv[v]][pe[v]];
                cost += add * e.cost;
                e.cap -= add;
                g[v][e.rev].cap += add;
            }
            sent += add;
        }
        return {sent, cost};
    }
};
~~~

## Cuidados

- Retorna {fluxo enviado, custo total}; pode enviar menos que maxf se não houver capacidade suficiente.
- Bellman-Ford inicial pressupõe ausência de ciclos negativos alcançáveis com capacidade residual positiva. Ciclos negativos exigem cancelamento de ciclos ou outra formulação.
- Depois da primeira fase, custos reduzidos permitem Dijkstra; não rode Dijkstra diretamente nos custos residuais negativos.
- O custo total pode exceder int; use long long e verifique overflow no produto fluxo*custo.
- Para atribuição bipartida, modele fonte -> agentes -> tarefas -> sorvedouro com capacidades 1.
