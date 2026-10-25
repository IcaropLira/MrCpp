---
title: Distância de edição
summary: Distância de edição (Levenshtein).
status: done
complexity: O(n · m)
tags: dp, strings
---

## Ideia

Inserir, remover ou trocar um caractere custa 1; pega-se o mínimo entre as três opções.

## Código

```cpp
int edit(const string& a, const string& b) {
    int n = a.size(), m = b.size();
    vector<vector<int>> d(n + 1, vector<int>(m + 1));
    for (int i = 0; i <= n; i++) d[i][0] = i;
    for (int j = 0; j <= m; j++) d[0][j] = j;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= m; j++)
            d[i][j] = min({d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] != b[j-1])});
    return d[n][m];
}
```
