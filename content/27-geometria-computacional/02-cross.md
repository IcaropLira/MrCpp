---
title: Produto vetorial e orientação
summary: Produto vetorial e orientação de pontos.
status: done
complexity: O(1)
tags: geometria, cross
---

## Ideia

Positivo: `a` está à esquerda de `o→b`. Zero: colineares. Negativo: à direita.

## Código

```cpp
using P = pair<ll, ll>;
ll cross(P o, P a, P b) {
    return (a.first - o.first) * (b.second - o.second) - (a.second - o.second) * (b.first - o.first);
}
```
