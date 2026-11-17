---
title: Distâncias
summary: Euclidiana, Manhattan, Chebyshev, o truque da rotação de 45° e distância de ponto a reta/segmento.
status: done
complexity: O(n) para o maior Manhattan
tags: geometria, distância, manhattan, chebyshev
---

## Ideia

A distância de Manhattan `|dx| + |dy|` vira Chebyshev `max(|dx'|, |dy'|)` após girar 45°: `(x, y) -> (x + y, x - y)`. Isso resolve em `O(n)` o par mais distante em Manhattan: é `max(maior(x+y) - menor(x+y), maior(x-y) - menor(x-y))`. A distância de ponto à reta é `|cross| / |ab|`; ao segmento, é a distância à reta se a projeção cai dentro, senão a menor distância a um extremo.

## Código

```cpp
using P = pair<double, double>;

double euclid(P a, P b) { return hypot(a.first - b.first, a.second - b.second); }
double manhattan(P a, P b) { return fabs(a.first - b.first) + fabs(a.second - b.second); }
double chebyshev(P a, P b) { return max(fabs(a.first - b.first), fabs(a.second - b.second)); }

// maior distância de Manhattan entre dois pontos do conjunto, O(n)
double maior_manhattan(const vector<P>& p) {
    double mn1 = 1e18, mx1 = -1e18, mn2 = 1e18, mx2 = -1e18;
    for (auto [x, y] : p) {
        mn1 = min(mn1, x + y); mx1 = max(mx1, x + y);
        mn2 = min(mn2, x - y); mx2 = max(mx2, x - y);
    }
    return max(mx1 - mn1, mx2 - mn2);
}

double dist_ponto_reta(P p, P a, P b) {  // a != b
    double cr = (b.first - a.first) * (p.second - a.second) - (b.second - a.second) * (p.first - a.first);
    return fabs(cr) / euclid(a, b);
}

double dist_ponto_segmento(P p, P a, P b) {
    double dx = b.first - a.first, dy = b.second - a.second;
    double len2 = dx * dx + dy * dy;
    if (len2 == 0) return euclid(p, a);
    double t = ((p.first - a.first) * dx + (p.second - a.second) * dy) / len2;
    t = max(0.0, min(1.0, t));
    return euclid(p, {a.first + t * dx, a.second + t * dy});
}
```

## Complexidade e cuidados

- Para inteiros mantenha o quadrado da distância (`dx² + dy²`) em `long long` e só tire a raiz no fim; comparar quadrados evita erro.
- O truque da rotação também mostra que o círculo de Manhattan é um quadrado girado 45°.
- A menor distância de Manhattan entre pares não sai desse truque: use sweep ou k-d tree.
- `hypot` é mais estável que `sqrt(dx*dx + dy*dy)` para valores muito grandes ou pequenos.
