---
title: Travessia de árvores
summary: DFS, BFS, pai, profundidade, ordem, tamanho de subárvore e diâmetro.
status: done
complexity: O(n)
tags: árvores, dfs, bfs, profundidade
---

## Representação e premissas

Uma árvore com `n` vértices tem `n-1` arestas, é conexa e não tem ciclos. Guarde-a em lista de adjacência. A maioria dos códigos abaixo assume vértices `1..n` e árvore não ponderada.

```cpp
const int N = 2e5 + 5;
int n, pai[N], dep[N], tam[N];
vector<int> adj[N];

void dfs(int v, int p = 0) {
    pai[v] = p;
    tam[v] = 1;
    for (int u : adj[v]) {
        if (u == p) continue;
        dep[u] = dep[v] + 1;
        dfs(u, v);
        tam[v] += tam[u];
    }
}
```

A DFS visita cada vértice e aresta `O(1)` vezes: `O(n)`. `dep[raiz]=0`; `pai[raiz]=0` é sentinela. `tam[v]` conta `v` e todos os descendentes.

## DFS ou BFS?

- **DFS:** natural para subárvores, DP, tempos `tin/tout`, componentes e reconstrução por pai.
- **BFS:** percorre por camadas; em grafo não ponderado, calcula menor distância em número de arestas a partir da origem em `O(n+m)`.
- Para árvore, há um único caminho entre dois vértices. Em grafo geral, pode haver vários caminhos e ciclos; use `vis` ou `pai` corretamente.

## Diâmetro da árvore

O diâmetro é o maior caminho entre dois vértices. Em árvore não ponderada: faça BFS/DFS a partir de qualquer nó e encontre o mais distante `a`; faça outra busca a partir de `a`. A maior distância obtida é o diâmetro. O argumento depende da estrutura de árvore; para árvore ponderada com pesos não negativos, use distâncias ponderadas e escolha a busca apropriada.

## Cuidado com recursão

Uma árvore pode ser uma cadeia com `2e5` vértices. A DFS recursiva pode estourar a pilha. Alternativa: DFS iterativa com uma pilha, registrar a ordem de visita e processar a ordem ao contrário para calcular tamanhos/DP pós-ordem.
