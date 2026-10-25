---
title: Fecho convexo (Andrew)
summary: Fecho convexo (Andrew).
status: done
complexity: O(n log n)
tags: geometria, fecho convexo
---

## Ideia

Ordena os pontos e monta a parte de baixo e a de cima descartando curvas para a direita.

## Código

```cpp
using P = pair<ll, ll>;
ll cross(P o, P a, P b) { return (a.first - o.first) * (b.second - o.second) - (a.second - o.second) * (b.first - o.first); }
vector<P> hull(vector<P> p) { // anti-horário, sem colineares
    sort(p.begin(), p.end()); p.erase(unique(p.begin(), p.end()), p.end());
    int n = p.size(), k = 0;
    if (n < 3) return p;
    vector<P> h(2 * n);
    for (int i = 0; i < n; i++) { while (k >= 2 && cross(h[k-2], h[k-1], p[i]) <= 0) k--; h[k++] = p[i]; }
    for (int i = n - 2, t = k + 1; i >= 0; i--) { while (k >= t && cross(h[k-2], h[k-1], p[i]) <= 0) k--; h[k++] = p[i]; }
    h.resize(k - 1);
    return h;
}
```
