---
title: Detectando ciclos
summary: Ciclo em grafo não dirigido (DSU) e em dirigido (DFS com três cores, devolvendo o ciclo).
status: done
complexity: O(n + m)
tags: grafos, ciclos, dfs, dsu
---

## Ideia

Em um grafo não dirigido, uma aresta que liga dois vértices já no mesmo componente fecha ciclo; o DSU detecta isso ao unir. Em um grafo dirigido, faça DFS com três estados (não visitado, na pilha, concluído): uma aresta para um vértice *na pilha* é uma aresta de retorno e fecha um ciclo, que se recupera seguindo os pais.

## Código

```cpp
struct DSU {
    vector<int> p;
    DSU(int n) : p(n) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    bool unite(int a, int b) { a = find(a), b = find(b); if (a == b) return false; p[a] = b; return true; }
};

// não dirigido, vértices 0..n-1; arestas paralelas e laços contam como ciclo
bool tem_ciclo_nao_dirigido(int n, const vector<pair<int, int>>& E) {
    DSU d(n);
    for (auto [u, v] : E) if (!d.unite(u, v)) return true;
    return false;
}

// dirigido: devolve os vértices de um ciclo (na ordem das arestas), ou vazio se é um DAG
vector<int> acha_ciclo(const vector<vector<int>>& g) {
    int n = g.size();
    vector<int> estado(n, 0), pai(n, -1), it(n, 0);  // 0 novo, 1 na pilha, 2 concluído
    for (int s = 0; s < n; s++) {
        if (estado[s]) continue;
        vector<int> pilha = {s};
        estado[s] = 1;
        while (!pilha.empty()) {
            int u = pilha.back();
            if (it[u] < (int)g[u].size()) {
                int v = g[u][it[u]++];
                if (estado[v] == 0) estado[v] = 1, pai[v] = u, pilha.push_back(v);
                else if (estado[v] == 1) {  // aresta de retorno u -> v
                    vector<int> ciclo = {v};
                    for (int x = u; x != v; x = pai[x]) ciclo.push_back(x);
                    reverse(ciclo.begin() + 1, ciclo.end());
                    return ciclo;
                }
            } else estado[u] = 2, pilha.pop_back();
        }
    }
    return {};
}
```

## Complexidade e cuidados

- Com DFS em grafo *não dirigido* é preciso ignorar a aresta do pai (por id, não por vértice, se há arestas paralelas); o DSU evita esse cuidado.
- Um laço `u -> u` é um ciclo de tamanho 1 no dirigido e também é devolvido.
- Se só precisa saber se é um DAG, a ordenação topológica de Kahn (processa menos que `n` vértices) também serve.
- A DFS é iterativa: seguro para `n = 2e5` em cadeia.
