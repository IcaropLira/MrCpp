---
title: Geometria euclidiana — teoremas e pontos notáveis
summary: Pontos notáveis do triângulo (fórmulas em coordenadas), medianas, bissetrizes, Stewart, Ptolomeu, potência de ponto, semelhança, Tales, ângulos em círculos e polígonos inscritíveis.
status: done
complexity: —
tags: triângulo, baricentro, incentro, circuncentro, ortocentro, ptolomeu, stewart, potência de ponto, teoria
---

## Pontos notáveis do triângulo A, B, C (lados a = |BC|, b = |CA|, c = |AB|)

| Ponto | Definição | Coordenadas |
|---|---|---|
| **Baricentro** G | encontro das medianas | `(A + B + C)/3` (divide cada mediana 2:1) |
| **Incentro** I | encontro das bissetrizes; centro do círculo inscrito | `(a·A + b·B + c·C)/(a + b + c)`; raio `r = Área/s` |
| **Circuncentro** O | encontro das mediatrizes; centro do circunscrito | interseção de duas mediatrizes; `R = abc/(4·Área)` |
| **Ortocentro** H | encontro das alturas | `H = A + B + C - 2O` |
| Exincentro (oposto a A) | | `(-a·A + b·B + c·C)/(-a + b + c)`; raio `Área/(s - a)` |

- **Reta de Euler**: O, G, H colineares e `OG : GH = 1 : 2`.
- Circuncentro: no **meio da hipotenusa** (triângulo retângulo); fora do triângulo ⇔ obtusângulo.
- Fórmula do circuncentro em coordenadas (com B e C relativos a A, `d = 2·cross(B, C)`): `Ox = (C.y·|B|² - B.y·|C|²)/d`, `Oy = (B.x·|C|² - C.x·|B|²)/d`; some A no fim.
- **Euler**: `OI² = R(R - 2r)` ⇒ `R ≥ 2r`.

## Cevianas

- Mediana: `mₐ² = (2b² + 2c² - a²)/4`.
- **Teorema da bissetriz**: a bissetriz de A divide BC em `BD/DC = c/b`; comprimento `√(bc·(1 - a²/(b + c)²))`.
- **Stewart**: ceviana AD com `BD = m`, `DC = n` (m + n = a), `AD = d`: `b²m + c²n = a(d² + mn)`.
- Altura: `hₐ = 2·Área/a`.
- **Ceva**: cevianas AD, BE, CF concorrentes ⇔ `(BD/DC)(CE/EA)(AF/FB) = 1`. **Menelau**: pontos colineares ⇔ produto = −1 (com sinais).

## Semelhança e Tales

- Retas paralelas cortadas por transversais determinam segmentos proporcionais (Tales).
- Semelhantes com razão k: lados ×k, áreas ×k², volumes ×k³.
- Triângulo retângulo com altura h sobre a hipotenusa (projeções m, n): `h² = mn`, `b² = a·n`, `c² = a·m`, `bc = ah`.

## Círculos

- Ângulo inscrito = metade do central que enxerga o mesmo arco; ângulo inscrito em semicírculo = 90°.
- Quadrilátero **inscritível** ⇔ ângulos opostos somam 180°. **Ptolomeu**: `AC·BD = AB·CD + AD·BC` (igualdade ⇔ inscritível); em geral `≤` vale como desigualdade.
- **Potência de ponto** P em relação ao círculo (centro O, raio r): `pot = |PO|² - r²`. Para qualquer reta por P cortando em X, Y: `PX·PY = |pot|`; tangente: `PT² = pot`.
- **Eixo radical** de dois círculos: pontos com mesma potência (uma reta perpendicular à linha dos centros).
- Comprimento da tangente externa comum a dois círculos: `√(d² - (r₁ - r₂)²)`; interna: `√(d² - (r₁ + r₂)²)`.
- **Brahmagupta** (quadrilátero inscritível, lados a, b, c, d, s = semiperímetro): `Área = √((s-a)(s-b)(s-c)(s-d))`. Bretschneider para qualquer quadrilátero: `√((s-a)(s-b)(s-c)(s-d) - abcd·cos²((α+γ)/2))`.

## Polígonos e ângulos

- Soma dos ângulos internos: `(n - 2)·180°`; cada ângulo do regular: `(n - 2)·180°/n`; externo: `360°/n`.
- Desigualdade triangular generalizada: um polígono com lados `l₁..lₙ` existe ⇔ o maior lado < soma dos outros.
- Triângulo com lados inteiros e perímetro p: conte (a ≤ b ≤ c, a + b > c).
- **Pick**: `A = I + B/2 - 1` (vértices inteiros).
- Grade: nº de quadrados num tabuleiro n×n: `Σ k²`; retângulos: `C(n+1, 2)²`.

## Isoperimetria e extremos

- Entre figuras com mesmo perímetro, o círculo tem maior área; entre triângulos, o equilátero; entre quadriláteros, o quadrado.
- Ponto que minimiza a soma das distâncias aos vértices (Fermat–Torricelli): enxerga os lados a 120° (se todos os ângulos < 120°; senão é o vértice obtuso). Em geral (n pontos): mediana geométrica — busca ternária aninhada ou Weiszfeld.
- Menor círculo envolvente: Welzl (aleatorizado, O(n) esperado).
