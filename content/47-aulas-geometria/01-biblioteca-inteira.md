---
title: Biblioteca de geometria com inteiros
summary: Ponto, dot, cross, orient, dist², área (shoelace), ponto no segmento, ray casting, ponto em convexo O(log n) e fecho de Andrew.
status: done
complexity: O(1) / O(n) / O(log n) / O(n log n)
tags: geometria, orient, cross, área, ray casting, convex hull, aula
---

## Código

```cpp
// Geometria com INTEIROS (long long): |coord| <= 1e9 -> produtos até ~2e18 cabem em long long
using ll = long long;
struct P {
    ll x, y;
    P operator-(const P &o) const { return {x - o.x, y - o.y}; }
    P operator+(const P &o) const { return {x + o.x, y + o.y}; }
    bool operator<(const P &o) const { return x != o.x ? x < o.x : y < o.y; }
    bool operator==(const P &o) const { return x == o.x && y == o.y; }
};
ll dot(P u, P v) { return u.x * v.x + u.y * v.y; }          // |u||v|cos: >0 agudo, 0 reto, <0 obtuso
ll cross(P u, P v) { return u.x * v.y - u.y * v.x; }        // |u||v|sen: >0 v à esquerda de u
ll orient(P a, P b, P c) { return cross(b - a, c - a); }    // >0 esquerda, <0 direita, 0 colineares
ll dist2(P a, P b) { return dot(a - b, a - b); }            // distância ao quadrado (exata)
ll manhattan(P a, P b) { return llabs(a.x - b.x) + llabs(a.y - b.y); }

// 2 * área com sinal (> 0 se anti-horário). Shoelace / fórmula do laço.
ll area2(const vector<P> &p) {
    ll s = 0;
    for (size_t i = 0, n = p.size(); i < n; i++) s += cross(p[i], p[(i + 1) % n]);
    return s;
}
// p no segmento [a, b]?
bool on_segment(P a, P b, P p) { return orient(a, b, p) == 0 && dot(a - p, b - p) <= 0; }

// ponto em polígono qualquer: 1 dentro, 0 borda, -1 fora (ray casting, raio para a direita)
int in_polygon(const vector<P> &poly, P p) {
    int n = poly.size(), cnt = 0;
    for (int i = 0; i < n; i++) {
        P a = poly[i], b = poly[(i + 1) % n];
        if (on_segment(a, b, p)) return 0;
        bool sobe = b.y > a.y;
        if ((a.y > p.y) != (b.y > p.y))                     // cruza a altura de p (meio aberto)
            if ((orient(a, b, p) > 0) == sobe) cnt++;       // cruzamento à direita de p
    }
    return cnt % 2 ? 1 : -1;
}

// ponto em polígono convexo anti-horário em O(log n). estrito=false: borda conta como dentro
bool in_convex(const vector<P> &p, P q, bool estrito = false) {
    int n = p.size();
    if (!estrito) { if (orient(p[0], p[1], q) < 0 || orient(p[0], p[n - 1], q) > 0) return false; }
    else          { if (orient(p[0], p[1], q) <= 0 || orient(p[0], p[n - 1], q) >= 0) return false; }
    int lo = 1, hi = n - 1;
    while (hi - lo > 1) {                                   // fatia (p0, p[lo], p[lo+1])
        int mid = (lo + hi) / 2;
        if (orient(p[0], p[mid], q) >= 0) lo = mid; else hi = mid;
    }
    ll o = orient(p[lo], p[lo + 1], q);
    return estrito ? o > 0 : o >= 0;
}

// Fecho convexo (Andrew / monotone chain), anti-horário.
// manter_colineares=false: "<= 0" tira pontos no meio dos lados; true: "< 0" mantém (exige área > 0)
vector<P> hull(vector<P> pts, bool manter_colineares = false) {
    sort(pts.begin(), pts.end());
    pts.erase(unique(pts.begin(), pts.end()), pts.end());
    if (pts.size() <= 2) return pts;
    auto meia = [&](const vector<P> &v) {
        vector<P> st;
        for (P p : v) {
            while (st.size() >= 2) {
                ll o = orient(st[st.size() - 2], st.back(), p);
                if (o < 0 || (o == 0 && !manter_colineares)) st.pop_back(); else break;
            }
            st.push_back(p);
        }
        return st;
    };
    vector<P> baixo = meia(pts), rev(pts.rbegin(), pts.rend()), cima = meia(rev);
    baixo.pop_back(); cima.pop_back();                      // pontas não repetem
    baixo.insert(baixo.end(), cima.begin(), cima.end());
    return baixo;
}
```

## Uso

- Tudo exato em `long long` com `|coord| ≤ 10⁹`. Área real = `abs(area2(p)) / 2.0` (ou imprima `area2` se pedirem 2× área).
- `in_convex` exige polígono **estritamente convexo e anti-horário** (horário: `reverse`).
- `in_polygon` vale para polígono simples qualquer (côncavo também) e já trata a borda.
- `hull(pts, true)` mantém pontos no meio dos lados (exige área positiva; todos colineares → trate à parte).
