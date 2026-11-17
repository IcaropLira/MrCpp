---
title: Edmonds-Karp
summary: Ford-Fulkerson com BFS: sempre o caminho de aumento mais curto; O(V·E²) independente das capacidades.
status: done
complexity: O(V · E²)
tags: fluxo, edmonds-karp, bfs, corte mínimo
---

## Ideia

Trocar a DFS por uma BFS escolhe o caminho de aumento com menos arestas. Isso garante no máximo `O(V · E)` aumentos, cada um custando `O(E)`, sem depender do valor das capacidades. Depois do fluxo, os vértices alcançáveis de `s` no grafo residual formam o lado `S` de um corte mínimo.

## Código

```cpp
struct EdmondsKarp {
    struct Aresta { int to; ll cap; };
    vector<Aresta> a;
    vector<vector<int>> g;
    EdmondsKarp(int n) : g(n) {}

    void add(int u, int v, ll c) {
        g[u].push_back(a.size()); a.push_back({v, c});
        g[v].push_back(a.size()); a.push_back({u, 0});
    }
    // vértices 0..n-1, s != t
    ll fluxo(int s, int t) {
        int n = g.size();
        ll total = 0;
        while (true) {
            vector<int> via(n, -1);  // aresta usada para chegar em cada vértice
            queue<int> q;
            q.push(s);
            via[s] = -2;
            while (!q.empty() && via[t] == -1) {
                int u = q.front(); q.pop();
                for (int id : g[u])
                    if (a[id].cap > 0 && via[a[id].to] == -1) via[a[id].to] = id, q.push(a[id].to);
            }
            if (via[t] == -1) break;
            ll f = LLONG_MAX;
            for (int v = t; v != s; v = a[via[v] ^ 1].to) f = min(f, a[via[v]].cap);
            for (int v = t; v != s; v = a[via[v] ^ 1].to) a[via[v]].cap -= f, a[via[v] ^ 1].cap += f;
            total += f;
        }
        return total;
    }
    // após fluxo(s, t): lado S do corte mínimo (alcançáveis de s no resíduo)
    vector<bool> lado_s(int s) {
        vector<bool> ok(g.size(), false);
        vector<int> pilha = {s};
        ok[s] = true;
        while (!pilha.empty()) {
            int u = pilha.back(); pilha.pop_back();
            for (int id : g[u])
                if (a[id].cap > 0 && !ok[a[id].to]) ok[a[id].to] = true, pilha.push_back(a[id].to);
        }
        return ok;
    }
};
```

## Complexidade e cuidados

- Para grafos grandes prefira Dinic (`21-fluxos-e-emparelhamentos/03-dinic`), que é bem mais rápido na prática.
- O corte mínimo é formado pelas arestas originais de `S` para fora de `S`; sua capacidade total é igual ao fluxo.
- Para recuperar o fluxo em cada aresta original: `cap_original - cap_residual`, ou a capacidade da aresta reversa.
- Vários `s` ou `t`: crie uma super-fonte e um super-sumidouro com capacidade infinita.
