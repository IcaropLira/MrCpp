---
title: Ford-Fulkerson
summary: Fluxo máximo achando caminhos de aumento com DFS no grafo residual.
status: done
complexity: O(E · F), F = valor do fluxo
tags: fluxo, ford-fulkerson, grafo residual
---

## Ideia

Cada aresta `u -> v` de capacidade `c` ganha uma aresta reversa `v -> u` de capacidade 0 (o resíduo). Enquanto existir um caminho de `s` a `t` só com arestas de capacidade residual positiva, empurre o gargalo (mínimo ao longo do caminho): reduza a capacidade das arestas usadas e aumente a das reversas. O fluxo termina quando não há mais caminho e seu valor é o fluxo máximo, igual ao corte mínimo.

## Código

```cpp
struct FordFulkerson {
    struct Aresta { int to; ll cap; };
    vector<Aresta> a;          // a[i ^ 1] é a aresta reversa de a[i]
    vector<vector<int>> g;     // g[u] = índices em a
    vector<int> vis;
    int marca = 0;
    FordFulkerson(int n) : g(n), vis(n, 0) {}

    void add(int u, int v, ll c) {
        g[u].push_back(a.size()); a.push_back({v, c});
        g[v].push_back(a.size()); a.push_back({u, 0});
    }
    ll dfs(int u, int t, ll f) {
        if (u == t) return f;
        vis[u] = marca;
        for (int id : g[u]) {
            Aresta& e = a[id];
            if (e.cap > 0 && vis[e.to] != marca) {
                ll r = dfs(e.to, t, min(f, e.cap));
                if (r > 0) { e.cap -= r; a[id ^ 1].cap += r; return r; }
            }
        }
        return 0;
    }
    // vértices 0..n-1, s != t
    ll fluxo(int s, int t) {
        ll total = 0;
        while (true) {
            marca++;
            ll f = dfs(s, t, LLONG_MAX);
            if (!f) break;
            total += f;
        }
        return total;
    }
};
```

## Complexidade e cuidados

- O número de aumentos pode chegar ao valor do fluxo (`F`), então com capacidades grandes e caminhos ruins fica lento; Edmonds-Karp e Dinic removem essa dependência.
- Capacidades precisam ser inteiras (com reais o método pode nem terminar).
- Arestas paralelas e antiparalelas funcionam: cada uma ganha seu par de resíduo.
- `s` e `t` devem ser diferentes.
