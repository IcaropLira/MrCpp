---
title: Bridge Tree
summary: Contrai componentes 2-edge-connected em uma árvore usando as arestas-ponte.
status: done
complexity: O(V + E)
tags: grafos, pontes, arvore, conectividade
---

## Quando usar

Quando consultas de conectividade dependem de remover arestas, ou quando queremos resumir a estrutura de pontes de um grafo não dirigido.

## Ideia

Remova conceitualmente todas as pontes. Cada componente restante vira um vértice da Bridge Tree. Cada ponte original conecta duas componentes distintas; o grafo resultante é uma floresta.

## Código

~~~cpp
// Recebe g[u] = {v, id}, isBridge[id] e o número de vértices n.
pair<vector<int>, vector<vector<int>>> build_bridge_tree(
    int n, const vector<vector<pair<int,int>>>& g,
    const vector<char>& isBridge
) {
    vector<int> comp(n, -1);
    int qtd = 0;

    function<void(int)> dfs = [&](int u) {
        comp[u] = qtd;
        for (auto [v, id] : g[u])
            if (!isBridge[id] && comp[v] == -1)
                dfs(v);
    };

    for (int u = 0; u < n; u++)
        if (comp[u] == -1) dfs(u), qtd++;

    vector<vector<int>> tree(qtd);
    for (int u = 0; u < n; u++) {
        for (auto [v, id] : g[u]) {
            if (isBridge[id] && comp[u] != comp[v])
                tree[comp[u]].push_back(comp[v]);
        }
    }

    return {comp, tree};
}
~~~

## Cuidados

- A entrada é não dirigida e a identificação de ponte deve usar ID de aresta, inclusive em multigrafos.
- Cada ponte aparece nas listas dos dois extremos; a árvore pode armazenar a aresta duplicada como adjacência não dirigida, como no código.
- O resultado é uma floresta se o grafo original for desconexo.
- Para consultas entre vértices originais, mapeie cada um por comp[u] e use LCA/distância na floresta.
