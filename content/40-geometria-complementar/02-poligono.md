---
title: Polígono, centroide, Pick e convexidade
summary: Área com sinal, centroide, teorema de Pick e teste exato de convexidade de polígonos de vértices inteiros.
status: done
complexity: O(n)
tags: geometria, polígono, centroide, pick, convexidade
---

## Ideia

- **Área com sinal**: a fórmula do cadarço dá `2A`, positiva para polígonos anti-horários.
- **Centroide**: cada aresta `(a, b)` contribui com `(a + b) * cross(a, b)`; o centroide é a soma dividida por `3 * (2A)`.
- **Pick**: para polígono simples com vértices inteiros, `A = I + B/2 - 1`, em que `I` são os pontos inteiros internos e `B` os da borda. `B` é a soma de `gcd(|dx|, |dy|)` das arestas.
- **Convexidade**: orienta-se o polígono no sentido anti-horário; ele é convexo e simples se todas as curvas são à esquerda (ou retas) e as direções das arestas dão exatamente uma volta, o que exclui estrelas como o pentagrama.

## Código

```cpp
using P = pair<ll, ll>;

ll area2(const vector<P>& p) { // 2 × área; positivo se anti-horário
    ll s = 0;
    int n = p.size();
    for (int i = 0; i < n; i++) {
        P a = p[i], b = p[(i + 1) % n];
        s += a.first * b.second - a.second * b.first;
    }
    return s;
}

ll boundary(const vector<P>& p) { // pontos inteiros na borda
    ll s = 0;
    int n = p.size();
    for (int i = 0; i < n; i++) {
        P a = p[i], b = p[(i + 1) % n];
        s += __gcd(llabs(a.first - b.first), llabs(a.second - b.second));
    }
    return s;
}

ll interior(const vector<P>& p) { // Pick: I = (2A - B + 2) / 2
    return (llabs(area2(p)) - boundary(p) + 2) / 2;
}

pair<long double, long double> centroid(const vector<P>& p) { // área != 0
    long double cx = 0, cy = 0;
    int n = p.size();
    for (int i = 0; i < n; i++) {
        P a = p[i], b = p[(i + 1) % n];
        long double w = (long double)a.first * b.second - (long double)a.second * b.first;
        cx += (a.first + b.first) * w;
        cy += (a.second + b.second) * w;
    }
    long double d = 3.0L * area2(p);
    return {cx / d, cy / d};
}

bool is_convex(vector<P> p) { // simples e convexo; colineares permitidos
    ll a2 = area2(p);
    if (a2 == 0) return false;
    if (a2 < 0) reverse(p.begin(), p.end());
    vector<P> e; // arestas não nulas
    int n = p.size();
    for (int i = 0; i < n; i++) {
        P a = p[i], b = p[(i + 1) % n];
        if (a != b) e.push_back({b.first - a.first, b.second - a.second});
    }
    int m = e.size(), voltas = 0;
    auto half = [](P v) { return (v.second > 0 || (v.second == 0 && v.first > 0)) ? 0 : 1; };
    for (int i = 0; i < m; i++) {
        P u = e[i], v = e[(i + 1) % m];
        ll c = u.first * v.second - u.second * v.first;
        ll d = u.first * v.first + u.second * v.second;
        if (c < 0 || (c == 0 && d < 0)) return false; // curva à direita ou meia-volta
        if (half(v) < half(u)) voltas++;               // passou por +x
    }
    return voltas == 1;
}
```

## Uso

`interior(p)` e `boundary(p)` exigem polígono simples. `centroid` devolve o centro de massa da região (densidade uniforme), não a média dos vértices.

## Complexidade e cuidados

- Tudo `O(n)`. Com `|coordenadas| <= 1e9`, cada termo do cadarço cabe em `long long`, mas a soma pode estourar para `n` grande; use `__int128` se necessário.
- No centroide os termos `(a + b) * w` chegam a ordem de `1e27`: por isso a soma é em `long double`. A precisão relativa é cerca de `1e-18`, boa para coordenadas moderadas; para resultado exato, devolva a fração `(Σx, Σy, 3·2A)`.
- Se a área é zero (todos colineares) o centroide não existe; `is_convex` retorna `false`.
- `is_convex` aceita vértices colineares consecutivos e ignora vértices repetidos consecutivos; um polígono que se auto-intercepta com uma única volta não passa no teste de curvas, e os de múltiplas voltas são barrados por `voltas == 1`.
- Pick só vale para polígonos simples de vértices inteiros.
