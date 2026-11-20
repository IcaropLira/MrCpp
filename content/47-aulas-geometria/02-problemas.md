---
title: Exercícios de geometria (aula)
summary: Point Location, Right Triangle, Maximum Manhattan, Point in Polygon, Convex Hull e Polygons.
status: done
complexity: veja cada problema
tags: geometria, cses, codeforces, atcoder, aula
---

### Point Location Test (CSES 2189)

Juiz: <https://cses.fi/problemset/task/2189>  
Complexidade: `O(t)`

Sinal de `orient(p1, p2, p3)`.

```cpp
// CSES 2189 - Point Location Test: sinal de orient(p1, p2, p3)
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: biblioteca de geometria (bloco no início deste tópico)
int main() {
    int t; cin >> t;
    while (t--) {
        P a, b, c; cin >> a.x >> a.y >> b.x >> b.y >> c.x >> c.y;
        ll o = orient(a, b, c);
        cout << (o > 0 ? "LEFT" : o < 0 ? "RIGHT" : "TOUCH") << '\n';
    }
}
```

Exemplo testado — entrada:

```text
3
1 1 5 3 2 4
1 1 5 3 4 1
1 1 5 3 3 2
```

saída:

```text
LEFT
RIGHT
TOUCH
```


### Right Triangle (ABC362 B)

Juiz: <https://atcoder.jp/contests/abc362/tasks/abc362_b>  
Complexidade: `O(1)`

Algum vértice com produto escalar 0 entre seus dois lados.

```cpp
// ABC362 B - Right Triangle: ângulo reto em p <=> dot(q-p, r-p) == 0
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: biblioteca de geometria (bloco no início deste tópico)
int main() {
    P A, B, C; cin >> A.x >> A.y >> B.x >> B.y >> C.x >> C.y;
    bool reto = dot(B - A, C - A) == 0 || dot(A - B, C - B) == 0 || dot(A - C, B - C) == 0;
    cout << (reto ? "Yes" : "No") << '\n';
}
```

Exemplo testado — entrada:

```text
1 2
4 1
2 5
```

saída:

```text
Yes
```


### Maximum Manhattan Distances (CSES 3410)

Juiz: <https://cses.fi/problemset/task/3410>  
Complexidade: `O(n)`

`s = x + y`, `d = x − y`; resposta `max(maxs − mins, maxd − mind)`.

```cpp
// CSES 3410 - Maximum Manhattan Distances: |dx|+|dy| = max(|Δ(x+y)|, |Δ(x-y)|)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    ll mxs = LLONG_MIN, mns = LLONG_MAX, mxd = LLONG_MIN, mnd = LLONG_MAX;
    while (n--) {
        ll x, y; cin >> x >> y;
        ll s = x + y, d = x - y;                         // rotação 45° (Manhattan -> Chebyshev)
        mxs = max(mxs, s); mns = min(mns, s); mxd = max(mxd, d); mnd = min(mnd, d);
        cout << max(mxs - mns, mxd - mnd) << '\n';
    }
}
```

Exemplo testado — entrada:

```text
4
1 1
3 4
5 2
0 5
```

saída:

```text
0
5
5
8
```


### Point in Polygon (CSES 2192)

Juiz: <https://cses.fi/problemset/task/2192>  
Complexidade: `O(n · m)`

BOUNDARY primeiro; depois paridade do ray casting.

```cpp
// CSES 2192 - Point in Polygon: BORDA primeiro, depois ray casting
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: biblioteca de geometria (bloco no início deste tópico)
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<P> poly(n);
    for (auto &p : poly) cin >> p.x >> p.y;
    while (m--) {
        P q; cin >> q.x >> q.y;
        int r = in_polygon(poly, q);
        cout << (r == 0 ? "BOUNDARY" : r > 0 ? "INSIDE" : "OUTSIDE") << '\n';
    }
}
```

Exemplo testado — entrada:

```text
5 3
0 0
6 0
6 5
3 2
0 5
1 1
3 4
6 3
```

saída:

```text
INSIDE
OUTSIDE
BOUNDARY
```


### Convex Hull (CSES 2195)

Juiz: <https://cses.fi/problemset/task/2195>  
Complexidade: `O(n log n)`

Pontos no meio do lado contam: `< 0` no while.

```cpp
// CSES 2195 - Convex Hull: inclui pontos no meio dos lados ("< 0" no while)
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: biblioteca de geometria (bloco no início deste tópico)
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<P> pts(n);
    for (auto &p : pts) cin >> p.x >> p.y;
    auto h = hull(pts, true);
    cout << h.size() << '\n';
    for (auto p : h) cout << p.x << ' ' << p.y << '\n';
}
```

Exemplo testado — entrada:

```text
6
0 0
2 0
4 0
4 3
1 1
0 3
```

saída:

```text
5
0 0
2 0
4 0
4 3
0 3
```


### Polygons (CF 166B)

Juiz: <https://codeforces.com/problemset/problem/166/B>  
Complexidade: `O(n + m log n)`

A convexo: basta testar os vértices de B, estritamente, em O(log n).

```cpp
// CF 166B - Polygons: B estritamente dentro de A convexo <=> todo vértice de B estritamente dentro
// A vem horário -> inverter; consulta O(log n) por vértice
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: biblioteca de geometria (bloco no início deste tópico)
int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<P> A(n);
    for (auto &p : A) cin >> p.x >> p.y;
    reverse(A.begin(), A.end());                         // horário -> anti-horário
    int m; cin >> m;
    bool ok = true;
    while (m--) { P q; cin >> q.x >> q.y; if (!in_convex(A, q, true)) ok = false; }
    cout << (ok ? "YES" : "NO") << '\n';
}
```

Exemplo testado — entrada:

```text
4
0 0
0 4
5 4
5 0
3
1 1
2 3
4 1
```

saída:

```text
YES
```
