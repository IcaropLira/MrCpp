---
title: Block-Cut Tree
summary: Representa componentes biconexas por vértices auxiliares e separadores por vértices originais.
status: done
complexity: O(V + E)
tags: grafos, articulacao, biconectividade, tarjan
---

## Quando usar

Consultas sobre caminhos em grafos não dirigidos que envolvem pontos de articulação, separação de vértices e componentes biconexas por vértices.

## Ideia

Durante a DFS, empilhe arestas da árvore e arestas de retorno para ancestrais. Quando low[v] >= tin[u], retire arestas até (u,v): elas formam uma componente biconexa. Crie um vértice auxiliar para essa componente e conecte-o aos vértices que aparecem nas arestas retiradas.

A representação abaixo mantém todos os vértices originais e adiciona um nó por bloco. É uma floresta de incidência; vértices de articulação conectam vários blocos.

## Código

~~~cpp
struct BlockCut {
    int n, timer = 0;
    vector<vector<pair<int,int>>> g;
    vector<int> tin, low;
    vector<pair<int,int>> st;
    vector<vector<int>> tree;

    BlockCut(int n) : n(n), g(n), tin(n, 0), low(n, 0) {}

    void add_edge(int u, int v, int id) {
        g[u].push_back({v, id});
        g[v].push_back({u, id});
    }

    void dfs(int u, int pe = -1) {
        tin[u] = low[u] = ++timer;

        for (auto [v, id] : g[u]) {
            if (id == pe) continue;

            if (!tin[v]) {
                st.push_back({u, v});
                dfs(v, id);
                low[u] = min(low[u], low[v]);

                if (low[v] >= tin[u]) {
                    int bloco = (int)tree.size();
                    tree.push_back({});
                    vector<int> vertices;

                    while (true) {
                        auto [a, b] = st.back();
                        st.pop_back();
                        vertices.push_back(a);
                        vertices.push_back(b);
                        if (a == u && b == v) break;
                    }

                    sort(vertices.begin(), vertices.end());
                    vertices.erase(unique(vertices.begin(), vertices.end()), vertices.end());
                    for (int x : vertices) {
                        tree[bloco].push_back(x);
                        tree[x].push_back(bloco);
                    }
                }
            } else if (tin[v] < tin[u]) {
                st.push_back({u, v});
                low[u] = min(low[u], tin[v]);
            }
        }
    }

    vector<vector<int>> build() {
        tree.assign(n, {});
        for (int u = 0; u < n; u++)
            if (!tin[u]) dfs(u);
        return tree;
    }
};

// Nós 0..n-1 são vértices originais.
// Nós n..tree.size()-1 são componentes biconexas.
~~~

## Cuidados

- Grafo não dirigido; cada aresta precisa de ID único para tratar arestas paralelas.
- A condição de corte do bloco é low[v] >= tin[u]; para ponte, a condição é estrita: low[v] > tin[u].
- Um vértice isolado permanece como nó isolado na floresta.
- Laços e multiarestas exigem IDs consistentes; para problemas com laços, confirme a convenção de componente biconexa do enunciado.
- A DFS é recursiva e pode estourar a pilha em cadeias longas.
