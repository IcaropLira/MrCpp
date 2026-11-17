---
title: Operações com matrizes
summary: Produto, potência e aplicações: Fibonacci e recorrências lineares em O(k³ log n).
status: done
complexity: O(k³ log n)
tags: matrizes, exponenciação, recorrência linear
---

## Ideia

Uma recorrência linear `x_n = c_1 x_{n-1} + ... + c_k x_{n-k}` vira um produto de matriz por vetor de estado: elevando a matriz `k × k` a `n` por exponenciação rápida, obtém-se `x_n` em `O(k³ log n)`. Também conta passeios de comprimento `n` em grafos (potência da matriz de adjacência).

## Código

```cpp
const ll MOD = 1e9 + 7;
using Mat = vector<vector<ll>>;

Mat identidade(int n) {
    Mat I(n, vector<ll>(n, 0));
    for (int i = 0; i < n; i++) I[i][i] = 1;
    return I;
}
Mat mul(const Mat& a, const Mat& b) {
    int n = a.size(), m = b[0].size(), p = b.size();
    Mat c(n, vector<ll>(m, 0));
    for (int i = 0; i < n; i++)
        for (int k = 0; k < p; k++) {
            if (!a[i][k]) continue;
            for (int j = 0; j < m; j++) c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % MOD;
        }
    return c;
}
Mat mpow(Mat a, ll e) {
    Mat r = identidade(a.size());
    for (; e; e >>= 1, a = mul(a, a)) if (e & 1) r = mul(r, a);
    return r;
}

// F(0) = 0, F(1) = 1, ...: F(n) mod MOD
ll fibonacci(ll n) {
    Mat M = {{1, 1}, {1, 0}};
    return mpow(M, n)[0][1];
}

// x_n = c[0] x_{n-1} + ... + c[k-1] x_{n-k}, com x_0..x_{k-1} = ini
ll recorrencia(const vector<ll>& c, const vector<ll>& ini, ll n) {
    int k = c.size();
    auto norm = [](ll x) { return ((x % MOD) + MOD) % MOD; };  // aceita negativos
    if (n < k) return norm(ini[n]);
    Mat M(k, vector<ll>(k, 0));
    for (int j = 0; j < k; j++) M[0][j] = norm(c[j]);
    for (int i = 1; i < k; i++) M[i][i - 1] = 1;
    Mat P = mpow(M, n - (k - 1));
    ll r = 0;
    for (int j = 0; j < k; j++) r = (r + P[0][j] * norm(ini[k - 1 - j])) % MOD;
    return r;
}
```

## Complexidade e cuidados

- `recorrencia` aceita coeficientes e valores iniciais negativos (normaliza internamente); `mul` e `mpow` esperam entradas já em `[0, MOD)`.
- Para `k` grande (centenas) e `n` enorme, Kitamasa/Berlekamp-Massey reduzem para `O(k² log n)`.
- `mul` aceita matrizes retangulares; `mpow` exige quadrada.
- Sem módulo (valores exatos) use `__int128` ou números grandes e cuide do overflow.
