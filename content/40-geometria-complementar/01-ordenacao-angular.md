---
title: Ordenação angular sem atan2
summary: Ordena vetores por ângulo em ordem anti-horária usando apenas inteiros, com semiplanos e produto vetorial.
status: done
complexity: O(n log n)
tags: geometria, ordenação, ângulo, produto vetorial
---

## Ideia

`atan2` perde precisão e não distingue direções quase iguais. Em vez disso, divide-se o plano em dois semiplanos: o superior `[0, π)` (inclui o eixo `+x`) e o inferior `[π, 2π)`. Vetores de semiplanos diferentes comparam-se pelo índice do semiplano; no mesmo semiplano, `a` vem antes de `b` se `cross(a, b) > 0`. Vetores colineares na mesma direção empatam no ângulo e aqui desempatam pela distância à origem.

A ordem começa no eixo `+x` e segue no sentido anti-horário.

## Código

```cpp
struct P { ll x, y; };
ll cross(P a, P b) { return a.x * b.y - a.y * b.x; }
int half(P p) { return (p.y > 0 || (p.y == 0 && p.x > 0)) ? 0 : 1; }

// Ordena v por ângulo em torno de o (nenhum ponto pode coincidir com o).
void sort_angular(vector<P>& v, P o = {0, 0}) {
    sort(v.begin(), v.end(), [&](P a, P b) {
        a = {a.x - o.x, a.y - o.y};
        b = {b.x - o.x, b.y - o.y};
        int ha = half(a), hb = half(b);
        if (ha != hb) return ha < hb;
        ll c = cross(a, b);
        if (c != 0) return c > 0;
        return a.x * a.x + a.y * a.y < b.x * b.x + b.y * b.y;
    });
}
```

## Uso

`sort_angular(pts)` ordena em torno da origem; `sort_angular(pts, pivo)` ordena em torno de `pivo`. Para ignorar o desempate por distância, retorne `false` quando `c == 0`.

## Complexidade e cuidados

- `O(n log n)`, com comparador `O(1)` exato em inteiros.
- Com `|coordenadas| <= 1e9` (após subtrair o pivô, diferenças até `2e9`) o produto vetorial pode chegar a `8e18`, ainda dentro de `long long`; acima disso use `__int128`.
- O vetor nulo não tem ângulo: `half({0,0}) = 1` e `cross` com ele é 0, o que quebra a ordem estrita. Remova pontos iguais ao pivô antes.
- Pontos duplicados são equivalentes entre si, sem problema para o `sort`.
- Em `double` o comparador deixa de ser transitivo por causa de erros de arredondamento; prefira inteiros.
