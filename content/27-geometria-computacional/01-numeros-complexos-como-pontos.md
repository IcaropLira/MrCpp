---
title: Números complexos como pontos
summary: complex<double> faz rotação, produto escalar e vetorial com poucas linhas.
status: done
complexity: O(1) por operação
tags: geometria, complexos, vetores
---

## Ideia

Um ponto `(x, y)` é o complexo `x + iy`. Somar e subtrair são operações de vetor; multiplicar por `polar(1, θ)` gira o vetor em `θ` radianos. O produto escalar e o vetorial saem de `conj(a) · b`: a parte real é `a · b` e a parte imaginária é `a × b`. Isso reduz muita geometria a uma linha de código.

## Código

```cpp
using P = complex<double>;
const double EPS = 1e-9;

double dot(P a, P b) { return real(conj(a) * b); }
double cross(P a, P b) { return imag(conj(a) * b); }

P gira(P p, double ang) { return p * polar(1.0, ang); }               // em torno da origem
P gira_em_torno(P p, P c, double ang) { return c + gira(p - c, ang); }  // em torno de c

P projecao(P p, P a, P b) {  // projeção de p sobre a reta ab
    P d = b - a;
    return a + d * (dot(p - a, d) / norm(d));
}
P reflexao(P p, P a, P b) { return 2.0 * projecao(p, a, b) - p; }  // simétrico de p em relação a ab

// interseção das retas ab e cd; false se paralelas
bool inter_retas(P a, P b, P c, P d, P& r) {
    double den = cross(b - a, d - c);
    if (fabs(den) < EPS) return false;
    r = a + (b - a) * (cross(c - a, d - c) / den);
    return true;
}

double angulo(P a, P b) { return atan2(cross(a, b), dot(a, b)); }  // ângulo de a para b, em [-pi, pi]
```

## Complexidade e cuidados

- `x` e `y` são `real()` e `imag()`; as funções membro `.real()` e `.imag()` não são atribuíveis em C++17 para `complex<double>`, use `p = P(novo_x, novo_y)`.
- `abs(p)` é o módulo e `norm(p)` é o módulo ao quadrado (sem raiz).
- Para coordenadas inteiras prefira `complex<long long>` com `cross`/`dot` sem `polar` (que só existe em ponto flutuante) ou uma struct própria.
- Sempre compare com `EPS`, nunca com `==`.
- `angulo` devolve valor em `[-pi, pi]`; para vetores opostos o resultado é `+pi` ou `-pi` conforme o sinal do zero em `cross`, então não use igualdade exata nesse caso.
