---
title: Área da união de retângulos
summary: Área coberta por n retângulos alinhados aos eixos com sweep line em x e segment tree de cobertura em y.
status: done
complexity: O(n log n)
tags: geometria, sweep line, segment tree, retângulos
---

## Ideia

Varre-se o plano da esquerda para a direita. Cada retângulo gera um evento de entrada em `x1` e um de saída em `x2`, ambos sobre o intervalo `[y1, y2)` das coordenadas `y` comprimidas. Uma segment tree guarda, para cada nó, quantos retângulos cobrem inteiramente o seu intervalo (`cnt`) e o comprimento coberto (`len`). Entre dois `x` consecutivos, a área acrescentada é `len[raiz] * (x_atual - x_anterior)`. Não há propagação preguiçosa: o contador fica no nó e é desfeito simetricamente na saída.

## Código

```cpp
struct Rect { ll x1, y1, x2, y2; }; // x1 < x2 e y1 < y2 (os degenerados são ignorados)

ll union_area(const vector<Rect>& r) {
    vector<ll> ys;
    vector<array<ll, 4>> ev; // {x, tipo (0 entra, 1 sai), y1, y2}
    for (auto& q : r) {
        if (q.x1 >= q.x2 || q.y1 >= q.y2) continue;
        ys.push_back(q.y1);
        ys.push_back(q.y2);
        ev.push_back({q.x1, 0, q.y1, q.y2});
        ev.push_back({q.x2, 1, q.y1, q.y2});
    }
    if (ev.empty()) return 0;
    sort(ys.begin(), ys.end());
    ys.erase(unique(ys.begin(), ys.end()), ys.end());
    sort(ev.begin(), ev.end()); // entradas antes das saídas na mesma coordenada
    int m = ys.size() - 1;      // intervalos elementares [ys[i], ys[i+1])
    vector<int> cnt(4 * m, 0);
    vector<ll> len(4 * m, 0);
    function<void(int, int, int, int, int, int)> upd = [&](int o, int l, int rr, int a, int b, int v) {
        if (b <= l || rr <= a) return;
        if (a <= l && rr <= b) cnt[o] += v;
        else {
            int mid = (l + rr) / 2;
            upd(2 * o, l, mid, a, b, v);
            upd(2 * o + 1, mid, rr, a, b, v);
        }
        if (cnt[o] > 0) len[o] = ys[rr] - ys[l];
        else len[o] = rr - l == 1 ? 0 : len[2 * o] + len[2 * o + 1];
    };
    ll area = 0, px = ev[0][0];
    for (auto& e : ev) {
        area += len[1] * (e[0] - px);
        px = e[0];
        int a = lower_bound(ys.begin(), ys.end(), e[2]) - ys.begin();
        int b = lower_bound(ys.begin(), ys.end(), e[3]) - ys.begin();
        upd(1, 0, m, a, b, e[1] == 0 ? 1 : -1);
    }
    return area;
}
```

## Uso

`union_area(retangulos)` devolve a área da união. Para o perímetro da união ou a contagem de pontos inteiros cobertos, o mesmo esqueleto serve, guardando mais campos por nó.

## Complexidade e cuidados

- `O(n log n)`: `2n` eventos, cada um com atualização `O(log n)` em uma árvore de `O(n)` nós.
- Tudo inteiro. A área chega a `(2e9)²` com coordenadas em `[-1e9, 1e9]`, que cabe em `long long`; a soma da união nunca excede a do bounding box.
- Ordenar com entrada antes de saída na mesma coordenada `x` evita contadores negativos; como a largura entre eventos de mesmo `x` é zero, a ordem entre eles não altera a área.
- Retângulos degenerados são descartados; sobreposições e retângulos idênticos são contados uma única vez, pois a cobertura é por `cnt > 0`.
- A convenção é intervalo semiaberto: retângulos que apenas se tocam não somam área.
