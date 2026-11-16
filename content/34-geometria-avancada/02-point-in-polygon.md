---
title: Point in Polygon
summary: Testa se um ponto está dentro, fora ou sobre a borda de um polígono simples.
status: done
complexity: O(n)
tags: geometria, poligono, ray casting
---

## Código

Retorno: 0 fora, 1 dentro, 2 na borda. Usa coordenadas inteiras e __int128 no produto vetorial.

~~~cpp
using P = pair<long long,long long>;
__int128 cross(P a, P b, P c) {
    return (__int128)(b.first-a.first)*(c.second-a.second)
         - (__int128)(b.second-a.second)*(c.first-a.first);
}

bool on_segment(P p, P a, P b) {
    return cross(a,b,p) == 0 &&
        min(a.first,b.first) <= p.first && p.first <= max(a.first,b.first) &&
        min(a.second,b.second) <= p.second && p.second <= max(a.second,b.second);
}

int point_in_polygon(const vector<P>& poly, P p) {
    bool inside = false;
    int n = poly.size();
    for (int i = 0; i < n; i++) {
        P a = poly[i], b = poly[(i+1)%n];
        if (on_segment(p,a,b)) return 2;

        bool crosses = (a.second > p.second) != (b.second > p.second);
        if (crosses) {
            __int128 cr = cross(a,b,p);
            if ((b.second > a.second && cr > 0) ||
                (b.second < a.second && cr < 0))
                inside = !inside;
        }
    }
    return inside ? 1 : 0;
}
~~~

## Cuidados

- O polígono deve ser simples; auto-interseções tornam a noção usual de interior ambígua.
- A função considera a borda como resultado separado.
- Para coordenadas reais, use EPS consistente e evite comparações exatas.
- __int128 evita overflow intermediário apenas se as coordenadas estiverem dentro dos limites de 64 bits e os produtos couberem em 128 bits.
