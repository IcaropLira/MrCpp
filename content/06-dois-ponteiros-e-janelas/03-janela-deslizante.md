---
title: Mínimo da janela deslizante
summary: Mínimo de cada janela de tamanho k.
status: done
complexity: O(n)
tags: deque, janela
---

## Ideia

O deque guarda índices com valores crescentes; o da frente é o mínimo da janela.

## Código

```cpp
vector<int> slidingMin(const vector<int>& a, int k) {
    deque<int> q; vector<int> r;
    for (int i = 0; i < (int)a.size(); i++) {
        while (!q.empty() && a[q.back()] >= a[i]) q.pop_back();
        q.push_back(i);
        if (q.front() <= i - k) q.pop_front();
        if (i >= k - 1) r.push_back(a[q.front()]);
    }
    return r;
}
```
