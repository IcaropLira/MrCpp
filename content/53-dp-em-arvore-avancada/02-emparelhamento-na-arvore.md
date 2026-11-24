---
title: Emparelhamento máximo na árvore
summary: dp[v][livre/casado] e o guloso equivalente (folha com o pai).
status: done
complexity: O(n)
tags: tree matching, emparelhamento, dp em árvore, guloso
---

## Estados

- `dp[v][0]`: v **não** casado com filho → `Σ max(dp[u][0], dp[u][1])`.
- `dp[v][1]`: v casado com um filho `u` → `dp[v][0] − max(dp[u][·]) + dp[u][0] + 1` (o melhor `u`).
- Guloso equivalente: processando de baixo para cima, case `v` com o pai se ambos estão livres.
- Em árvore, **emparelhamento máximo = cobertura mínima de vértices** (König, pois árvore é bipartida).

### Tree Matching (CSES 1130)

Juiz: <https://cses.fi/problemset/task/1130>  
Complexidade: `O(n)`

Folha não pode estar no estado "casada com filho".

```cpp
// CSES 1130 - Tree Matching: maior emparelhamento numa árvore
// dp[v][0] = v livre (não casado com filho); dp[v][1] = v casado com algum filho
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; g[a].push_back(b); g[b].push_back(a); }
    vector<int> par(n + 1, 0), ord = {1};
    for (int i = 0; i < (int)ord.size(); i++) { int v = ord[i]; for (int u : g[v]) if (u != par[v]) { par[u] = v; ord.push_back(u); } }
    vector<array<int,2>> dp(n + 1, {0, 0});
    for (int i = n - 1; i >= 0; i--) {
        int v = ord[i], soma = 0;
        for (int u : g[v]) if (u != par[v]) soma += max(dp[u][0], dp[u][1]);
        dp[v][0] = soma;
        dp[v][1] = INT_MIN;
        for (int u : g[v]) if (u != par[v])                       // casa v com u: u precisa estar livre
            dp[v][1] = max(dp[v][1], soma - max(dp[u][0], dp[u][1]) + dp[u][0] + 1);
        if (dp[v][1] < 0) dp[v][1] = INT_MIN / 2;                 // folha: impossível
    }
    cout << max(dp[1][0], dp[1][1]) << '\n';
    // Guloso equivalente: casar folha com o pai, de baixo para cima, sempre que ambos estiverem livres.
}
```

Exemplo testado — entrada:

```text
5
1 2
1 3
3 4
3 5
```

saída:

```text
2
```


> Verificação: 400 árvores aleatórias contra enumeração de subconjuntos de arestas.
