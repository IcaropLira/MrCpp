---
title: Trigonometria
summary: Valores notáveis, identidades (soma, ângulo duplo, produto em soma), leis dos senos e cossenos, área com seno, atan2 e conversões.
status: done
complexity: —
tags: trigonometria, seno, cosseno, identidades, ângulos, teoria
---

## Valores notáveis

| θ | 0 | 30° = π/6 | 45° = π/4 | 60° = π/3 | 90° = π/2 | 180° = π |
|---|---|---|---|---|---|---|
| sen | 0 | 1/2 | √2/2 | √3/2 | 1 | 0 |
| cos | 1 | √3/2 | √2/2 | 1/2 | 0 | −1 |
| tg | 0 | √3/3 | 1 | √3 | — | 0 |

Outros: `sen 15° = (√6 - √2)/4`, `cos 15° = (√6 + √2)/4`, `sen 18° = (√5 - 1)/4`, `cos 36° = (1 + √5)/4` (pentágono, φ).

## Identidades

- `sen² + cos² = 1`; `1 + tg² = sec²`.
- Soma: `sen(a ± b) = sen a cos b ± cos a sen b`; `cos(a ± b) = cos a cos b ∓ sen a sen b`; `tg(a ± b) = (tg a ± tg b)/(1 ∓ tg a tg b)`.
- Duplo: `sen 2a = 2 sen a cos a`; `cos 2a = cos² a - sen² a = 1 - 2sen² a = 2cos² a - 1`.
- Metade: `sen²(a/2) = (1 - cos a)/2`; `cos²(a/2) = (1 + cos a)/2`.
- Triplo: `sen 3a = 3 sen a - 4 sen³ a`; `cos 3a = 4cos³ a - 3 cos a`.
- Produto → soma: `2 sen a cos b = sen(a + b) + sen(a - b)`; `2 cos a cos b = cos(a - b) + cos(a + b)`; `2 sen a sen b = cos(a - b) - cos(a + b)`.
- Soma → produto: `sen a + sen b = 2 sen((a+b)/2) cos((a-b)/2)`; `cos a + cos b = 2 cos((a+b)/2) cos((a-b)/2)`.
- Simetrias: `sen(-a) = -sen a`, `cos(-a) = cos a`, `sen(π - a) = sen a`, `cos(π - a) = -cos a`, `sen(π/2 - a) = cos a`.
- **Euler**: `e^(iθ) = cos θ + i sen θ` → rotação com números complexos; De Moivre `(cos θ + i sen θ)ⁿ = cos nθ + i sen nθ`.

## Triângulo qualquer (lados a, b, c opostos a A, B, C)

- **Lei dos senos**: `a/sen A = b/sen B = c/sen C = 2R`.
- **Lei dos cossenos**: `a² = b² + c² - 2bc cos A` ⇒ `cos A = (b² + c² - a²)/(2bc)`.
- Área: `½ ab sen C` = `abc/(4R)` = `r·s` = Heron.
- Lei das tangentes: `(a - b)/(a + b) = tg((A-B)/2)/tg((A+B)/2)`.
- Tipo pelo maior lado c: `a² + b² > c²` acutângulo; `=` retângulo; `<` obtusângulo (com inteiros, sem raiz!).

## Em código

- `atan2(y, x)` devolve o ângulo em (−π, π]; normalize com `if (ang < 0) ang += 2π`.
- Ângulo entre vetores: `atan2(|cross|, dot)` (estável), não `acos(dot/(|u||v|))` (perde precisão perto de 0 e π; limite o argumento a [−1, 1] se usar).
- `M_PI` ou `acos(-1.0L)`; graus → rad: `x·π/180`.
- Polígono regular de n lados inscrito em círculo de raio R: lado `2R sen(π/n)`, área `½ n R² sen(2π/n)`, apótema `R cos(π/n)`.
