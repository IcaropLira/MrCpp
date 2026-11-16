---
title: Logaritmo discreto (Baby-step Giant-step)
summary: Encontra x mínimo não negativo tal que a^x congruente a b módulo m, para m primo.
status: done
complexity: O(sqrt(m)) tempo e memória
tags: teoria dos numeros, discrete log, bsgs
---

## Quando usar

Quando precisamos resolver a^x = b (mod p), com p primo e a não nulo módulo p. A versão abaixo busca x no intervalo [0,p-2].

## Código

~~~cpp
long long modpow_bsgs(long long a, long long e, long long mod) {\n    long long r = 1;\n    for (; e; e >>= 1, a = a * a % mod)\n        if (e & 1) r = r * a % mod;\n    return r;\n}\n\nlong long discrete_log(long long a, long long b, long long p) {
    a %= p; b %= p;\n    if (a < 0) a += p;\n    if (b < 0) b += p;
    if (b == 1) return 0;
    if (a == 0) return b == 0 ? 1 : -1;

    long long m = (long long)sqrtl(p - 1) + 1;
    unordered_map<long long, long long> baby;
    long long cur = 1;
    for (long long j = 0; j < m; j++) {
        if (!baby.count(cur)) baby[cur] = j;
        cur = cur * a % p;
    }

    long long factor = modpow_bsgs(a, (p - 1 - m % (p - 1)) % (p - 1), p);
    cur = b;
    for (long long i = 0; i <= m; i++) {
        if (baby.count(cur)) return i * m + baby[cur];
        cur = cur * factor % p;
    }
    return -1;
}
~~~

## Cuidados

- Requer p primo e a != 0 para o caso geral; modpow deve usar o mesmo módulo p.
- A multiplicação a*b precisa caber em long long; para módulos maiores use __int128.
- Para módulo composto ou gcd(a,m) != 1, use a versão estendida de BSGS.
- O retorno -1 indica que não foi encontrado expoente no intervalo procurado.
