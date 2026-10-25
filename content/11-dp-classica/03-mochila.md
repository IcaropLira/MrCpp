---
title: Mochila (knapsack)
summary: Mochila 0/1 com vetor unidimensional.
status: done
complexity: O(n · W)
tags: dp, knapsack
---

## Ideia

`dp[c]` é o maior valor com capacidade `c`. Percorrer a capacidade de trás para frente impede usar o mesmo item duas vezes.

## Código

```cpp
ll knapsack(const vector<int>& w, const vector<ll>& v, int W) {
    vector<ll> dp(W + 1);
    for (size_t i = 0; i < w.size(); i++)
        for (int c = W; c >= w[i]; c--)
            dp[c] = max(dp[c], dp[c - w[i]] + v[i]);
    return dp[W];
}
```

## Uso

Para itens ilimitados, percorra `c` de frente para trás.
