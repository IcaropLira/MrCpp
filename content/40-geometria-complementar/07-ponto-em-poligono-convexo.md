---
title: Ponto em polígono convexo O(log n)
summary: Classifica um ponto como fora, dentro ou na borda de um polígono convexo com busca binária sobre o leque de triângulos a partir do primeiro vértice.
status: done
complexity: O(log n) por consulta
tags: geometria, polígono convexo, busca binária
---

## Ideia

Seja `p[0]` o pivô. Os raios `p[0]→p[i]` dividem o polígono em um leque de triângulos, ordenados por ângulo. Se `q` está fora do ângulo `[p[1], p[n-1]]` visto de `p[0]`, está fora. Senão, uma busca binária acha o maior `i` com `cross(p[0], p[i], q) >= 0`, e `q` está dentro do polígono se e somente se está dentro do triângulo `(p[0], p[i], p[i+1])`, o que se resume ao lado de `q` em relação a `p[i]p[i+1]`.

## Código

```cpp
using P = pair<ll, ll>;
ll cross(P o, P a, P b) {
    return (a.first - o.first) * (b.second - o.second) - (a.second - o.second) * (b.first - o.first);
}

// p: convexo estrito, anti-horário, n >= 3. Retorna 0 fora, 1 dentro, 2 na borda.
int in_convex(const vector<P>& p, P q) {
    int n = p.size();
    ll c1 = cross(p[0], p[1], q), c2 = cross(p[0], p[n - 1], q);
    if (c1 < 0 || c2 > 0) return 0;
    int lo = 1, hi = n - 2; // maior i em [1, n-2] com cross(p0, p[i], q) >= 0
    while (lo < hi) {
        int mid = (lo + hi + 1) / 2;
        if (cross(p[0], p[mid], q) >= 0) lo = mid;
        else hi = mid - 1;
    }
    ll c = cross(p[lo], p[lo + 1], q);
    if (c < 0) return 0;
    if (c == 0) return 2;
    if ((lo == 1 && c1 == 0) || (lo == n - 2 && c2 == 0)) return 2;
    return 1;
}
```

## Uso

Pré-processe uma única vez o fecho convexo (por exemplo, o de `27-geometria-computacional/05-fecho`) e responda cada consulta com `in_convex(hull, q)`. Para considerar a borda como dentro, teste `in_convex(...) != 0`.

## Complexidade e cuidados

- `O(log n)` por consulta, `O(1)` de memória extra.
- Tudo exato em inteiros; com `|coordenadas| <= 1e9`, o `cross` cabe em `long long`.
- Exige polígono convexo, anti-horário, sem vértices colineares nem repetidos; pontos colineares fazem o pivô `p[0]` ter ângulo degenerado e quebram a busca.
- Os casos de borda (`q` sobre `p[0]p[1]`, sobre `p[0]p[n-1]`, igual ao pivô ou a um vértice) retornam 2, e `q` na reta de uma aresta mas fora do segmento retorna 0.
- Se o polígono vier horário, inverta-o antes com `reverse`.
