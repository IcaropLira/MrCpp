---
title: Lema de Burnside
summary: Conta colares e pulseiras distintos (a menos de rotação e reflexão) fazendo a média dos pontos fixos.
status: done
complexity: O(n log n)
tags: combinatória, burnside, colares, simetria
---

## Ideia

O número de órbitas (configurações distintas a menos de simetria) é a média, sobre os elementos do grupo, do número de configurações que cada elemento deixa fixas. Para colares de `n` contas e `k` cores, a rotação por `i` posições divide as contas em `gcd(i, n)` ciclos, e cada ciclo tem uma cor: `k^gcd(i, n)` pontos fixos. Para pulseiras, some também as `n` reflexões.

## Código

```cpp
// colares: n contas, k cores, rotações. Exato enquanto k^n couber em __int128 (k^n < 1.7e38)
ll colares(int n, int k) {
    __int128 soma = 0;
    for (int i = 0; i < n; i++) {
        int g = __gcd(i, n);  // gcd(0, n) = n
        __int128 p = 1;
        for (int j = 0; j < g; j++) p *= k;
        soma += p;
    }
    return (ll)(soma / n);
}

// pulseiras: rotações e reflexões
ll pulseiras(int n, int k) {
    auto pot = [&](int e) { __int128 p = 1; for (int j = 0; j < e; j++) p *= k; return p; };
    __int128 soma = 0;
    for (int i = 0; i < n; i++) soma += pot(__gcd(i, n));
    if (n % 2) soma += (__int128)n * pot((n + 1) / 2);
    else soma += (__int128)(n / 2) * pot(n / 2 + 1) + (__int128)(n / 2) * pot(n / 2);
    return (ll)(soma / (2 * n));
}
```

## Complexidade e cuidados

- Resultados curtos: `colares(4, 2) = 6`, `pulseiras(4, 2) = 6`, `colares(6, 2) = 14`, `pulseiras(6, 2) = 13`.
- Para `n` grande, sob módulo primo, troque a divisão por `n` pelo inverso modular e some `phi(d) · k^(n/d)` sobre divisores `d` de `n`.
- Outras simetrias (rotações de um cubo, de uma grade) seguem o mesmo molde: liste o grupo e conte os ciclos de cada elemento.
- Confira sempre o caso `n = 0` ou `n = 1` quando o enunciado permitir.
