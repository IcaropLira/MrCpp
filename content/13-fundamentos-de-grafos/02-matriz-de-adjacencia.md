---
title: Matriz de adjacência
summary: Representação n×n: consulta de aresta em O(1), contagem de passeios e fecho transitivo.
status: done
complexity: O(n²) de memória; O(n³ log k) para passeios
tags: grafos, matriz de adjacência, fecho transitivo
---

## Ideia

`A[u][v]` diz se existe a aresta `u -> v` (ou guarda o peso). Serve quando `n` é pequeno (até cerca de `2000`) e o grafo é denso. A potência `A^k` conta passeios de exatamente `k` arestas: `(A^k)[u][v]` é o número de passeios de `u` a `v`. O fecho transitivo (quem alcança quem) sai do algoritmo de Warshall, que com `bitset` fica `O(n³ / 64)`.

## Código

```cpp
using Mat = vector<vector<ll>>;
const ll MOD = 1e9 + 7;

Mat mul(const Mat& a, const Mat& b) {
    int n = a.size();
    Mat c(n, vector<ll>(n, 0));
    for (int i = 0; i < n; i++)
        for (int k = 0; k < n; k++) {
            if (!a[i][k]) continue;
            for (int j = 0; j < n; j++) c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % MOD;
        }
    return c;
}

// nº de passeios de exatamente k arestas de u a v (mod MOD); k = 0 dá a identidade
ll passeios(const Mat& A, int u, int v, ll k) {
    int n = A.size();
    Mat r(n, vector<ll>(n, 0)), b = A;
    for (int i = 0; i < n; i++) r[i][i] = 1;
    for (; k > 0; k >>= 1, b = mul(b, b)) if (k & 1) r = mul(r, b);
    return r[u][v];
}

// fecho transitivo: r[i][j] = 1 se j é alcançável a partir de i (n <= 512)
vector<bitset<512>> fecho(vector<bitset<512>> r, int n) {
    for (int i = 0; i < n; i++) r[i][i] = 1;
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            if (r[i][k]) r[i] |= r[k];
    return r;
}
```

## Complexidade e cuidados

- Memória `n²`: com `n = 1e5` é impossível; use lista de adjacência.
- Para grafos com pesos, use `INF` (e não `0`) como "sem aresta" e guarde a diagonal como `0` quando for caminho mínimo.
- Arestas paralelas podem ser contadas somando em `A[u][v]`.
- Floyd-Warshall (`15-caminhos-minimos`) é a versão com pesos do mesmo laço triplo.
