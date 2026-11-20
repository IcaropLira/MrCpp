---
title: Sapo: transição O(K) → O(1) com prefixo
summary: dp[i] = soma de dp[i−K..i−1] calculada em O(1) com prefix sum.
status: done
complexity: O(N)
tags: dp, prefix sum, sapo, aula
---

## Ideia

Estado `dp[i]` = maneiras de chegar em `i`. Transição: veio de `i−1, …, i−K`. Caso base `dp[1] = 1`. A soma de janela vira `pref[i−1] − pref[i−K−1]`.

## Código

```cpp
// Sapo: saltos de 1..K, maneiras de ir de 1 até N (mod 1e9+7)
// dp[i] = dp[i-1] + ... + dp[i-K]  ->  com prefixo: dp[i] = pref[i-1] - pref[i-K-1]
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1e9 + 7;

int main() {
    int n, k; cin >> n >> k;
    vector<long long> dp(n + 1, 0), pref(n + 1, 0);
    dp[1] = 1; pref[1] = 1;                                 // caso base
    for (int i = 2; i <= n; i++) {
        int lo = max(0, i - k - 1);                         // soma de dp[i-K .. i-1]
        dp[i] = ((pref[i - 1] - pref[lo]) % MOD + MOD) % MOD;
        pref[i] = (pref[i - 1] + dp[i]) % MOD;
    }
    cout << dp[n] << '\n';                                  // O(N) em vez de O(N*K)
}
```

Exemplo testado — entrada:

```text
5 2
```

saída:

```text
5
```
