---
title: Virtual Tree
summary: Comprime uma árvore mantendo um conjunto pequeno de vértices marcados e seus LCAs.
status: done
complexity: O(k log k) + custo das consultas de LCA
tags: árvores, lca, virtual tree, compressão
---

## Quando usar

Quando uma consulta envolve apenas k vértices de uma árvore grande e precisamos considerar os caminhos entre eles. Exemplos: somar distâncias relevantes, contar separações ou fazer DP apenas sobre os marcados e seus ancestrais comuns.

## Ideia

Ordene os vértices marcados pela ordem de entrada da DFS. Acrescente o LCA de cada par consecutivo, ordene novamente e conecte cada vértice ao ancestral anterior mais próximo usando uma pilha. A árvore resultante preserva as relações de ancestralidade necessárias à consulta.

## Código

A árvore original é enraizada em 0. O LCA deve oferecer query(u,v), e tin/tout devem representar entrada/saída da DFS. A função retorna arestas dirigidas da raiz virtual para os descendentes.

~~~cpp
struct VirtualTree {
    int n;
    vector<int> tin, tout;

    VirtualTree(vector<int> tin, vector<int> tout)
        : n(tin.size()), tin(move(tin)), tout(move(tout)) {}

    bool ancestor(int u, int v) const {
        return tin[u] <= tin[v] && tout[v] <= tout[u];
    }

    vector<vector<int>> build(vector<int> marked,
                              function<int(int,int)> lca) {
        sort(marked.begin(), marked.end(), [&](int a, int b) {
            return tin[a] < tin[b];
        });
        marked.erase(unique(marked.begin(), marked.end()), marked.end());

        int k = marked.size();
        for (int i = 1; i < k; i++)
            marked.push_back(lca(marked[i - 1], marked[i]));

        sort(marked.begin(), marked.end(), [&](int a, int b) {
            return tin[a] < tin[b];
        });
        marked.erase(unique(marked.begin(), marked.end()), marked.end());

        vector<vector<int>> vt(n);
        vector<int> st;
        for (int v : marked) {
            while (!st.empty() && !ancestor(st.back(), v))
                st.pop_back();
            if (!st.empty()) vt[st.back()].push_back(v);
            st.push_back(v);
        }
        return vt;
    }
};
~~~

## Cuidados

- O tamanho da árvore virtual é no máximo 2k-1 para k vértices marcados distintos.
- A implementação aloca n listas para manter os IDs originais. Se n for grande e k pequeno, use um mapeamento compacto.
- O LCA precisa pertencer à mesma árvore enraizada e tin/tout devem usar a mesma convenção.
- As arestas da árvore virtual representam caminhos da árvore original, não necessariamente arestas originais. Guarde a distância ou outro agregado do caminho se a DP precisar dele.
