---
title: Mochila na árvore (merge O(n²))
summary: dp[v][j] = melhor conjunto conexo com j vértices contendo v; o merge limitado pelos tamanhos custa O(n²) no total.
status: done
complexity: O(n²)
tags: mochila na árvore, tree knapsack, dp em árvore, merge por tamanho
---

## Por que é O(n²) e não O(n³)

Ao juntar o filho `u` em `v`, o laço custa `|sub(v) já processada| · |sub(u)|`. Cada par de vértices `(x, y)` é contado **uma única vez**: no merge em que eles se encontram pela primeira vez (no LCA). Logo o total é ≤ `n²`. Com limite `K` no tamanho (`dp[v][j]` só até K), o total cai para **O(n·K)** — corte os vetores em `K`.

Usos: escolher k vértices conexos, "tirar k arestas para maximizar…", orçamento em árvore de dependências (pegar um vértice exige o pai: mesma DP com "contém v").

## Código (para cada K, maior soma de um conjunto conexo com K vértices)

```cpp
// Mochila na árvore: para cada K = 1..n, a maior soma de um conjunto CONEXO com exatamente K vértices.
// dp[v][j] = melhor conjunto conexo com j vértices, contido na subárvore de v e contendo v.
// Merge filho a filho limitado pelos tamanhos: O(n²) no total (cada par de vértices é "combinado" uma vez, no LCA).
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll NEG = LLONG_MIN / 4;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<ll> w(n + 1); for (int i = 1; i <= n; i++) cin >> w[i];
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; g[a].push_back(b); g[b].push_back(a); }
    vector<int> par(n + 1, 0), ord = {1};
    for (int i = 0; i < (int)ord.size(); i++) { int v = ord[i]; for (int u : g[v]) if (u != par[v]) { par[u] = v; ord.push_back(u); } }
    vector<vector<ll>> dp(n + 1);
    vector<ll> best(n + 1, NEG);
    for (int i = n - 1; i >= 0; i--) {
        int v = ord[i];
        dp[v] = {NEG, w[v]};                                  // índice = nº de vértices
        for (int u : g[v]) if (u != par[v]) {
            int a = dp[v].size() - 1, b = dp[u].size() - 1;
            vector<ll> nd(a + b + 1, NEG);
            for (int x = 1; x <= a; x++) if (dp[v][x] > NEG) {
                nd[x] = max(nd[x], dp[v][x]);                 // não pega nada de u
                for (int y = 1; y <= b; y++) if (dp[u][y] > NEG) nd[x + y] = max(nd[x + y], dp[v][x] + dp[u][y]);
            }
            dp[v] = move(nd);
            vector<ll>().swap(dp[u]);                         // libera memória
        }
        for (int j = 1; j < (int)dp[v].size(); j++) best[j] = max(best[j], dp[v][j]);
    }
    for (int k = 1; k <= n; k++) cout << best[k] << " \n"[k == n];
}
```

Exemplo testado — entrada:

```text
5
3 -2 4 5 -1
1 2
1 3
3 4
3 5
```

saída:

```text
5 9 12 11 9
```

> Verificação: 400 árvores com pesos negativos e positivos contra todos os subconjuntos conexos.
