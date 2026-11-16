---
title: Inversão de Möbius
summary: Inverte somas sobre divisores e múltiplos usando a função de Möbius.
status: done
complexity: O(N log N) para crivo e transformadas
tags: teoria dos numeros, mobius, divisores, inversao
---

## Quando usar

Quando uma função é definida por soma sobre divisores, por exemplo F(n)=soma_{d|n} f(d), e queremos recuperar f. Também é usada para contar pares coprimos por inclusão-exclusão.

## Função de Möbius

- mu(1)=1.
- mu(n)=0 se n possui fator primo ao quadrado.
- mu(n)=(-1)^k se n é produto de k primos distintos.

## Crivo linear

~~~cpp
vector<int> mobius(int n) {
    vector<int> mu(n + 1), lp(n + 1), primes;
    mu[1] = 1;
    for (int i = 2; i <= n; i++) {
        if (!lp[i]) {
            lp[i] = i;
            primes.push_back(i);
            mu[i] = -1;
        }
        for (int p : primes) {
            if (p > lp[i] || 1LL * i * p > n) break;
            lp[i * p] = p;
            if (p == lp[i]) mu[i * p] = 0;
            else mu[i * p] = -mu[i];
        }
    }
    return mu;
}
~~~

## Inversão

Se F(n)=soma_{d|n} f(d), então f(n)=soma_{d|n} mu(d) F(n/d).

Para todos os valores até N, a transformada divisor pode ser calculada por:

~~~cpp
for (int d = 1; d <= N; d++)
    for (int x = d; x <= N; x += d)
        F[x] += f[d];
~~~

A inversão aplica mu[d] sobre F[x/d] para cada divisor d de x.

## Cuidados

- A função mu é multiplicativa, mas não completamente multiplicativa.
- mu(n)=0 quando há fator quadrado; não descarte esses zeros.
- Diferencie soma sobre divisores de soma sobre múltiplos: a ordem dos laços muda.
