---
title: Dinic
summary: Fluxo máximo.
status: done
complexity: O(V² · E)
tags: fluxo, grafos
---

## Ideia

BFS monta o grafo em níveis; DFS manda fluxo bloqueante só por arestas que sobem um nível.

## Código

```cpp
struct Dinic {
    struct E { int to; ll cap; };
    vector<E> e; vector<vector<int>> g; vector<int> lvl, it;
    Dinic(int n) : g(n), lvl(n), it(n) {}
    void add(int u, int v, ll c) {
        g[u].push_back(e.size()); e.push_back({v, c});
        g[v].push_back(e.size()); e.push_back({u, 0});
    }
    bool bfs(int s, int t) {
        fill(lvl.begin(), lvl.end(), -1); lvl[s] = 0;
        queue<int> q; q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int id : g[u]) if (e[id].cap > 0 && lvl[e[id].to] < 0) lvl[e[id].to] = lvl[u] + 1, q.push(e[id].to);
        }
        return lvl[t] >= 0;
    }
    ll dfs(int u, int t, ll f) {
        if (u == t) return f;
        for (int& i = it[u]; i < (int)g[u].size(); i++) {
            E& x = e[g[u][i]];
            if (x.cap > 0 && lvl[x.to] == lvl[u] + 1)
                if (ll r = dfs(x.to, t, min(f, x.cap))) { x.cap -= r; e[g[u][i] ^ 1].cap += r; return r; }
        }
        return 0;
    }
    ll flow(int s, int t) {
        ll total = 0;
        while (bfs(s, t)) { fill(it.begin(), it.end(), 0); while (ll f = dfs(s, t, LLONG_MAX)) total += f; }
        return total;
    }
};
```

## Uso

`Dinic d(n); d.add(u, v, c); d.flow(s, t);`
