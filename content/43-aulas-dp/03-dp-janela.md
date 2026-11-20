---
title: DP com janela: prefixo e deque monotônica
summary: Candies (soma de janela com prefixo) e Rudolf and k Bridges (mínimo de janela com deque).
status: done
complexity: O(n · k) e O(n · m)
tags: dp, prefix sum, deque, janela deslizante, aula
---

## Padrão

- **Soma** numa janela de estados anteriores → prefixo (contraexemplo da segtree: não precisa de update).
- **Mínimo/máximo** numa janela que só anda para a direita → deque monotônica, O(1) amortizado.

### Candies (AtCoder DP M)

Juiz: <https://atcoder.jp/contests/dp/tasks/dp_m>  
Complexidade: `O(n · k)`

`dp[x] = soma dp_ant[x−a_i .. x]`.

```cpp
// AtCoder DP M - Candies: dp[x] novo = soma dp[x-a_i .. x]  (prefixo -> O(n*k))
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1e9 + 7;

int main() {
    int n, k; cin >> n >> k;
    vector<long long> dp(k + 1, 0), pre(k + 2);
    dp[0] = 1;
    for (int i = 0; i < n; i++) {
        int a; cin >> a;
        pre[0] = 0;
        for (int x = 0; x <= k; x++) pre[x + 1] = (pre[x] + dp[x]) % MOD;  // pre[x] = dp[0..x-1]
        for (int x = 0; x <= k; x++) dp[x] = (pre[x + 1] - pre[max(0, x - a)] + MOD) % MOD;
    }
    cout << dp[k] << '\n';
}
```

Exemplo testado — entrada:

```text
3 4
1 2 3
```

saída:

```text
5
```


### Rudolf and k Bridges (CF 1941E)

Juiz: <https://codeforces.com/problemset/problem/1941/E>  
Complexidade: `O(n · m)`

Por linha: `dp[j] = a[j] + 1 + min dp[j−d−1 .. j−1]`. Depois, janela de `k` linhas consecutivas.

```cpp
// CF 1941E - Rudolf and k Bridges: dp[j] = a[j]+1 + min dp na janela [j-d-1, j-1] (deque monotônica)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n, m, k, d; cin >> n >> m >> k >> d;
        vector<ll> c(n);
        for (int i = 0; i < n; i++) {
            vector<ll> a(m), dp(m);
            for (auto &x : a) cin >> x;
            deque<int> q;                                  // índices com dp crescente
            dp[0] = 1; q.push_back(0);
            for (int j = 1; j < m; j++) {
                while (q.front() < j - d - 1) q.pop_front();          // saiu da janela
                dp[j] = dp[q.front()] + a[j] + 1;
                while (!q.empty() && dp[q.back()] >= dp[j]) q.pop_back(); // nunca mais será mínimo
                q.push_back(j);
            }
            c[i] = dp[m - 1];
        }
        ll s = 0; for (int i = 0; i < k; i++) s += c[i];
        ll best = s;
        for (int i = k; i < n; i++) { s += c[i] - c[i - k]; best = min(best, s); }
        cout << best << '\n';
    }
}
```

Exemplo testado — entrada:

```text
1
4 4 2 1
0 3 3 0
0 2 1 0
0 1 2 0
0 3 3 0
```

saída:

```text
8
```
