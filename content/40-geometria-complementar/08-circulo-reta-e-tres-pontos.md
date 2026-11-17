---
title: Círculo e reta; círculo por três pontos
summary: Interseção de círculo com reta (decisão exata em inteiros) e circuncírculo de três pontos.
status: done
complexity: O(1)
tags: geometria, círculo, reta, circuncírculo
---

## Ideia

- **Círculo × reta**: sendo `d = b - a`, a distância do centro `c` à reta é `|cross(d, c-a)| / |d|`. Compara-se o quadrado: `disc = r²·|d|² - cross²`. Se `disc < 0` não há interseção, se `disc == 0` a reta é tangente, senão há dois pontos. O pé da perpendicular está em `a + d·t0`, com `t0 = dot(c-a, d) / |d|²`, e os pontos ficam a `±sqrt(disc)/|d|²` em unidades de `t`.
- **Circuncírculo**: com `u = b - a` e `v = c - a`, o centro relativo a `a` é `((v.y·|u|² - u.y·|v|²), (u.x·|v|² - v.x·|u|²)) / (2·cross(u, v))`. Se `cross(u, v) == 0` os pontos são colineares e não há círculo.

A interseção entre dois círculos está em `34-geometria-avancada/01-intersecao-circulos`.

## Código

```cpp
struct P { ll x, y; };
struct Q { long double x, y; };
P operator-(P a, P b) { return {a.x - b.x, a.y - b.y}; }
ll cross(P a, P b) { return a.x * b.y - a.y * b.x; }
ll dot(P a, P b) { return a.x * b.x + a.y * b.y; }

// Círculo de centro c e raio r (inteiros) × reta por a e b (a != b): 0, 1 ou 2 pontos.
vector<Q> circle_line(P c, ll r, P a, P b) {
    P d = b - a;
    ll n2 = dot(d, d);
    __int128 cr = cross(d, c - a);
    __int128 disc = (__int128)r * r * n2 - cr * cr;
    if (disc < 0) return {};
    long double t0 = (long double)dot(c - a, d) / n2;
    Q f = {a.x + d.x * t0, a.y + d.y * t0};
    if (disc == 0) return {f};
    long double h = sqrtl((long double)disc) / n2;
    return {{f.x - d.x * h, f.y - d.y * h}, {f.x + d.x * h, f.y + d.y * h}};
}

// Circuncírculo de a, b, c; false se colineares.
bool circumcircle(P a, P b, P c, Q& o, long double& r) {
    P u = b - a, v = c - a;
    ll cr = cross(u, v);
    if (cr == 0) return false;
    long double u2 = dot(u, u), v2 = dot(v, v), d = 2.0L * cr;
    long double ux = (v.y * u2 - u.y * v2) / d, uy = (u.x * v2 - v.x * u2) / d;
    o = {a.x + ux, a.y + uy};
    r = hypotl(ux, uy);
    return true;
}
```

## Uso

Para interseção com um segmento, filtre os pontos de `circle_line` pelo parâmetro: um ponto `p` está em `ab` se `0 <= dot(p-a, d) <= dot(d, d)`, com tolerância. O circuncírculo serve para testes de Delaunay e para o círculo mínimo de três pontos.

## Complexidade e cuidados

- `O(1)`. A decisão sobre existir, tangenciar ou cruzar é exata, pois só usa inteiros em `__int128`; só as coordenadas finais são `long double`.
- Com `|coordenadas| <= 1e9` e `r <= 1e9`, `r²·|d|²` chega a `8e36` e `cross²` a `6.4e37`, ambos dentro de `__int128` (cerca de `1.7e38`).
- Reta degenerada (`a == b`) dá divisão por zero: filtre antes.
- Centro ou raio não inteiros pedem tolerância `eps` na comparação de `disc`; prefira escalar a entrada para inteiros.
- No circuncírculo, o `cross` entra em `ll` e `u2`, `v2` em `long double`: com coordenadas muito grandes o resultado perde precisão relativa, mas o teste de colinearidade segue exato.
