---
title: Caminho euleriano não dirigido em multigrafos
summary: Hierholzer com IDs de arestas, incluindo arestas paralelas e laços.
status: done
complexity: O(V + E)
tags: grafos, euler, hierholzer, multigrafo
---

## Quando usar

Quando cada aresta de um multigrafo não dirigido precisa ser percorrida exatamente uma vez. A implementação por ID é obrigatória quando há arestas paralelas; também trata laços.

## Condições

- Circuito: todos os vértices de grau não zero pertencem à mesma componente e todos os graus são pares.
- Caminho aberto: mesma condição de conectividade e exatamente dois vértices têm grau ímpar.
- Um grafo sem arestas admite passeio trivial em qualquer vértice escolhido.

## Código

Retorna a sequência de vértices, ou vetor vazio se não existir passeio euleriano. Arestas e vértices são 0-based.

~~~cpp
vector<int> euler_undirected(int n, const vector<pair<int,int>>& edges) {
    int m = edges.size();
    vector<vector<pair<int,int>>> g(n);
    vector<int> deg(n), odd;

    for (int id = 0; id < m; id++) {
        auto [u, v] = edges[id];
        g[u].push_back({v, id});
        g[v].push_back({u, id});
        deg[u]++, deg[v]++;
    }

    int start = -1;
    for (int v = 0; v < n; v++) if (deg[v]) {
        if (start == -1) start = v;
        if (deg[v] & 1) odd.push_back(v);
    }
    if (odd.size() != 0 && odd.size() != 2) return {};
    if (start == -1) return n ? vector<int>{0} : vector<int>{};
    if (odd.size() == 2) start = odd[0];

    vector<int> it(n), st{start}, path;
    vector<char> used(m);
    while (!st.empty()) {
        int u = st.back();
        while (it[u] < (int)g[u].size() && used[g[u][it[u]].second])
            it[u]++;
        if (it[u] == (int)g[u].size()) {
            path.push_back(u);
            st.pop_back();
        } else {
            auto [v, id] = g[u][it[u]++];
            if (used[id]) continue;
            used[id] = true;
            st.push_back(v);
        }
    }

    if ((int)path.size() != m + 1) return {};
    reverse(path.begin(), path.end());
    return path;
}
~~~

## Cuidados

- O teste final path.size() == m+1 também verifica que nenhuma componente com arestas ficou desconectada do início.
- Um laço contribui com grau 2; o código incrementa deg[u] duas vezes corretamente.
- A sequência de vértices não identifica sozinha qual aresta paralela foi usada. Se precisar reconstruir IDs, guarde também o ID ao empilhar.
- Complexidade O(V+E), cada ID é consumido uma única vez.
