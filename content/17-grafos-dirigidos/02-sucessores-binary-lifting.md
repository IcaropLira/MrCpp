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

Use `LOG = 60` quando `k` pode chegar a `10^{18}`. Se o limite for menor, ajuste o número de níveis.

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

## Em árvores

A ideia é a mesma, mas `up[0][v]` guarda o pai de `v`, não um sucessor de grafo funcional. Com `depth`, essa tabela permite encontrar o LCA, o k-ésimo ancestral, a distância e o k-ésimo vértice de um caminho. A implementação completa, com construção iterativa e validação dos limites de `k`, está no tópico [LCA (binary lifting)](/arvores/lca).

A distância em arestas é:

`dist(u,v) = depth[u] + depth[v] - 2 * depth[lca(u,v)]`.

Para o k-ésimo vértice do caminho de `u` até `v`, `k` começa em zero. Seja `w = lca(u,v)`, `a = depth[u]-depth[w]` e `b = depth[v]-depth[w]`. Se `k <= a`, suba `k` a partir de `u`; caso contrário, suba `a+b-k` a partir de `v`.

## Quando usar

- Consultas de k-ésimo sucessor em grafo funcional.
- Encontrar o vértice após `k` movimentos em uma simulação determinística.
- K-ésimo ancestral, LCA, distância e k-ésimo vértice de um caminho em árvore.
- Encontrar ciclos em grafos funcionais combinando binary lifting com decomposição dos ciclos.

## Cuidados

- O grafo funcional precisa ter um sucessor definido para todo vértice; trate estados sem saída com um vértice sentinela.
- `LOG` precisa cobrir o maior bit de `k`. Para `10^{18}`, 60 níveis bastam.
- A DFS de uma árvore profunda pode estourar a pilha; a ficha de LCA usa DFS iterativa.
- Não confunda k-ésimo sucessor com LCA: a tabela é a mesma ideia, mas a interpretação e as pré-condições são diferentes.
