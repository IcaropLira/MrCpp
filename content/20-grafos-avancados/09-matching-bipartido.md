---
title: Matching bipartido — Hopcroft-Karp
summary: Encontra um emparelhamento máximo em grafo bipartido.
status: done
complexity: O(E √V)
tags: grafos, matching, bipartido
---

## Quando usar

Quando vértices de duas partições representam objetos de tipos distintos e uma aresta indica compatibilidade. Queremos escolher o maior conjunto de pares sem repetir vértices.

## Ideia

BFS encontra a menor distância até vértices livres da direita. DFS aumenta vários caminhos alternantes disjuntos em cada fase, em vez de procurar um caminho por vez.

## Código

~~~cpp
struct HopcroftKarp {
    int n, m;
    vector<vector<int>> g;
    vector<int> L, R, dist;

    HopcroftKarp(int n, int m) : n(n), m(m), g(n), L(n, -1), R(m, -1), dist(n) {}

    void add_edge(int u, int v) { // u na esquerda, v na direita
        g[u].push_back(v);
    }

    bool bfs() {
        queue<int> q;
        const int INF = 1e9;
        for (int u = 0; u < n; u++) {
            if (L[u] == -1) dist[u] = 0, q.push(u);
            else dist[u] = INF;
        }

        int found = INF;
        while (!q.empty()) {
            int u = q.front(); q.pop();
            if (dist[u] >= found) continue;
            for (int v : g[u]) {
                int w = R[v];
                if (w == -1) found = dist[u] + 1;
                else if (dist[w] == INF) {
                    dist[w] = dist[u] + 1;
                    q.push(w);
                }
            }
        }
        return found != INF;
    }

    bool dfs(int u) {
        for (int v : g[u]) {
            int w = R[v];
            if (w == -1 || (dist[w] == dist[u] + 1 && dfs(w))) {
                L[u] = v;
                R[v] = u;
                return true;
            }
        }
        dist[u] = 1e9;
        return false;
    }

    int matching() {
        int ans = 0;
        while (bfs())
            for (int u = 0; u < n; u++)
                if (L[u] == -1 && dfs(u)) ans++;
        return ans;
    }
};

// L[u] é o par de u na esquerda; R[v] é o par de v na direita.
~~~

## Cuidados

- Os índices das duas partições são independentes: esquerda [0,n), direita [0,m).
- A complexidade O(E√V) vale para a implementação clássica de Hopcroft-Karp.
- A implementação acima usa DFS recursiva; em grafos bipartidos muito profundos, considere versão iterativa.
- Para recuperar os pares, percorra L e selecione os u com L[u] != -1.
