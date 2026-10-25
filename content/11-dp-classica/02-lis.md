---
title: Maior subsequência crescente (LIS)
summary: Maior subsequência estritamente crescente.
status: done
complexity: O(n log n)
tags: dp, lis, busca binária
---

## Ideia

`d[i]` guarda o menor final possível de uma subsequência crescente de tamanho `i + 1`. Cada elemento substitui o primeiro valor maior ou igual a ele.

## Código

```cpp
int lis(const vector<int>& a) {
    vector<int> d;
    for (int x : a) {
        auto it = lower_bound(d.begin(), d.end(), x);
        if (it == d.end()) d.push_back(x); else *it = x;
    }
    return d.size();
}
```

## Uso

Use `upper_bound` no lugar de `lower_bound` para a versão não decrescente.
