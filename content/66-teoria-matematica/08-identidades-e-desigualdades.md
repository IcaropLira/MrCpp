---
title: Identidades e desigualdades
summary: Álgebra (produtos notáveis, potências, logs), piso e teto, mod, médias (AM-GM, Cauchy-Schwarz), desigualdade triangular, Jensen, rearranjo e truques de manipulação.
status: done
complexity: —
tags: identidades, desigualdades, am-gm, cauchy, piso, teto, logaritmo, teoria
---

## Produtos notáveis

- `(a + b)² = a² + 2ab + b²`; `(a - b)² = a² - 2ab + b²`; `a² - b² = (a - b)(a + b)`.
- `(a + b)³ = a³ + 3a²b + 3ab² + b³`; `a³ ± b³ = (a ± b)(a² ∓ ab + b²)`.
- `aⁿ - bⁿ = (a - b)(aⁿ⁻¹ + aⁿ⁻²b + … + bⁿ⁻¹)` ⇒ `(a - b) | (aⁿ - bⁿ)`.
- `(a + b + c)² = a² + b² + c² + 2(ab + bc + ca)`.
- `a³ + b³ + c³ - 3abc = (a + b + c)(a² + b² + c² - ab - bc - ca)`.
- Identidade de Brahmagupta: `(a² + b²)(c² + d²) = (ac - bd)² + (ad + bc)²`.

## Potências e logaritmos

- `aᵐ·aⁿ = aᵐ⁺ⁿ`; `(aᵐ)ⁿ = aᵐⁿ`; `a⁻ⁿ = 1/aⁿ`.
- `log(xy) = log x + log y`; `log(xᵏ) = k log x`; `log_b x = ln x / ln b`.
- Nº de dígitos de n na base 10: `⌊log₁₀ n⌋ + 1`; de n!: `⌊Σ log₁₀ i⌋ + 1` (ou Stirling).
- **Stirling**: `n! ≈ √(2πn) (n/e)ⁿ`; `ln n! ≈ n ln n - n`.
- Comparar `aᵇ` com `cᵈ` sem estourar: compare `b ln a` com `d ln c` (cuidado com empate: confirme com inteiros).

## Piso, teto e divisão inteira

- `⌈a/b⌉ = ⌊(a + b - 1)/b⌋` (a ≥ 0, b > 0). Em C++ a divisão **trunca para zero**: para negativos use `floor_div(a, b) = a / b - ((a % b != 0) && ((a < 0) != (b < 0)))`.
- `⌊⌊x/a⌋/b⌋ = ⌊x/(ab)⌋`; `⌊x⌋ + ⌊y⌋ ≤ ⌊x + y⌋ ≤ ⌊x⌋ + ⌊y⌋ + 1`.
- `⌊n/k⌋` assume ≤ `2√n` valores distintos (blocos `[i, n/(n/i)]`).
- `x mod m = x - m⌊x/m⌋`; `n = q·m + r`, `0 ≤ r < m`.
- **Hermite**: `⌊x⌋ + ⌊x + 1/n⌋ + … + ⌊x + (n-1)/n⌋ = ⌊nx⌋`.
- `Σ_{i=0}^{m-1} ⌊(a·i + b)/m⌋` = **floor sum** (O(log), ver Matemática).

## Médias e desigualdades

- **AM ≥ GM ≥ HM**: `(a₁ + … + aₙ)/n ≥ (a₁⋯aₙ)^(1/n) ≥ n/(1/a₁ + … + 1/aₙ)` (aᵢ > 0), igualdade ⇔ todos iguais. Ex.: produto máximo com soma fixa = partes iguais (inteiros: partes de 3 — "quebrar n em somas para maximizar o produto": use 3s e no máximo dois 2s).
- **Média quadrática ≥ aritmética**: `√((Σaᵢ²)/n) ≥ (Σaᵢ)/n`.
- **Cauchy–Schwarz**: `(Σ aᵢbᵢ)² ≤ (Σ aᵢ²)(Σ bᵢ²)`; forma de Engel: `Σ xᵢ²/yᵢ ≥ (Σxᵢ)²/Σyᵢ`.
- **Triangular**: `|a + b| ≤ |a| + |b|`; `||a| - |b|| ≤ |a - b|`.
- **Rearranjo**: `Σ aᵢbᵢ` é máximo com as duas sequências na **mesma** ordem e mínimo em ordens **opostas** (fundamento de muitos gulosos: "ordene ambos").
- **Jensen**: f convexa ⇒ `f(média) ≤ média de f`.
- **Bernoulli**: `(1 + x)ⁿ ≥ 1 + nx` (x ≥ −1).
- `1 + x ≤ eˣ`; `(1 - 1/n)ⁿ ≈ 1/e`; `(1 + 1/n)ⁿ → e`.
- Minimizar `Σ |x - aᵢ|`: **mediana**. Minimizar `Σ (x - aᵢ)²`: **média**. Minimizar `max |x - aᵢ|`: ponto médio de min e max.

## Somatórios úteis (complemento)

- `Σ_{k=0}^{n} k·C(n, k) = n·2ⁿ⁻¹`; `Σ k²·C(n, k) = n(n+1)·2ⁿ⁻²`.
- `Σ_{k≥0} xᵏ/k! = eˣ`; `Σ_{k≥1} 1/k² = π²/6`; `Σ_{p primo ≤ n} 1/p ≈ ln ln n`.
- `Σ_{i=1}^{n} i·i! = (n + 1)! - 1`.
- Telescópio: `Σ 1/(k(k+1)) = 1 - 1/(n+1)`.

## Truques de manipulação

- Trocar a ordem do somatório (`Σ_i Σ_{j ≤ i} = Σ_j Σ_{i ≥ j}`) = técnica da contribuição.
- `max(a, b) = (a + b + |a - b|)/2`; `|x| = max(x, -x)` (base do truque Manhattan → Chebyshev).
- `a·b = ((a + b)² - (a - b)²)/4`.
- Paridade: soma é par ⇔ nº de ímpares é par.
