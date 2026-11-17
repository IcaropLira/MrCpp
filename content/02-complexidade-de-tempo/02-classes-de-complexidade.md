---
title: Classes de complexidade
summary: O(1), O(log n), O(√n), O(n), O(n log n), O(n²), O(n³), O(2^n) e O(n!): o maior n que cabe em cada uma.
status: done
complexity: —
tags: complexidade, classes, limites
---

## Ideia

Em um juiz, conte com cerca de `10^8` a `10^9` operações simples por segundo. Cada classe, então, tem um tamanho máximo de entrada: `O(n²)` aguenta `n` da ordem de `10^4`; `O(n log n)`, `10^6` a `10^7`; `O(2^n)`, `n` perto de 25; `O(n!)`, `n` perto de 11. Antes de programar, compare o limite do enunciado com essa tabela para decidir a abordagem.

## Código

```cpp
// custo de cada classe para uma entrada de tamanho n
double custo(const string& classe, double n) {
    if (classe == "1") return 1;
    if (classe == "log n") return log2(n);
    if (classe == "sqrt n") return sqrt(n);
    if (classe == "n") return n;
    if (classe == "n log n") return n * log2(max(2.0, n));
    if (classe == "n^2") return n * n;
    if (classe == "n^3") return n * n * n;
    if (classe == "2^n") return pow(2.0, n);
    if (classe == "n!") return tgamma(n + 1);
    return NAN;
}

// maior n inteiro (até 1e18) com custo(classe, n) <= ops
ll maior_n(const string& classe, double ops) {
    ll lo = 1, hi = 1e18;
    if (custo(classe, 1) > ops) return 0;
    while (lo < hi) {
        ll mid = lo + (hi - lo + 1) / 2;
        if (custo(classe, (double)mid) <= ops) lo = mid; else hi = mid - 1;
    }
    return lo;
}
```

## Complexidade e cuidados

- Com `ops = 10^8`: `n^2` dá `n = 10000`, `n^3` dá `464`, `2^n` dá `26`, `n!` dá `11` e `n log n` dá cerca de `5 · 10^6`.
- Para `1` e `log n` o resultado satura em `10^18` (o teto da busca): significa "qualquer n".
- A constante escondida pesa: um laço com `map` ou divisão `%` custa vários nanossegundos por operação; deixe margem de 3 a 10 vezes.
- `O(n log n)` com `n = 10^6` são cerca de `2 · 10^7` operações, folgado; `O(n²)` com o mesmo `n` seria `10^12`, impossível.
