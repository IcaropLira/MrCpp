---
title: Ponto flutuante, retas e geometria 3D
summary: Como comparar com eps, problemas de precisão, fórmulas com double (projeção, reflexão, interseções), e o básico de 3D (produto vetorial, volume, plano).
status: done
complexity: O(1)
tags: eps, double, precisão, 3d, plano, produto misto, teoria
---

## Quando precisar de double

- Compare sempre com tolerância: `a < b - EPS` (menor), `fabs(a - b) < EPS` (igual). `EPS ≈ 1e-9` para coordenadas ~10³; ajuste à escala (erro relativo ~1e−15 · magnitude²).
- `sqrt` de algo que deveria ser ≥ 0: `sqrt(max(0.0, x))`. `acos`/`asin`: limite o argumento a `[-1, 1]`.
- `long double` dá ~3 dígitos a mais. Imprima com `fixed << setprecision(10)`.
- Evite divisões; prefira formular com cross/dot e só dividir no fim.
- `-0.000` na saída: some `+ 0.0` ou trate `fabs(x) < EPS ? 0 : x`.

## Fórmulas com double

- Projeção de P na reta AB: `A + (B - A) · dot(P - A, B - A) / |B - A|²`.
- Reflexão de P na reta: `2·proj - P`.
- Interseção de retas `P + t·u` e `Q + s·v`: `t = cross(Q - P, v) / cross(u, v)`.
- Reta × círculo (centro C, raio r): projete C na reta (ponto H, distância h); se `h ≤ r`, pontos `H ± dir · √(r² - h²)` (dir unitário).
- Tangentes de P externo ao círculo: ângulo `asin(r / |PC|)` em torno de `PC`; comprimento `√(|PC|² - r²)`.
- Área da interseção de dois círculos: soma de dois segmentos circulares `r²(θ - sen θ)/2`.
- Rotação: `(x cos θ - y sen θ, x sen θ + y cos θ)`; use `complex<double>` (`polar`, `arg`, `abs`) para encurtar.

## 3D

- `dot(u, v) = ux vx + uy vy + uz vz`; `cross(u, v) = (uy vz - uz vy, uz vx - ux vz, ux vy - uy vx)` (perpendicular a ambos; módulo = área do paralelogramo).
- **Produto misto** `dot(u, cross(v, w))` = volume (com sinal) do paralelepípedo; tetraedro = |misto| / 6. Quatro pontos coplanares ⇔ misto = 0. O sinal diz de que lado do plano (A, B, C) está D.
- Plano por A, B, C: normal `n = cross(B - A, C - A)`, equação `n · X = n · A`. Distância de P ao plano: `|n · (P - A)| / |n|`.
- Distância ponto–reta 3D: `|cross(B - A, P - A)| / |B - A|`.
- Distância entre retas reversas: `|dot(Q - P, cross(u, v))| / |cross(u, v)|`.
- Fecho convexo 3D: O(n²) incremental para n ≤ 1000; Euler para poliedros: `V - E + F = 2`.
- Esfera: distância de grande círculo entre (lat₁, lon₁) e (lat₂, lon₂): `R · acos(sin φ₁ sin φ₂ + cos φ₁ cos φ₂ cos Δλ)` (ou haversine, mais estável).
