---
title: DP em subconjuntos (bitmask)
summary: DP em subconjuntos: caixeiro viajante.
status: done
complexity: O(2^n · n²)
tags: dp, bitmask, tsp
---

## Ideia

`dp[mask][u]` é o menor custo de visitar o conjunto `mask` terminando em `u`.

## Código

```cpp
ll tsp(const vector<vector<ll>>& w) {
    int n = w.size();
    vector<vector<ll>> dp(1 << n, vector<ll>(n, 1e18));
    dp[1][0] = 0;
    for (int m = 1; m < (1 << n); m++)
        for (int u = 0; u < n; u++) if (dp[m][u] < 1e18)
            for (int v = 0; v < n; v++) if (!(m >> v & 1))
                dp[m | 1 << v][v] = min(dp[m | 1 << v][v], dp[m][u] + w[u][v]);
    ll best = 1e18;
    for (int u = 1; u < n; u++) best = min(best, dp[(1 << n) - 1][u] + w[u][0]);
    return best;
}
```
