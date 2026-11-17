---
title: Retas e segmentos
summary: Interseção de retas e de segmentos (inclusive colineares), distância ponto-segmento e projeção ponto-reta.
status: done
complexity: O(1)
tags: geometria, segmento, interseção, distância, projeção
---

## Ideia

- **Teste de interseção de segmentos** exato em inteiros: os segmentos se cruzam se `c`, `d` ficam em lados opostos de `ab` e `a`, `b` em lados opostos de `cd`; os casos de toque e de colinearidade são resolvidos testando se alguma extremidade está sobre o outro segmento.
- **Ponto de interseção**: se `cross(b-a, d-c) != 0` as retas se cruzam em `a + (b-a)·t`, com `t = cross(c-a, d-c) / cross(b-a, d-c)`. Se o determinante é zero e os segmentos se tocam, são colineares: a interseção é o segmento entre o maior dos menores e o menor dos maiores extremos (ordem lexicográfica).
- **Distância ponto-segmento**: se a projeção cai fora do segmento, vale a distância ao extremo mais próximo; senão `|cross| / |ab|`.
- **Projeção** do ponto `p` na reta `ab`: `a + (b-a)·dot(p-a, b-a) / |b-a|²`.

## Código

```cpp
struct P { ll x, y; };
struct Q { long double x, y; };
P operator-(P a, P b) { return {a.x - b.x, a.y - b.y}; }
bool operator<(P a, P b) { return tie(a.x, a.y) < tie(b.x, b.y); }
bool operator==(P a, P b) { return a.x == b.x && a.y == b.y; }
ll cross(P a, P b) { return a.x * b.y - a.y * b.x; }
ll dot(P a, P b) { return a.x * b.x + a.y * b.y; }
int sgn(ll v) { return (v > 0) - (v < 0); }

// p está sobre o segmento ab (inclusive extremos)?
bool on_seg(P a, P b, P p) {
    return cross(b - a, p - a) == 0 && min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x) &&
           min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);
}

// Os segmentos ab e cd têm algum ponto em comum? (aceita segmentos degenerados)
bool seg_inter(P a, P b, P c, P d) {
    int d1 = sgn(cross(b - a, c - a)), d2 = sgn(cross(b - a, d - a));
    int d3 = sgn(cross(d - c, a - c)), d4 = sgn(cross(d - c, b - c));
    if (d1 * d2 < 0 && d3 * d4 < 0) return true;
    return on_seg(a, b, c) || on_seg(a, b, d) || on_seg(c, d, a) || on_seg(c, d, b);
}

// Interseção das retas ab e cd (a != b, c != d); false se paralelas.
bool line_inter(P a, P b, P c, P d, Q& r) {
    ll den = cross(b - a, d - c);
    if (den == 0) return false;
    long double t = (long double)cross(c - a, d - c) / den;
    r = {a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t};
    return true;
}

// Pontos da interseção dos segmentos: 0, 1 ou 2 (extremos do trecho comum).
vector<Q> seg_points(P a, P b, P c, P d) {
    if (!seg_inter(a, b, c, d)) return {};
    Q r;
    if (cross(b - a, d - c) != 0) { line_inter(a, b, c, d, r); return {r}; }
    P lo = max(min(a, b), min(c, d)), hi = min(max(a, b), max(c, d));
    if (lo == hi) return {{(long double)lo.x, (long double)lo.y}};
    return {{(long double)lo.x, (long double)lo.y}, {(long double)hi.x, (long double)hi.y}};
}

long double dist_point_seg(P a, P b, P p) {
    if (dot(p - a, b - a) <= 0) return sqrtl((long double)dot(p - a, p - a));
    if (dot(p - b, a - b) <= 0) return sqrtl((long double)dot(p - b, p - b));
    return fabsl((long double)cross(b - a, p - a)) / sqrtl((long double)dot(b - a, b - a));
}

Q project(P a, P b, P p) { // projeção de p na reta ab (a != b)
    long double t = (long double)dot(p - a, b - a) / dot(b - a, b - a);
    return {a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t};
}
```

## Uso

`seg_inter` responde sim/não; `seg_points` devolve o ponto único ou, no caso colinear, os dois extremos do trecho comum. A reflexão de `p` na reta é `2·project(p) - p`.

## Complexidade e cuidados

- Tudo `O(1)`. Os testes de orientação são exatos; só a coordenada final do ponto é `long double`.
- Com `|coordenadas| <= 1e9` cada `cross` chega a `8e18` e cabe em `long long`; acima disso use `__int128`.
- Segmentos colineares disjuntos, que apenas se tocam ou que se sobrepõem são tratados por `on_seg` e pela ordem lexicográfica; segmentos degenerados (`a == b`) também funcionam em `seg_inter` e `seg_points`.
- `line_inter` e `project` exigem retas não degeneradas. Para provar que a interseção é um ponto inteiro, teste `cross(c - a, d - c) % den == 0` e a divisão exata de cada coordenada, em vez de arredondar `double`.
