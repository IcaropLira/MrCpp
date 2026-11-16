---
title: Interpolação de Lagrange
summary: Avalia o polinômio de grau até n-1 que passa por n pontos com abscissas consecutivas.
status: done
complexity: O(n) por avaliação após pré-processamento O(n)
tags: polinomios, lagrange, combinatoria, modulo
---

## Quando usar

Quando conhecemos f(0), f(1), ..., f(n) e sabemos que a função procurada é um polinômio de grau no máximo n. Permite avaliar em x grande sem reconstruir coeficientes.

## Código

MOD deve ser primo e n < MOD. As abscissas são 0..n.

~~~cpp
const long long MOD = 1e9 + 7;

long long modpow(long long a, long long e) {
    long long r = 1;
    for (; e; e >>= 1, a = a * a % MOD)
        if (e & 1) r = r * a % MOD;
    return r;
}

long long lagrange(const vector<long long>& y, long long x) {
    int n = (int)y.size() - 1;
    if (0 <= x && x <= n) return y[x];

    vector<long long> pref(n + 2, 1), suff(n + 2, 1), fact(n + 1, 1);
    for (int i = 1; i <= n; i++) fact[i] = fact[i - 1] * i % MOD;
    for (int i = 0; i <= n; i++) pref[i + 1] = pref[i] * ((x - i + MOD) % MOD) % MOD;
    for (int i = n; i >= 0; i--) suff[i] = suff[i + 1] * ((x - i + MOD) % MOD) % MOD;

    long long ans = 0;
    for (int i = 0; i <= n; i++) {
        long long den = fact[i] * fact[n - i] % MOD;
        if ((n - i) & 1) den = (MOD - den) % MOD;
        long long term = y[i] % MOD * pref[i] % MOD * suff[i + 1] % MOD;
        ans = (ans + term * modpow(den, MOD - 2)) % MOD;
    }
    return ans;
}
~~~

## Cuidados

- A implementação requer MOD primo, pontos distintos 0..n e n < MOD.
- O vetor y deve conter valores normalizados módulo MOD.
- O grau máximo é n, pois há n+1 amostras.
- Para abscissas arbitrárias, use a fórmula geral de Lagrange; esta versão explora pontos consecutivos.
