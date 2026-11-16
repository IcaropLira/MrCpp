---
title: Minkowski Sum de polígonos convexos
summary: Soma dois polígonos convexos somando vetorialmente suas arestas em ordem angular.
status: done
complexity: O(n + m) após normalização
tags: geometria, minkowski, convex hull, poligonos
---

## Quando usar

Para combinar regiões convexas, testar distância entre polígonos por diferença de Minkowski e resolver problemas de colisão.

## Código

Os polígonos devem estar em ordem anti-horária, sem vértices consecutivos repetidos, e rotacionados para começar no vértice de menor y e depois menor x.

~~~cpp
using ll = long long;
struct Point {
    ll x, y;
    Point operator+(Point b) const { return {x+b.x, y+b.y}; }
    Point operator-(Point b) const { return {x-b.x, y-b.y}; }
};

__int128 cross(Point a, Point b) {
    return (__int128)a.x*b.y - (__int128)a.y*b.x;
}

vector<Point> minkowski(vector<Point> A, vector<Point> B) {
    auto normalize = [](vector<Point>& p) {
        if (p.size() > 1 && p.front().x == p.back().x &&
            p.front().y == p.back().y) p.pop_back();
        int k = min_element(p.begin(), p.end(), [](Point a, Point b) {
            return a.y != b.y ? a.y < b.y : a.x < b.x;
        }) - p.begin();
        rotate(p.begin(), p.begin() + k, p.end());
    };
    normalize(A);
    normalize(B);

    int n = A.size(), m = B.size();
    if (!n || !m) return {};

    vector<Point> ea(n), eb(m);
    for (int i = 0; i < n; i++) ea[i] = A[(i+1)%n] - A[i];
    for (int i = 0; i < m; i++) eb[i] = B[(i+1)%m] - B[i];

    int i = 0, j = 0;
    Point cur = A[0] + B[0];
    vector<Point> C{cur};

    while (i < n || j < m) {
        Point step;
        if (i == n) step = eb[j++];
        else if (j == m) step = ea[i++];
        else {
            __int128 cr = cross(ea[i], eb[j]);
            if (cr > 0) step = ea[i++];
            else if (cr < 0) step = eb[j++];
            else step = ea[i++] + eb[j++];
        }
        cur = cur + step;
        C.push_back(cur);
    }

    C.pop_back();
    C.erase(unique(C.begin(), C.end(), [](Point a, Point b) {
        return a.x == b.x && a.y == b.y;
    }), C.end());
    return C;
}
~~~

## Cuidados

- A função pressupõe polígonos convexos anti-horários; não funciona diretamente em polígonos côncavos.
- A normalização rotaciona o início, mas não corrige orientação. Inverta os pontos se a área orientada for negativa.
- Polígonos degenerados (ponto ou segmento) exigem tratamento específico.
- __int128 protege o produto vetorial, mas a soma das coordenadas ainda precisa caber em long long.
