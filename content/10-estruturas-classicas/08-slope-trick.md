---
title: Slope Trick — soma de valores absolutos
summary: Mantém o mínimo de uma soma de funções |x-a| usando duas heaps.
status: done
complexity: O(log n) por inserção
tags: dp, convexidade, heaps
---

## Quando usar

DPs convexas em que a função de custo é uma soma de distâncias absolutas, como minimizar `Σ |x-a[i]|`. O mínimo ocorre em uma mediana.

## Código

```cpp
struct SlopeTrickAbs {
    priority_queue<long long> left;
    priority_queue<long long, vector<long long>, greater<long long>> right;
    long long cost = 0;

    void add_abs(long long a) {
        if (!left.empty() && left.top() > a) {
            cost += left.top() - a;
            left.pop();
            left.push(a);
        }
        if (!right.empty() && right.top() < a) {
            cost += a - right.top();
            right.pop();
            right.push(a);
        }
        left.push(a);
        right.push(a);
    }

    long long minimum() const { return cost; }

    // Um ponto minimizador fica entre max(left) e min(right).
    pair<long long, long long> minimizer_interval() const {
        if (left.empty()) return {LLONG_MIN, LLONG_MAX};
        return {left.top(), right.top()};
    }
};
```

- Esta é a versão especializada para inserir termos `|x-a|`; não é a implementação genérica de todas as operações do Slope Trick.
- O valor mínimo é a soma das distâncias até uma mediana.
- Para DP com deslocamentos, `add_a_x`, `min` e operações de corte, use a representação completa com heaps e lazy offsets.
- A soma e as diferenças devem caber em `long long`.
