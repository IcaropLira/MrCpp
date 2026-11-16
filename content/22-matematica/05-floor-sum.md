---
title: Floor Sum
summary: Soma floor((a*i+b)/m) para i de 0 até n-1 em tempo logarítmico.
status: done
complexity: O(log m)
tags: matematica, floor sum, euclides
---

## Quando usar

Contar pontos em regiões discretas, somar pisos de progressões e resolver problemas de contagem com desigualdades lineares.

## Código

~~~cpp
__int128 floor_sum(long long n, long long m, long long a, long long b) {
    // Requer n >= 0, m > 0, a >= 0 e b >= 0.
    __int128 ans = 0;

    while (true) {
        if (a >= m) {
            ans += (__int128)(n-1) * n * (a/m) / 2;
            a %= m;
        }
        if (b >= m) {
            ans += (__int128)n * (b/m);
            b %= m;
        }

        __int128 y = (__int128)a * n + b;
        if (y < m) break;

        n = (long long)(y / m);
        b = (long long)(y % m);
        swap(m, a);
    }
    return ans;
}
~~~

- Calcula Σ floor((a*i+b)/m), para 0 <= i < n.
- Usa __int128 no acumulador e nos produtos intermediários.
- Os parâmetros devem ser não negativos e m positivo.
- Se a resposta final couber em long long, converta ao imprimir; caso contrário, imprima __int128 com uma rotina própria.
