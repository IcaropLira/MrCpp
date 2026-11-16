---
title: Half-Plane Intersection
summary: Interseção de semiplanos que forma uma região convexa limitada usando ordenação angular e deque.
status: done
complexity: O(n log n)
tags: geometria, half-plane, semiplanos, deque
---

## Quando usar

Quando cada reta orientada define o semiplano à sua esquerda e queremos obter o polígono convexo resultante. Esta implementação considera interseção limitada com área positiva.

## Código

~~~cpp
using ld = long double;
const ld EPS = 1e-12;

struct Point {
    ld x, y;
    Point operator+(Point b) const { return {x+b.x, y+b.y}; }
    Point operator-(Point b) const { return {x-b.x, y-b.y}; }
    Point operator*(ld k) const { return {x*k, y*k}; }
};

ld cross(Point a, Point b) { return a.x*b.y - a.y*b.x; }

struct Line {
    Point p, v; // reta p + t*v; semiplano à esquerda
    ld ang;
};

Point intersection(Line a, Line b) {
    ld t = cross(b.p - a.p, b.v) / cross(a.v, b.v);
    return a.p + a.v * t;
}

bool outside(Line l, Point p) {
    return cross(l.v, p - l.p) < -EPS;
}

vector<Point> half_plane_intersection(vector<Line> lines) {
    for (auto& l : lines) l.ang = atan2l(l.v.y, l.v.x);
    sort(lines.begin(), lines.end(), [](Line a, Line b) {
        return a.ang < b.ang;
    });

    vector<Line> v;
    for (Line l : lines) {
        if (!v.empty() && fabsl(l.ang - v.back().ang) < EPS) {
            if (cross(v.back().v, l.p - v.back().p) > EPS)
                v.back() = l;
        } else v.push_back(l);
    }

    deque<Line> dq;
    for (Line l : v) {
        while (dq.size() > 1 &&
               outside(l, intersection(dq[dq.size()-2], dq.back())))
            dq.pop_back();
        while (dq.size() > 1 &&
               outside(l, intersection(dq[0], dq[1])))
            dq.pop_front();
        dq.push_back(l);
    }

    while (dq.size() > 2 &&
           outside(dq.front(), intersection(dq[dq.size()-2], dq.back())))
        dq.pop_back();
    while (dq.size() > 2 &&
           outside(dq.back(), intersection(dq[0], dq[1])))
        dq.pop_front();

    if (dq.size() < 3) return {};
    vector<Point> poly;
    for (int i = 0; i < (int)dq.size(); i++) {
        Line a = dq[i], b = dq[(i+1)%dq.size()];
        if (fabsl(cross(a.v,b.v)) < EPS) return {};
        poly.push_back(intersection(a,b));
    }
    return poly;
}
~~~

## Convenções e limitações

- Cada linha define o lado esquerdo como região válida.
- A região final deve ser limitada e ter área positiva; conjunto vazio, faixa ilimitada ou degenerescência retorna vetor vazio.
- Linhas paralelas com mesma direção são reduzidas à mais restritiva.
- A implementação usa EPS e atan2; para coordenadas inteiras exatas, prefira predicados robustos.
- Não misture a orientação das retas: inverter v inverte o semiplano.
