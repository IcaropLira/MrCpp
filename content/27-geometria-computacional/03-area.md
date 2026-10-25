---
title: Área de polígono
summary: Área de polígono (fórmula do cadarço).
status: done
complexity: O(n)
tags: geometria, área
---

## Ideia

Soma os produtos vetoriais dos vértices consecutivos. O resultado é o dobro da área, com sinal.

## Código

```cpp
ll area2(const vector<pair<ll, ll>>& p) { // 2 × área; positivo se anti-horário
    ll s = 0;
    for (size_t i = 0; i < p.size(); i++) {
        auto a = p[i], b = p[(i + 1) % p.size()];
        s += a.first * b.second - a.second * b.first;
    }
    return s;
}
```
