---
title: Exponenciação de matrizes
summary: Potência de matriz (recorrências lineares).
status: done
complexity: O(k³ log e)
tags: matrizes, fibonacci
---

## Ideia

Uma recorrência linear vira multiplicação por uma matriz fixa; eleva-se por quadrados.

## Código

```cpp
using Mat = vector<vector<ll>>;
const ll MOD = 1e9 + 7;
Mat mul(const Mat& a, const Mat& b) {
    int n = a.size(); Mat c(n, vector<ll>(n));
    for (int i = 0; i < n; i++) for (int k = 0; k < n; k++) for (int j = 0; j < n; j++)
        c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % MOD;
    return c;
}
Mat mpow(Mat a, ll e) {
    Mat r(a.size(), vector<ll>(a.size()));
    for (size_t i = 0; i < a.size(); i++) r[i][i] = 1;
    for (; e; e >>= 1, a = mul(a, a)) if (e & 1) r = mul(r, a);
    return r;
}
```

## Uso

Fibonacci: `mpow({{1, 1}, {1, 0}}, n)[0][1]`.
