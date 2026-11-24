---
title: Otimização de Knuth
summary: DP de intervalos dp[i][j] = min dp[i][k] + dp[k+1][j] + C(i,j) em O(n²) usando opt[i][j−1] ≤ opt[i][j] ≤ opt[i+1][j].
status: done
complexity: O(n²)
tags: knuth, dp de intervalos, otimização
---

## Quando vale

`C` satisfaz **desigualdade quadrangular** `C(a,c) + C(b,d) ≤ C(a,d) + C(b,c)` (a ≤ b ≤ c ≤ d) e **monotonia** `C(b,c) ≤ C(a,d)`. Ex.: juntar pilhas adjacentes (custo = soma), árvore de busca ótima, cortar uma vara em pontos dados.

## Código (juntar pilhas adjacentes)

```cpp
// Otimização de Knuth: juntar pilhas adjacentes com custo = soma do intervalo (min custo total)
// dp[i][j] = min_{i<=k<j} dp[i][k] + dp[k+1][j] + soma(i, j)
// Vale opt[i][j-1] <= opt[i][j] <= opt[i+1][j] (custo satisfaz desigualdade quadrangular e monotonia)
// -> O(n^2) em vez de O(n^3)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    int n; cin >> n;
    vector<ll> a(n), pre(n + 1, 0);
    for (int i = 0; i < n; i++) { cin >> a[i]; pre[i + 1] = pre[i] + a[i]; }
    vector<vector<ll>> dp(n, vector<ll>(n, 0));
    vector<vector<int>> opt(n, vector<int>(n, 0));
    for (int i = 0; i < n; i++) opt[i][i] = i;
    for (int len = 2; len <= n; len++)
        for (int i = 0; i + len - 1 < n; i++) {
            int j = i + len - 1;
            dp[i][j] = LLONG_MAX;
            for (int k = opt[i][j - 1]; k <= min(j - 1, opt[i + 1][j]); k++) {
                ll v = dp[i][k] + dp[k + 1][j] + pre[j + 1] - pre[i];
                if (v < dp[i][j]) { dp[i][j] = v; opt[i][j] = k; }
            }
        }
    cout << dp[0][n - 1] << '\n';
}
```

Exemplo testado — entrada:

```text
4
1 2 3 4
```

saída:

```text
19
```

> Verificação: 400 casos aleatórios contra a DP O(n³).
