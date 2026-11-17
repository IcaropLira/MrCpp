---
title: Equações diofantinas lineares
summary: Resolve ax + by = c, descreve todas as soluções e conta as que caem em uma caixa.
status: done
complexity: O(log min(|a|,|b|))
tags: diofantina, euclides estendido, gcd, congruência
---

## Ideia

Com `g = gcd(a,b)`, existe solução se e só se `g | c`. O Euclides estendido dá `ax + by = g`; multiplicando por `c/g` obtém-se uma solução particular. Todas as demais são `x = x0 + t*(b/g)`, `y = y0 - t*(a/g)`, `t` inteiro. Reduzindo `x0` a `[0, |b/g|)` ele vira a menor solução com `x >= 0`. Limites de `x` e `y` viram um intervalo de `t`, o que permite contar soluções.

## Código

```cpp
ll fdiv(ll a, ll b) { return a / b - ((a % b != 0) && ((a < 0) != (b < 0))); }
ll cdiv(ll a, ll b) { return a / b + ((a % b != 0) && ((a < 0) == (b < 0))); }

ll egcd(ll a, ll b, ll& x, ll& y) {
    if (!b) { x = 1; y = 0; return a; }
    ll g = egcd(b, a % b, y, x);
    y -= a / b * x;
    return g;
}

struct Dio { ll x0, y0, dx, dy; }; // x = x0 + t*dx, y = y0 - t*dy

// a e b não ambos nulos; false se não há solução
bool dio(ll a, ll b, ll c, Dio& s) {
    ll x, y, g = egcd(a, b, x, y);
    if (g < 0) g = -g, x = -x, y = -y;
    if (c % g) return false;
    s.dx = b / g; s.dy = a / g;
    __int128 X = (__int128)x * (c / g);
    if (s.dx) { ll m = llabs(s.dx); X %= m; if (X < 0) X += m; }
    s.x0 = (ll)X;
    s.y0 = b ? (ll)(((__int128)c - (__int128)a * s.x0) / b) : 0;
    return true;
}

// número de soluções com lx <= x <= rx e ly <= y <= ry
ll count_dio(ll a, ll b, ll c, ll lx, ll rx, ll ly, ll ry) {
    Dio s;
    if (!dio(a, b, c, s)) return 0;
    ll lo = LLONG_MIN, hi = LLONG_MAX;
    auto cut = [&](ll p, ll q, ll d) { // p <= t*d <= q
        if (d == 0) { if (p > 0 || q < 0) lo = 1, hi = 0; return; }
        if (d > 0) lo = max(lo, cdiv(p, d)), hi = min(hi, fdiv(q, d));
        else lo = max(lo, cdiv(q, d)), hi = min(hi, fdiv(p, d));
    };
    cut(lx - s.x0, rx - s.x0, s.dx);
    cut(s.y0 - ry, s.y0 - ly, s.dy);
    return hi >= lo ? hi - lo + 1 : 0;
}
```

## Uso

```cpp
Dio s;
if (dio(6, 15, 9, s)) // x = s.x0 + t*s.dx, y = s.y0 - t*s.dy
    cout << s.x0 << " " << s.y0 << "\n"; // menor x >= 0 (para b != 0)
cout << count_dio(3, 5, 100, 0, LLONG_MAX / 4, 0, LLONG_MAX / 4) << "\n";
```

## Complexidade e cuidados

- `a = b = 0` não é tratado: há solução (qualquer par) só se `c = 0`.
- Com `b != 0`, `s.x0` é a menor solução com `x >= 0`; com `b == 0`, `x` é fixo (`x0 = c/a`) e `y` é livre.
- O produto `x * (c/g)` usa `__int128`; os resultados cabem em `long long` quando `|a|,|b|,|c|` até ~1e9.
- Para `y >= 0` mínimo, use `count_dio`/`cut` ou troque os papéis de `a` e `b`.
- Em `count_dio` use limites finitos (como `LLONG_MAX/4`) para "sem limite", evitando overflow em `lx - x0`.
