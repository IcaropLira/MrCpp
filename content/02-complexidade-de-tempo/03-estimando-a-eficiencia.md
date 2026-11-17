---
title: Estimando a eficiência
summary: Do limite do enunciado à complexidade necessária, e como medir o tempo real.
status: done
complexity: —
tags: complexidade, limites, desempenho
---

## Ideia

Leia as restrições antes de pensar no algoritmo: o maior `n` indica a complexidade permitida. Regra de bolso para 1 segundo: `n <= 11` aceita `O(n!)`; `n <= 25`, `O(2^n)` (ou `O(2^(n/2))` em meet in the middle para `n <= 40`); `n <= 500`, `O(n³)`; `n <= 5000`, `O(n²)`; `n <= 10^6`, `O(n log n)`; `n <= 10^8`, `O(n)`; acima disso, `O(log n)` ou fórmula fechada. Quando o palpite estiver no limite, meça.

## Código

```cpp
// complexidade mais cara que costuma caber em ~1 s para um dado n
string complexidade_maxima(ll n) {
    if (n <= 11) return "n!";
    if (n <= 25) return "2^n";
    if (n <= 500) return "n^3";
    if (n <= 5000) return "n^2";
    if (n <= 1000000) return "n log n";
    if (n <= 100000000) return "n";
    return "log n";
}

// mede o tempo (em ms) de uma função
template <class F> double medir_ms(F f) {
    auto t0 = chrono::steady_clock::now();
    f();
    return chrono::duration<double, milli>(chrono::steady_clock::now() - t0).count();
}
```

## Complexidade e cuidados

- A tabela é um ponto de partida: constantes pequenas aceitam mais, constantes grandes (estruturas com `map`, recursão profunda) aceitam menos.
- Entradas pequenas com muitos casos de teste: some `n` de todos os casos, ou o limite por caso, conforme o enunciado.
- Compile com `-O2` para medir: sem otimização o tempo pode ser 3 a 10 vezes pior.
- Sempre meça com a *pior* entrada (ordenada, toda igual, grafo em cadeia), não só com a aleatória.
