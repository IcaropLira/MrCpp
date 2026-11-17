---
title: Círculo mínimo (Welzl)
summary: Menor círculo que contém todos os pontos, em O(n) esperado com ordem aleatória e três laços aninhados.
status: done
complexity: O(n) esperado
tags: geometria, círculo, welzl, aleatorização
---

## Ideia

Embaralha-se os pontos e mantém-se o círculo mínimo dos primeiros `i`. Se o ponto `i` está fora, ele obrigatoriamente está na fronteira do novo círculo: recomeça-se com ele fixo, o que aninha dois laços (um segundo ponto fixo `j`, depois um terceiro `k`). Um círculo fica determinado por 1, 2 (diâmetro) ou 3 pontos (circuncírculo). Com ordem aleatória, a probabilidade de refazer o laço interno decai o suficiente para dar `O(n)` esperado.

## Código

```cpp
struct Pt { double x, y; };
struct C { double x, y, r; };

bool inside(const C& c, Pt p) { return hypot(p.x - c.x, p.y - c.y) <= c.r + 1e-9; }

C circ2(Pt a, Pt b) { return {(a.x + b.x) / 2, (a.y + b.y) / 2, hypot(a.x - b.x, a.y - b.y) / 2}; }

C circ3(Pt a, Pt b, Pt c) {
    double bx = b.x - a.x, by = b.y - a.y, cx = c.x - a.x, cy = c.y - a.y;
    double d = 2 * (bx * cy - by * cx);
    if (fabs(d) < 1e-12) { // colineares: o maior diâmetro
        C u = circ2(a, b), v = circ2(a, c), w = circ2(b, c);
        return u.r >= v.r && u.r >= w.r ? u : (v.r >= w.r ? v : w);
    }
    double b2 = bx * bx + by * by, c2 = cx * cx + cy * cy;
    double ux = (cy * b2 - by * c2) / d, uy = (bx * c2 - cx * b2) / d;
    return {a.x + ux, a.y + uy, hypot(ux, uy)};
}

C min_circle(vector<Pt> p) {
    if (p.empty()) return {0, 0, 0};
    mt19937 rng(712367);
    shuffle(p.begin(), p.end(), rng);
    C c = {p[0].x, p[0].y, 0};
    for (size_t i = 1; i < p.size(); i++) {
        if (inside(c, p[i])) continue;
        c = {p[i].x, p[i].y, 0};
        for (size_t j = 0; j < i; j++) {
            if (inside(c, p[j])) continue;
            c = circ2(p[i], p[j]);
            for (size_t k = 0; k < j; k++)
                if (!inside(c, p[k])) c = circ3(p[i], p[j], p[k]);
        }
    }
    return c;
}
```

## Uso

`min_circle(pontos)` devolve centro e raio. O embaralhamento é essencial: sem ele, entradas ordenadas levam a `O(n³)`.

## Complexidade e cuidados

- `O(n)` esperado; o pior caso só ocorre com sorte adversária do gerador, mas a semente fixa torna a entrada adversária possível em teoria: use `chrono::steady_clock::now().time_since_epoch().count()` se houver hacks.
- Usa `double` e tolerância `1e-9` em `inside`; para coordenadas grandes (acima de `1e6`) escale a tolerância ou use `long double`.
- Pontos duplicados e colineares são seguros: o caso `|d| < 1e-12` em `circ3` escolhe o maior diâmetro entre os três pares.
- Um único ponto dá raio 0; vetor vazio devolve o círculo nulo.
