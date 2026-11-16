---
title: Crivo linear e fatoração
summary: Calcula menores fatores primos e permite fatorar inteiros rapidamente.
status: done
complexity: O(n) pré-processamento; O(log x) fatores distintos após o crivo
tags: matematica, primos, sieve, fatoracao
---

## Código

~~~cpp
struct LinearSieve {
    int n;
    vector<int> lp, primes;

    LinearSieve(int n) : n(n), lp(n+1) {
        for (int i = 2; i <= n; i++) {
            if (lp[i] == 0) lp[i] = i, primes.push_back(i);
            for (int p : primes) {
                if (p > lp[i] || 1LL*i*p > n) break;
                lp[i*p] = p;
            }
        }
    }

    vector<pair<int,int>> factorize(int x) const {
        vector<pair<int,int>> f;
        while (x > 1) {
            int p = lp[x], e = 0;
            while (x % p == 0) x /= p, e++;
            f.push_back({p, e});
        }
        return f;
    }
};
~~~

## Cuidados

- factorize só aceita 1 <= x <= n.
- lp[x] guarda o menor fator primo de x.
- O crivo linear usa cada composto uma única vez.
- Para fatorar valores muito maiores que o limite do crivo, use divisão até sqrt(x) ou Pollard Rho.
