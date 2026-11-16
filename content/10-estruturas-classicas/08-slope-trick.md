---
title: Mediana dinâmica — soma de distâncias
summary: Mantém a mediana e a soma de |x-a[i]| com duas heaps.
status: done
complexity: O(log n) por inserção
tags: heaps, mediana, valores absolutos
---

## Quando usar

Inserções online de valores com consultas ao mínimo de `Σ |x-a[i]|`. O mínimo é atingido em qualquer mediana.

## Código

```cpp
struct DynamicMedian {
    priority_queue<long long> lo;
    priority_queue<long long, vector<long long>, greater<long long>> hi;
    long long sumLo = 0, sumHi = 0;

    void add(long long x) {
        if (lo.empty() || x <= lo.top()) {
            lo.push(x);
            sumLo += x;
        } else {
            hi.push(x);
            sumHi += x;
        }

        if (lo.size() > hi.size() + 1) {
            long long v = lo.top(); lo.pop();
            sumLo -= v;
            hi.push(v); sumHi += v;
        } else if (hi.size() > lo.size()) {
            long long v = hi.top(); hi.pop();
            sumHi -= v;
            lo.push(v); sumLo += v;
        }
    }

    long long median() const {
        assert(!lo.empty());
        return lo.top();
    }

    long long min_sum_abs() const {
        if (lo.empty()) return 0;
        long long m = lo.top();
        return m * (long long)lo.size() - sumLo
             + sumHi - m * (long long)hi.size();
    }
};
```

- `lo` contém a metade inferior e tem o mesmo tamanho de `hi` ou um elemento a mais.
- `median()` devolve a mediana inferior; qualquer valor entre as duas medianas minimiza a soma quando n é par.
- A soma, os produtos e as diferenças devem caber em `long long`.
- Esta ficha resolve inserção + custo mínimo absoluto; não é o Slope Trick genérico para DP convexa com operações de deslocamento e corte.
