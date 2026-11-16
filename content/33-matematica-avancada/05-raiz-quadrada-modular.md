---
title: Raiz quadrada modular (Tonelli–Shanks)
summary: Encontra x tal que x² congruente a n módulo primo ímpar.
status: done
complexity: O(log² p) na implementação padrão
tags: teoria dos numeros, raiz modular, tonelli shanks
---

## Quando usar

Para resolver x² = n (mod p), com p primo ímpar. Retorna uma raiz ou -1 se n não for resíduo quadrático.

## Código

~~~cpp
long long modpow(long long a, long long e, long long mod) {
    long long r = 1;
    for (; e; e >>= 1, a = (__int128)a * a % mod)
        if (e & 1) r = (__int128)r * a % mod;
    return r;
}

long long tonelli_shanks(long long n, long long p) {
    n %= p;
    if (n == 0) return 0;
    if (p == 2) return n;
    if (modpow(n, (p - 1) / 2, p) != 1) return -1;
    if (p % 4 == 3) return modpow(n, (p + 1) / 4, p);

    long long q = p - 1, s = 0;
    while (!(q & 1)) q >>= 1, s++;

    long long z = 2;
    while (modpow(z, (p - 1) / 2, p) != p - 1) z++;

    long long c = modpow(z, q, p);
    long long x = modpow(n, (q + 1) / 2, p);
    long long t = modpow(n, q, p);
    long long m = s;

    while (t != 1) {
        long long i = 1, tt = (__int128)t * t % p;
        while (i < m && tt != 1) {
            tt = (__int128)tt * tt % p;
            i++;
        }
        if (i == m) return -1;
        long long b = modpow(c, 1LL << (m - i - 1), p);
        x = (__int128)x * b % p;
        c = (__int128)b * b % p;
        t = (__int128)t * c % p;
        m = i;
    }
    return min(x, p - x);
}
~~~

## Cuidados

- p deve ser primo ímpar; o caso p=2 é tratado.
- Há duas raízes quando n é resíduo não nulo: x e p-x. A função retorna a menor.
- A busca do não-resíduo z é esperada rápida para primo grande.
- Use __int128 na multiplicação para evitar overflow.
