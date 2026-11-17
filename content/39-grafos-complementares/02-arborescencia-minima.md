---
title: Arborescência mínima (Chu-Liu/Edmonds)
summary: Árvore geradora mínima dirigida com raiz fixa, contraindo ciclos de arestas de entrada mínima.
status: done
complexity: O(V · E)
tags: grafos, dirigido, arborescencia, edmonds
---

## Ideia

Uma arborescência com raiz `r` tem exatamente uma aresta de entrada em cada vértice diferente de `r` e alcança todos a partir de `r`. Para cada vértice, escolha a aresta de entrada mais barata. Se não houver ciclo, acabou. Se houver, contraia o ciclo em um super-vértice, subtraia de cada aresta que entra no ciclo o peso da aresta de entrada escolhida do seu destino, some o custo do ciclo e repita no grafo menor.

## Código

```cpp
struct Edge { int u, v; ll w; };

// vértices 0..n-1, arestas dirigidas u -> v, raiz r
// devolve o custo mínimo da arborescência, ou -1 se algum vértice é inalcançável a partir de r
ll arborescence(int n, int r, vector<Edge> E) {
    const ll INF = LLONG_MAX / 4;
    ll res = 0;
    while (true) {
        vector<ll> in(n, INF);
        vector<int> pre(n, -1);
        for (auto& e : E)
            if (e.u != e.v && e.w < in[e.v]) in[e.v] = e.w, pre[e.v] = e.u;
        for (int i = 0; i < n; i++)
            if (i != r && in[i] == INF) return -1;
        in[r] = 0;
        vector<int> id(n, -1), vis(n, -1);
        int cnt = 0;
        for (int i = 0; i < n; i++) {
            res += in[i];
            int v = i;
            while (v != r && id[v] < 0 && vis[v] != i) vis[v] = i, v = pre[v];
            if (v != r && id[v] < 0) {  // achou um ciclo
                for (int u = pre[v]; u != v; u = pre[u]) id[u] = cnt;
                id[v] = cnt++;
            }
        }
        if (cnt == 0) return res;
        for (int i = 0; i < n; i++) if (id[i] < 0) id[i] = cnt++;
        for (auto& e : E) {
            ll w = in[e.v];
            e.u = id[e.u]; e.v = id[e.v];
            if (e.u != e.v) e.w -= w;
        }
        n = cnt; r = id[r];
    }
}
```

## Uso

`ll c = arborescence(n, raiz, arestas);` Para reconstruir as arestas, guarde o índice original de cada aresta durante as contrações.

## Complexidade e cuidados

- Vértices de 0 a n-1; o grafo é dirigido, as arestas apontam para longe da raiz.
- Pesos negativos são aceitos.
- Cada rodada é O(E) e o número de vértices cai a cada contração, logo O(VE) no total.
- Devolve -1 quando a arborescência não existe; arestas para a raiz e laços são ignorados.
- Para "arborescência com raiz livre", crie um vértice artificial com arestas de peso grande para todos.
- Se os pesos são muito grandes, o valor `in` acumulado cabe em `long long` desde que a soma final caiba.
