---
title: Ciclo de média mínima (Karp)
summary: Menor razão peso/arestas entre todos os ciclos de um grafo dirigido, pelo algoritmo de Karp.
status: done
complexity: O(V · E)
tags: grafos, ciclos, karp, programacao dinamica
---

## Ideia

Seja `d[k][v]` o menor peso de um passeio com exatamente `k` arestas terminando em `v`, começando em qualquer vértice (`d[0][v] = 0`). A média mínima dos ciclos é

`min over v de max over k < n de (d[n][v] - d[k][v]) / (n - k)`,

considerando só `v` com `d[n][v]` finito e `k` com `d[k][v]` finito. Se `d[n][v]` é infinito para todo `v`, o grafo é acíclico.

## Código

```cpp
struct Edge { int u, v; ll w; };

// vértices 0..n-1, arestas dirigidas. Devolve false se não há ciclo.
// A média mínima é num/den (fração sem redução, den > 0).
bool karp(int n, const vector<Edge>& E, ll& num, ll& den) {
    const ll INF = LLONG_MAX / 4;
    vector<vector<ll>> d(n + 1, vector<ll>(n, INF));
    fill(d[0].begin(), d[0].end(), 0);
    for (int k = 1; k <= n; k++)
        for (auto& e : E)
            if (d[k - 1][e.u] < INF) d[k][e.v] = min(d[k][e.v], d[k - 1][e.u] + e.w);
    bool found = false;
    for (int v = 0; v < n; v++) {
        if (d[n][v] >= INF) continue;
        ll bn = 0, bd = 1;
        bool has = false;
        for (int k = 0; k < n; k++) {
            if (d[k][v] >= INF) continue;
            ll a = d[n][v] - d[k][v], b = n - k;
            if (!has || a * bd > bn * b) bn = a, bd = b, has = true;
        }
        if (!found || bn * den < num * bd) num = bn, den = bd, found = true;
    }
    return found;
}
```

## Uso

`ll p, q; if (karp(n, E, p, q)) cout << (double)p / q;`

## Complexidade e cuidados

- Vértices de 0 a n-1; grafo dirigido, pesos podem ser negativos.
- Tempo O(VE) e memória O(V²) (a tabela `d`); com `d` em duas linhas não dá para reconstruir `d[k][v]` para todo `k`, então mantenha a tabela.
- Comparações por produto cruzado: `a * bd` cabe em `long long` se `V · maxW · V` for menor que 9e18.
- Para a média máxima, negue os pesos.
- Para recuperar o ciclo, ou busque o ciclo dentro do subgrafo de arestas apertadas após subtrair a média, ou reconstrua o passeio de `d[n][v]` e ache um ciclo nele.
- Grafos desconexos funcionam, pois `d[0]` inicia todos os vértices.
