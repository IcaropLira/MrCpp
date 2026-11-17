---
title: Algoritmo húngaro
summary: Problema da atribuição com custo mínimo, com potenciais e caminhos aumentantes.
status: done
complexity: O(n² · m)
tags: grafos, atribuicao, emparelhamento, hungaro
---

## Ideia

Dada uma matriz de custos `a[i][j]` com `n` linhas e `m ≥ n` colunas, atribua cada linha a uma coluna distinta minimizando a soma. O algoritmo insere as linhas uma a uma, mantendo potenciais `u` (linhas) e `v` (colunas) tais que `a[i][j] - u[i] - v[j] ≥ 0` e as arestas do emparelhamento ficam com custo reduzido 0. Para cada linha nova, uma busca tipo Dijkstra pelas arestas de custo reduzido mínimo acha o caminho aumentante e ajusta os potenciais.

Para maximizar, use `-a[i][j]`.

## Código

```cpp
// a: matriz n x m (n <= m), índices 0-based; custos podem ser negativos
// devolve {custo mínimo, col[i] = coluna atribuída à linha i}
pair<ll, vector<int>> hungarian(const vector<vector<ll>>& a) {
    const ll INF = LLONG_MAX / 4;
    int n = a.size(), m = a[0].size();
    vector<ll> u(n + 1), v(m + 1);
    vector<int> p(m + 1), way(m + 1);  // p[j] = linha (1-based) na coluna j
    for (int i = 1; i <= n; i++) {
        p[0] = i;
        int j0 = 0;
        vector<ll> minv(m + 1, INF);
        vector<char> used(m + 1, false);
        do {
            used[j0] = true;
            int i0 = p[j0], j1 = 0;
            ll d = INF;
            for (int j = 1; j <= m; j++) if (!used[j]) {
                ll cur = a[i0 - 1][j - 1] - u[i0] - v[j];
                if (cur < minv[j]) minv[j] = cur, way[j] = j0;
                if (minv[j] < d) d = minv[j], j1 = j;
            }
            for (int j = 0; j <= m; j++)
                if (used[j]) u[p[j]] += d, v[j] -= d;
                else minv[j] -= d;
            j0 = j1;
        } while (p[j0] != 0);
        do { int j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
    }
    vector<int> col(n, -1);
    ll cost = 0;
    for (int j = 1; j <= m; j++) if (p[j]) col[p[j] - 1] = j - 1;
    for (int i = 0; i < n; i++) cost += a[i][col[i]];
    return {cost, col};
}
```

## Uso

`auto [custo, col] = hungarian(a);` com `a.size() <= a[0].size()`. Se `n > m`, transponha a matriz.

## Complexidade e cuidados

- Linhas e colunas indexadas de 0 (internamente de 1).
- Exige `n ≤ m`; para `n > m`, transponha ou adicione colunas fictícias.
- Aceita custos negativos. Para "proibir" um par, use um valor grande finito (não `INF` real), senão estoura.
- Tempo O(n² m); para `n = m`, O(n³).
- A matriz deve ser completa; pares inexistentes viram custo grande.
