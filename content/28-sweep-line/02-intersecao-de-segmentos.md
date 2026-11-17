---
title: Interseção de segmentos
summary: Detecta se algum par de segmentos se cruza com uma varredura em O(n log n) (Shamos-Hoey).
status: done
complexity: O(n log n)
tags: sweep line, geometria, segmentos, interseção
---

## Ideia

Varra da esquerda para a direita mantendo em um `set`, ordenado pela altura na posição atual, os segmentos que cruzam a reta de varredura. Dois segmentos que se cruzam são vizinhos no `set` em algum momento antes do cruzamento, então basta testar cada segmento que entra contra seu antecessor e sucessor, e, quando um sai, testar o antecessor contra o sucessor. Eventos de entrada vêm antes dos de saída na mesma coordenada, para detectar contatos nas pontas.

## Código

```cpp
struct Seg {
    double px, py, qx, qy;  // normalizado: px < qx, ou px == qx e py <= qy
    int id;
    double y(double x) const {
        if (fabs(px - qx) < 1e-9) return py;
        return py + (qy - py) * (x - px) / (qx - px);
    }
};
const double EPS = 1e-9;

bool inter1d(double l1, double r1, double l2, double r2) {
    if (l1 > r1) swap(l1, r1);
    if (l2 > r2) swap(l2, r2);
    return max(l1, l2) <= min(r1, r2) + EPS;
}
int sinal(double v) { return fabs(v) < EPS ? 0 : (v > 0 ? 1 : -1); }
double orient(double ax, double ay, double bx, double by, double cx, double cy) {
    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}
bool interseca(const Seg& a, const Seg& b) {
    return inter1d(a.px, a.qx, b.px, b.qx) && inter1d(a.py, a.qy, b.py, b.qy)
        && sinal(orient(a.px, a.py, a.qx, a.qy, b.px, b.py)) * sinal(orient(a.px, a.py, a.qx, a.qy, b.qx, b.qy)) <= 0
        && sinal(orient(b.px, b.py, b.qx, b.qy, a.px, a.py)) * sinal(orient(b.px, b.py, b.qx, b.qy, a.qx, a.qy)) <= 0;
}
struct Menor {
    bool operator()(const Seg& a, const Seg& b) const {
        double x = max(min(a.px, a.qx), min(b.px, b.qx));
        return a.y(x) < b.y(x) - EPS;
    }
};

// segmentos {x1, y1, x2, y2}; devolve {i, j} de um par que se interseca (qualquer contato conta), ou {-1, -1}
pair<int, int> algum_par(const vector<array<double, 4>>& in) {
    int n = in.size();
    vector<Seg> a(n);
    for (int i = 0; i < n; i++) {
        auto [x1, y1, x2, y2] = in[i];
        if (make_pair(x1, y1) > make_pair(x2, y2)) swap(x1, x2), swap(y1, y2);
        a[i] = {x1, y1, x2, y2, i};
    }
    vector<tuple<double, int, int>> ev;  // (x, tipo, id): tipo 0 = entra, 1 = sai
    for (int i = 0; i < n; i++) ev.push_back({a[i].px, 0, i}), ev.push_back({a[i].qx, 1, i});
    sort(ev.begin(), ev.end());
    set<Seg, Menor> s;
    vector<set<Seg, Menor>::iterator> onde(n);
    for (auto [x, tipo, id] : ev) {
        if (tipo == 0) {
            auto nx = s.lower_bound(a[id]);
            auto pv = nx == s.begin() ? s.end() : prev(nx);
            if (nx != s.end() && interseca(*nx, a[id])) return {nx->id, id};
            if (pv != s.end() && interseca(*pv, a[id])) return {pv->id, id};
            onde[id] = s.insert(nx, a[id]);
        } else {
            auto nx = next(onde[id]);
            auto pv = onde[id] == s.begin() ? s.end() : prev(onde[id]);
            if (nx != s.end() && pv != s.end() && interseca(*nx, *pv)) return {nx->id, pv->id};
            s.erase(onde[id]);
        }
    }
    return {-1, -1};
}
```

## Complexidade e cuidados

- Aqui qualquer contato conta como interseção (pontas se tocando, segmentos colineares sobrepostos, pontos degenerados).
- A comparação usa `double` com `EPS`; com coordenadas inteiras até cerca de `1e6` é segura. Para coordenadas maiores use aritmética exata com frações.
- Só decide *se* existe um par que se cruza (e devolve um); contar ou listar todos os cruzamentos pede o algoritmo de Bentley-Ottmann.
- Segmentos verticais são tratados com `y(x) = py` (a ponta inferior), o que basta para a ordem de varredura.
