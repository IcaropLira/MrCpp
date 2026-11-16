---
title: Euclides estendido, inverso modular e CRT
summary: Resolve equações diofantinas lineares e sistemas de congruências.
status: done
complexity: O(log min(a,b)) por Euclides estendido
tags: matematica, gcd, modular, crt
---

## Euclides estendido

Encontra x e y tais que ax + by = gcd(a,b).

~~~cpp
long long ext_gcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) {
        x = (a >= 0 ? 1 : -1);
        y = 0;
        return abs(a);
    }
    long long x1, y1;
    long long g = ext_gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}
~~~

## Inverso modular

O inverso de a módulo m existe se, e somente se, gcd(a,m)=1.

~~~cpp
long long mod_norm(__int128 x, long long m) {
    x %= m;
    if (x < 0) x += m;
    return (long long)x;
}

long long mod_inverse(long long a, long long m) {
    long long x, y;
    long long g = ext_gcd(a, m, x, y);
    if (g != 1) return -1;
    return mod_norm(x, m);
}
~~~

## Teorema Chinês dos Restos — módulos não necessariamente coprimos

Mescla x ≡ a (mod m) e x ≡ b (mod n). Retorna false se não houver solução ou se o MMC não couber em long long.

~~~cpp
bool crt_merge(long long& a, long long& m, long long b, long long n) {
    long long x, y;
    long long g = ext_gcd(m, n, x, y);
    __int128 diff = (__int128)b - a;
    if (diff % g != 0) return false;

    long long n2 = n / g;
    long long t = mod_norm((diff / g) * x, n2);
    __int128 lcm = (__int128)(m / g) * n;
    if (lcm > LLONG_MAX) return false;

    a = mod_norm((__int128)a + (__int128)m * t, (long long)lcm);
    m = (long long)lcm;
    return true;
}
~~~

- Comece o sistema com a = 0 e m = 1; mescle cada congruência.
- Todos os módulos devem ser positivos.
- mod_inverse retorna -1 quando o inverso não existe.
- __int128 evita overflow intermediário, mas o resultado final do CRT ainda deve caber em long long.
