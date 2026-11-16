---
title: Interseção entre círculos
summary: Calcula os pontos de interseção entre dois círculos no plano.
status: done
complexity: O(1)
tags: geometria, circulos, intersecao
---

## Ideia

Seja d a distância entre centros. Não há interseção se d > r1+r2 ou d < |r1-r2|. O pé da perpendicular sobre a linha dos centros determina o ponto médio da corda; a altura é obtida por Pitágoras.

## Código

~~~cpp
using ld = long double;
const ld EPS = 1e-12;
struct Point { ld x, y; };
Point operator+(Point a, Point b) { return {a.x+b.x, a.y+b.y}; }
Point operator-(Point a, Point b) { return {a.x-b.x, a.y-b.y}; }
Point operator*(Point a, ld k) { return {a.x*k, a.y*k}; }
ld dot(Point a, Point b) { return a.x*b.x + a.y*b.y; }
ld norm2(Point a) { return dot(a,a); }

vector<Point> circle_intersection(Point a, ld r, Point b, ld s) {
    Point d = b - a;
    ld d2 = norm2(d), dist = sqrtl(d2);
    if (dist < EPS) return {}; // círculos concêntricos: nenhum ou infinitos pontos
    if (dist > r+s+EPS || dist < fabsl(r-s)-EPS) return {};

    ld x = (d2 + r*r - s*s) / (2*dist);
    ld h2 = r*r - x*x;
    if (h2 < -EPS) return {};
    ld h = sqrtl(max((ld)0, h2));
    Point unit = d * (1/dist);
    Point base = a + unit*x;
    Point perp{-unit.y, unit.x};

    if (h < EPS) return {base};
    return {base + perp*h, base - perp*h};
}
~~~

## Cuidados

- Círculos coincidentes têm infinitos pontos; a função retorna vetor vazio nesse caso, assim como no caso sem interseção.
- Use long double e EPS adequado à escala das coordenadas.
- Tangência retorna um único ponto.
