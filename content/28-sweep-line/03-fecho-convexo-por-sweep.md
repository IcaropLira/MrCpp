---
title: Fecho convexo por sweep (Andrew)
summary: Monotone chain: ordena os pontos e constrói as cadeias inferior e superior com uma pilha.
status: done
complexity: O(n log n)
tags: sweep line, geometria, fecho convexo, monotone chain
---

## Ideia

Ordene os pontos por `(x, y)` e varra duas vezes. Na primeira, mantenha uma pilha que só aceita curvas à esquerda: ao chegar um ponto, retire do topo enquanto os dois últimos mais o novo não fizerem curva à esquerda estrita. Isso constrói a cadeia inferior. A segunda varredura, em ordem reversa, constrói a superior. Juntas formam o fecho em sentido anti-horário, sem pontos colineares nas arestas.

## Código

```cpp
using P = pair<ll, ll>;

ll cross(P o, P a, P b) { return (a.first - o.first) * (b.second - o.second) - (a.second - o.second) * (b.first - o.first); }

// vértices do fecho em sentido anti-horário, sem colineares; começa pelo menor (x, y)
vector<P> fecho_convexo(vector<P> p) {
    sort(p.begin(), p.end());
    p.erase(unique(p.begin(), p.end()), p.end());
    int n = p.size();
    if (n < 3) return p;
    vector<P> h(2 * n);
    int k = 0;
    for (int i = 0; i < n; i++) {  // cadeia inferior
        while (k >= 2 && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    for (int i = n - 2, t = k + 1; i >= 0; i--) {  // cadeia superior
        while (k >= t && cross(h[k - 2], h[k - 1], p[i]) <= 0) k--;
        h[k++] = p[i];
    }
    h.resize(k - 1);  // o último ponto repete o primeiro
    return h;
}
```

## Complexidade e cuidados

- Troque `<= 0` por `< 0` para manter pontos colineares sobre as arestas do fecho.
- Todos os pontos colineares: o resultado é só os dois extremos (a implementação acima devolve 2 pontos).
- `cross` com coordenadas até `1e9` cabe em `long long` (até `~4e18`).
- Área do fecho: fórmula do cadarço (`sum cross(h[0], h[i], h[i+1])`).
