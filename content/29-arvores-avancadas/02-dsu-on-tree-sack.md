---
title: DSU on Tree (Sack)
summary: Processa consultas de subárvore mantendo as frequências da maior subárvore e reutilizando seu estado.
status: done
complexity: O(n log n) atualizações de vértices, se add/remove for O(1)
tags: árvores, dsu on tree, sack, frequência, subárvore
---

## Quando usar

Quando cada vértice precisa responder uma consulta sobre os valores de sua subárvore, como número de cores distintas ou frequência máxima.

## Ideia

Processamos primeiro as subárvores leves descartando seus dados. Depois processamos a subárvore pesada mantendo os dados, adicionamos novamente as leves e o próprio vértice. Assim, cada vértice é inserido/retirado O(log n) vezes.

Esta técnica, também chamada de sack, é diferente do merge de contêineres Small to Large: aqui mantemos um único estado global de frequências.

## Código

Exemplo: quantidade de cores distintas na subárvore. Cores comprimidas para [0..C-1]. A árvore é enraizada em 0.

~~~cpp
int n, timer = 0;
vector<vector<int>> g;
vector<int> color, sz, heavy, tin, tout, ans, freq;
int distinct = 0;

void dfs_size(int u, int p) {
    sz[u] = 1;
    tin[u] = timer++;
    for (int v : g[u]) if (v != p) {
        dfs_size(v, u);
        sz[u] += sz[v];
        if (heavy[u] == -1 || sz[v] > sz[heavy[u]])
            heavy[u] = v;
    }
    tout[u] = timer;
}

void add_vertex(int u, int delta) {
    int c = color[u];
    if (delta == 1 && freq[c]++ == 0) distinct++;
    else if (delta == -1 && --freq[c] == 0) distinct--;
}

void add_subtree(int u, int p, int delta) {
    add_vertex(u, delta);
    for (int v : g[u]) if (v != p)
        add_subtree(v, u, delta);
}

void dfs_sack(int u, int p, bool keep) {
    for (int v : g[u])
        if (v != p && v != heavy[u])
            dfs_sack(v, u, false);

    if (heavy[u] != -1)
        dfs_sack(heavy[u], u, true);

    for (int v : g[u])
        if (v != p && v != heavy[u])
            add_subtree(v, u, 1);

    add_vertex(u, 1);
    ans[u] = distinct;

    if (!keep) add_subtree(u, p, -1);
}

// Inicialize os vetores com tamanho n; heavy com -1.
// Faça dfs_size(0, -1) e depois dfs_sack(0, -1, true).
~~~

## Cuidados

- O exemplo responde número de cores distintas; adapte add_vertex e a resposta para outras estatísticas.
- A compressão de coordenadas das cores é necessária se os valores forem grandes ou negativos.
- add_subtree recursiva pode estourar a pilha em árvores-caminho; converta as DFS para iterativas se n for grande.
- A complexidade O(n log n) pressupõe atualização O(1) por vértice. Estruturas ordenadas podem acrescentar fatores logarítmicos.
