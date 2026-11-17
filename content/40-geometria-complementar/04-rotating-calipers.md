---
title: Rotating calipers (diâmetro)
summary: Maior distância entre dois pontos de um conjunto em O(n log n), percorrendo o fecho convexo com dois ponteiros.
status: done
complexity: O(n log n)
tags: geometria, fecho convexo, rotating calipers, diâmetro
---

## Ideia

O par mais distante é sempre formado por vértices do fecho convexo. Para cada aresta `h[i]h[i+1]`, o vértice mais distante da reta dessa aresta é o `h[j]` que maximiza o produto vetorial. Conforme `i` avança no sentido anti-horário, `j` também só avança, então o total de passos é linear. O candidato à resposta para a aresta `i` é `h[j]` com cada extremo da aresta.

## Código

```cpp
using P = pair<ll, ll>;
ll cross(P o, P a, P b) {
    return (a.first - o.first) * (b.second - o.second) - (a.second - o.second) * (b.first - o.first);
}
ll d2(P a, P b) {
    return (a.first - b.first) * (a.first - b.first) + (a.second - b.second) * (a.second - b.second);
}

vector<P> hull(vector<P> p) { // anti-horário, sem colineares
    sort(p.begin(), p.end());
    p.erase(unique(p.begin(), p.end()), p.end());
    int n = p.size(), k = 0;
    if (n < 3) return p;
    vector<P> h(2 * n);
    for (int i = 0; i < n; i++) {
        while (k >= 2 && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    for (int i = n - 2, t = k + 1; i >= 0; i--) {
        while (k >= t && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    h.resize(k - 1);
    return h;
}

ll diameter2(const vector<P>& pts) { // quadrado do diâmetro
    vector<P> h = hull(pts);
    int m = h.size();
    if (m <= 1) return 0;
    if (m == 2) return d2(h[0], h[1]);
    ll best = 0;
    int j = 1;
    for (int i = 0; i < m; i++) {
        int ni = (i + 1) % m;
        while (cross(h[i], h[ni], h[(j + 1) % m]) > cross(h[i], h[ni], h[j])) j = (j + 1) % m;
        best = max({best, d2(h[i], h[j]), d2(h[ni], h[j])});
    }
    return best;
}
```

## Uso

`diameter2(pts)` devolve o quadrado da distância; tire a raiz só no final. O mesmo laço, trocando a métrica, serve para a largura mínima do conjunto.

## Complexidade e cuidados

- `O(n log n)` pela ordenação do fecho; o laço dos ponteiros é `O(h)`.
- Tudo inteiro. Com `|coordenadas| <= 1e9`, `cross` chega a `8e18` e `d2` também; ambos cabem em `long long`.
- Pontos duplicados e colineares são tratados: o fecho remove ambos, e os casos de 1 e 2 vértices retornam antes do laço.
- O fecho precisa ser estritamente convexo (sem colineares); com colineares o teste `>` pode não avançar `j` corretamente.
