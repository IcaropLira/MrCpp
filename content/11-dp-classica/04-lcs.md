---
title: Maior subsequência comum (LCS)
summary: Maior subsequência comum.
status: done
complexity: O(n · m)
tags: dp, strings
---

## Ideia

`dp[i][j]` é o LCS dos prefixos de tamanho `i` e `j`.

## Código

```cpp
int lcs(const string& a, const string& b) {
    vector<vector<int>> dp(a.size() + 1, vector<int>(b.size() + 1));
    for (size_t i = 1; i <= a.size(); i++)
        for (size_t j = 1; j <= b.size(); j++)
            dp[i][j] = a[i-1] == b[j-1] ? dp[i-1][j-1] + 1 : max(dp[i-1][j], dp[i][j-1]);
    return dp[a.size()][b.size()];
}
```
