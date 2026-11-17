---
title: Pontos de articulação
summary: Vértices cuja remoção aumenta o número de componentes, em uma DFS com tin/low.
status: done
complexity: O(V + E)
tags: grafos, articulação, dfs, low-link
---

## Ideia

Na árvore da DFS, um vértice `u` que não é raiz é ponto de articulação se algum filho `v` tem `low[v] >= tin[u]`: a subárvore de `v` não consegue chegar acima de `u` sem passar por ele. A raiz é ponto de articulação se tem dois ou mais filhos na árvore. Arestas paralelas não mudam nada aqui (diferente das pontes).

## Código

```cpp
// vértices 0..n-1, grafo não dirigido. art[v] = 1 se v é ponto de articulação
vector<char> pontos_articulacao(const vector<vector<int>>& g) {
    int n = g.size(), timer = 0;
    vector<int> tin(n, -1), low(n, 0), it(n, 0), pai(n, -1);
    vector<char> art(n, 0);
    for (int s = 0; s < n; s++) {
        if (tin[s] != -1) continue;
        vector<int> chamada = {s};
        tin[s] = low[s] = timer++;
        int filhosRaiz = 0;
        while (!chamada.empty()) {
            int u = chamada.back();
            if (it[u] < (int)g[u].size()) {
                int v = g[u][it[u]++];
                if (v == pai[u]) continue;
                if (tin[v] != -1) low[u] = min(low[u], tin[v]);
                else {
                    pai[v] = u; tin[v] = low[v] = timer++;
                    chamada.push_back(v);
                }
            } else {
                chamada.pop_back();
                if (chamada.empty()) break;
                int p = chamada.back();
                low[p] = min(low[p], low[u]);
                if (pai[p] == -1) filhosRaiz++;
                else if (low[u] >= tin[p]) art[p] = 1;
            }
        }
        art[s] = filhosRaiz >= 2;
    }
    return art;
}
```

## Complexidade e cuidados

- Pular todas as arestas para o pai é correto aqui; para *pontes* com arestas paralelas é preciso pular só a aresta exata (por id).
- Uma árvore de `n >= 3` vértices tem como pontos de articulação todos os vértices internos.
- Remover um ponto de articulação deixa pelo menos 2 componentes; a árvore bloco-cut organiza isso.
- Vértice isolado ou grafo com 1-2 vértices não tem pontos de articulação.
