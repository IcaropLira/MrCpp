---
title: Caminhos em grade
summary: Contar caminhos e achar o de maior soma movendo-se só para a direita e para baixo.
status: done
complexity: O(n · m)
tags: dp, grade, caminhos
---

## Ideia

Cada célula só é alcançada pela de cima ou pela da esquerda, então `dp[i][j]` depende de `dp[i-1][j]` e `dp[i][j-1]`. Para contar, soma-se; para otimizar, toma-se o máximo. Obstáculos zeram a célula.

## Código

```cpp
const ll MOD = 1e9 + 7;

// grade com '#' = obstáculo; caminhos de (0,0) a (n-1,m-1) indo para a direita/baixo
ll caminhos(const vector<string>& g) {
    int n = g.size(), m = g[0].size();
    vector<vector<ll>> dp(n, vector<ll>(m, 0));
    if (g[0][0] == '#') return 0;
    dp[0][0] = 1;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            if (g[i][j] == '#') { dp[i][j] = 0; continue; }
            if (i) dp[i][j] = (dp[i][j] + dp[i - 1][j]) % MOD;
            if (j) dp[i][j] = (dp[i][j] + dp[i][j - 1]) % MOD;
        }
    return dp[n - 1][m - 1];
}

// maior soma de (0,0) a (n-1,m-1) indo para a direita/baixo (valores podem ser negativos)
ll melhor_soma(const vector<vector<ll>>& a) {
    int n = a.size(), m = a[0].size();
    const ll NEG = LLONG_MIN / 4;
    vector<vector<ll>> dp(n, vector<ll>(m, NEG));
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            if (!i && !j) { dp[i][j] = a[0][0]; continue; }
            ll b = NEG;
            if (i) b = max(b, dp[i - 1][j]);
            if (j) b = max(b, dp[i][j - 1]);
            dp[i][j] = b + a[i][j];
        }
    return dp[n - 1][m - 1];
}
```

## Complexidade e cuidados

- Se o início ou o fim for obstáculo, o número de caminhos é 0.
- Sem obstáculos, o total de caminhos é `C(n+m-2, n-1)`; com `n, m` grandes isso é mais rápido que a DP.
- Para quatro direções (grade geral) a DP não serve: use BFS/Dijkstra.
- Dá para guardar só uma linha (`O(m)` de memória).
