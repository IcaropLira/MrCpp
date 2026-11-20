---
title: Fórmulas de bolso (geometria)
summary: Áreas, perímetros, volumes e superfícies; triângulos (Heron, leis dos senos e cossenos); retas, rotação, ângulos e interseções.
status: done
complexity: —
tags: fórmulas, área, volume, triângulo, reta, rotação, teoria
---

## Figuras planas

| Figura | Área | Perímetro |
|---|---|---|
| retângulo | a · b | 2(a + b) |
| quadrado | a² | 4a |
| triângulo | b · h / 2 | a + b + c |
| trapézio | (B + b) · h / 2 | soma dos lados |
| paralelogramo | b · h = |u × v| | 2(a + b) |
| losango | D · d / 2 | 4a |
| círculo | π · r² | 2 · π · r |
| setor (θ em rad) | θ · r² / 2 | arco θ · r (+ 2r) |
| elipse | π · a · b | ≈ π(3(a+b) − √((3a+b)(a+3b))) |
| polígono regular (n lados, lado s) | n·s² / (4 tan(π/n)) | n·s |

**Polígono de n lados**: soma dos ângulos internos = **(n − 2) · 180°**; externos somam 360°; diagonais = n(n − 3)/2.

## Sólidos

| Sólido | Volume | Superfície |
|---|---|---|
| cubo | a³ | 6a² |
| paralelepípedo | a·b·c | 2(ab + bc + ca) |
| cilindro | π r² h | 2π r² + 2π r h |
| cone (g = geratriz = √(r² + h²)) | π r² h / 3 | π r² + π r g |
| esfera | 4π r³ / 3 | 4π r² |
| pirâmide | (área da base) · h / 3 | base + faces |
| calota esférica (altura h) | π h² (3r − h) / 3 | 2π r h |

## Triângulos

- **Heron**: `s = (a+b+c)/2`, `A = √(s(s-a)(s-b)(s-c))`.
- Com coordenadas: `A = |orient(A, B, C)| / 2` (prefira!).
- **Lei dos cossenos**: `c² = a² + b² - 2ab·cos C`.
- **Lei dos senos**: `a / sen A = b / sen B = c / sen C = 2R` (R = raio circunscrito).
- `R = abc / (4A)`; raio inscrito `r = A / s`.
- Desigualdade triangular: `a < b + c` (todas as permutações); degenerado se `=`.
- Pitágoras com d²: ângulo reto ⇔ `d²(lado1) + d²(lado2) = d²(hipotenusa)`.

## Retas e segmentos

- Reta por A, B: `(B - A) × (P - A) = 0`; forma `ax + by = c` com `a = By - Ay`, `b = Ax - Bx`, `c = a·Ax + b·Ay`.
- Distância de P à reta AB: `|orient(A, B, P)| / |AB|`.
- Distância de P ao **segmento** AB: se `dot(P-A, B-A) < 0` → `|P - A|`; se `dot(P-B, A-B) < 0` → `|P - B|`; senão a da reta.
- Interseção de retas `P + t·u` e `Q + s·v`: `t = ((Q - P) × v) / (u × v)` (paralelas se `u × v = 0`).
- **Segmentos AB e CD se cruzam** (CSES 2190): `orient(A,B,C)` e `orient(A,B,D)` com sinais opostos **e** `orient(C,D,A)` e `orient(C,D,B)` com sinais opostos; casos colineares: algum orient = 0 e o ponto está no outro segmento (`on_segment`).
- Pontos inteiros num segmento entre (x1,y1) e (x2,y2): `gcd(|dx|, |dy|) + 1`.

## Ângulos e rotação

- Ângulo de um vetor: `atan2(y, x)` em (−π, π]. Ângulo entre u e v: `atan2(u × v, u · v)`.
- Rotação por θ (anti-horário): `(x cos θ - y sen θ, x sen θ + y cos θ)`. Por 90°: `(-y, x)`.
- Graus ↔ radianos: `rad = graus · π / 180`. `π = acos(-1)`.
- **Ordenação polar sem atan2**: separe por meio-plano (`y > 0 || (y == 0 && x > 0)`) e, no mesmo meio-plano, compare por `cross`.
