---
title: Sucessores (binary lifting)
summary: K-th successor, ciclos funcionais e saltos em O(log n).
status: done
complexity: O(n log K) de pré-processamento; O(log K) por consulta
tags: grafos dirigidos, binary lifting, sucessores, ciclos funcionais
---

## A ideia

Quando cada vértice tem exatamente um próximo estado, podemos pré-calcular para cada vértice onde chegamos após `2^j` passos.

- `up[j][v]`: vértice alcançado partindo de `v` e seguindo a função exatamente `2^j` vezes.
- `up[0][v] = prox[v]`.
- `up[j][v] = up[j-1][up[j-1][v]]`.

A consulta de `k`-ésimo sucessor vira a decomposição binária de `k`. Não é necessário simular os `k` passos.

## Código — k-ésimo sucessor

Use `LOG = 60` quando `k` pode chegar a (10^{18}). Se o limite for menor, ajuste o número de níveis.

```cpp
const int LOG = 60;
vector<vector<int>> up;

void build(const vector<int>& prox) {
    int n = prox.size();
    up.assign(LOG, vector<int>(n));
    for (int v = 0; v < n; v++) up[0][v] = prox[v];
    for (int j = 1; j < LOG; j++)
        for (int v = 0; v < n; v++)
            up[j][v] = up[j-1][up[j-1][v]];
}

int kth(int v, long long k) {
    for (int j = 0; j < LOG; j++)
        if (k & (1LL << j)) v = up[j][v];
    return v;
}
```

## Em árvores: LCA e distância

A mesma tabela guarda ancestrais em vez de sucessores arbitrários. Com profundidades, igualamos os níveis, subimos os dois vértices e encontramos o menor ancestral comum. A distância em arestas é:

`dist(u,v) = depth[u] + depth[v] - 2 * depth[lca(u,v)]`.

Para encontrar o k-ésimo vértice no caminho de `u` até `v` (k começa em zero), seja `w = lca(u,v)`, `a = depth[u]-depth[w]` e `b = depth[v]-depth[w]`. Se `k <= a`, suba `k` passos a partir de `u`; caso contrário, suba `a+b-k` passos a partir de `v`.

```cpp
int kth_ancestor(int v, int k) {
    for (int j = 0; j < LOG; j++)
        if (k & (1LL << j)) v = up[j][v];
    return v;
}

int kth_on_path(int u, int v, int k) {
    int w = lca(u, v);
    int a = depth[u] - depth[w];
    int b = depth[v] - depth[w];
    if (k <= a) return kth_ancestor(u, k);
    return kth_ancestor(v, a + b - k);
}

int distance(int u, int v) {
    int w = lca(u, v);
    return depth[u] + depth[v] - 2 * depth[w];
}
```

## Quando usar

- Consultas de k-ésimo sucessor em grafo funcional.
- Encontrar o vértice após `k` movimentos em uma simulação determinística.
- K-ésimo ancestral, LCA, distância e k-ésimo vértice de um caminho em árvore.
- Encontrar ciclos em grafos funcionais combinando binary lifting com decomposição dos ciclos.

## Cuidados

- O grafo funcional precisa ter um sucessor definido para todo vértice; trate estados sem saída com um vértice sentinela.
- `LOG` precisa cobrir o maior bit de `k`. Para (10^{18}), 60 níveis bastam.
- DFS recursiva pode estourar a pilha em uma árvore com `2*10^5` vértices; considere DFS iterativa.
- Não confunda k-ésimo sucessor com LCA: a tabela é a mesma ideia, mas a interpretação e as pré-condições são diferentes.
