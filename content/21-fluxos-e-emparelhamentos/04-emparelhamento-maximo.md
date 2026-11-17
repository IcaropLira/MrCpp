---
title: Emparelhamento máximo (Kuhn)
summary: Emparelhamento máximo em grafo bipartido por caminhos de aumento com DFS.
status: done
complexity: O(V · E)
tags: emparelhamento, bipartido, kuhn, caminhos de aumento
---

## Ideia

Para cada vértice `u` da esquerda tente achar um caminho alternante: para um vizinho `v` livre, emparelhe; se `v` já está emparelhado com `w`, tente reemparelhar `w` em outro lugar (recursivamente). Cada tentativa bem-sucedida aumenta o emparelhamento em 1. O resultado é máximo porque, pelo teorema de Berge, só é máximo quando não há caminho de aumento.

## Código

```cpp
struct Kuhn {
    int nl, nr;
    vector<vector<int>> adj;  // adj[u] = vizinhos da direita (0..nr-1), u na esquerda (0..nl-1)
    vector<int> ml, mr, vis;  // parceiro de cada lado (-1 se livre)
    int marca = 0;
    Kuhn(int nl, int nr) : nl(nl), nr(nr), adj(nl), ml(nl, -1), mr(nr, -1), vis(nr, 0) {}

    void add(int u, int v) { adj[u].push_back(v); }
    bool tenta(int u) {
        for (int v : adj[u]) {
            if (vis[v] == marca) continue;
            vis[v] = marca;
            if (mr[v] < 0 || tenta(mr[v])) { ml[u] = v; mr[v] = u; return true; }
        }
        return false;
    }
    int resolve() {
        int res = 0;
        for (int u = 0; u < nl; u++) { marca++; res += tenta(u); }
        return res;
    }
};
```

## Complexidade e cuidados

- `vis` usa uma marca por tentativa, então não precisa ser zerado `O(nr)` a cada `u`.
- Para grafos grandes (`1e5`) use Hopcroft-Karp, `O(E √V)`.
- Cobertura mínima de vértices e conjunto independente máximo saem do emparelhamento pelo teorema de König.
- A recursão tem profundidade até `nl`; em cadeias muito longas converta para versão iterativa.
