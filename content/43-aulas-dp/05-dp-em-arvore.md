---
title: DP em árvore (aula)
summary: Independent Set (pintura sem vizinhos verdes/pretos) e Infected Tree.
status: done
complexity: O(n)
tags: dp em árvore, dfs, aula
---

## Ideia

`dp[v][estado]` resolve a subárvore de `v`; filhos antes do pai (DFS pós-ordem ou BFS invertida). Sem memória, a DFS ingênua é `O(2^n)`.

### Independent Set (AtCoder DP P) — e o problema do Taro (laranja/verde)

Juiz: <https://atcoder.jp/contests/dp/tasks/dp_p>  
Complexidade: `O(n)`

`dp[v][0] = Π (dp[c][0] + dp[c][1])`; `dp[v][1] = Π dp[c][0]`.

```cpp
// AtCoder DP P - Independent Set: pintar sem dois pretos vizinhos
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1e9 + 7;
vector<vector<int>> adj;
long long dp[100005][2];   // dp[v][0]: v branco, dp[v][1]: v preto

void dfs(int v, int p) {
    dp[v][0] = dp[v][1] = 1;
    for (int u : adj[v]) if (u != p) {
        dfs(u, v);
        dp[v][0] = dp[v][0] * (dp[u][0] + dp[u][1]) % MOD; // branco: filho livre
        dp[v][1] = dp[v][1] * dp[u][0] % MOD;              // preto: filho branco
    }
}

int main() {
    int n; cin >> n;
    adj.assign(n + 1, {});
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    dfs(1, 0);
    cout << (dp[1][0] + dp[1][1]) % MOD << '\n';
}
```

Exemplo testado — entrada:

```text
3
1 2
2 3
```

saída:

```text
5
```


### Infected Tree (CF 1689C)

Juiz: <https://codeforces.com/contest/1689/problem/C>  
Complexidade: `O(n) por caso`

`dp[v]` = salvos se `v` infectado: apaga um filho (salva `sz − 1`) e o outro continua (`dp`).

```cpp
// CF 1689C - Infected Tree (árvore binária, raiz infectada)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n; cin >> n;
        vector<vector<int>> adj(n + 1);
        for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
        // ordem BFS: pai antes do filho (evita recursão profunda)
        vector<int> pai(n + 1, 0), ordem = {1};
        for (int i = 0; i < (int)ordem.size(); i++) {
            int v = ordem[i];
            for (int u : adj[v]) if (u != pai[v]) { pai[u] = v; ordem.push_back(u); }
        }
        vector<int> sz(n + 1, 1), dp(n + 1, 0);   // dp[v]: salvos se v está infectado
        for (int i = n - 1; i >= 0; i--) {
            int v = ordem[i];
            vector<int> f;
            for (int u : adj[v]) if (u != pai[v]) { f.push_back(u); sz[v] += sz[u]; }
            if (f.size() == 1) dp[v] = sz[f[0]] - 1;                       // apaga o único filho
            else if (f.size() == 2)                                          // apaga um, o outro infecta
                dp[v] = max(sz[f[0]] - 1 + dp[f[1]], sz[f[1]] - 1 + dp[f[0]]);
        }
        cout << dp[1] << '\n';
    }
}
```

Exemplo testado — entrada:

```text
1
4
1 2
2 3
2 4
```

saída:

```text
2
```
