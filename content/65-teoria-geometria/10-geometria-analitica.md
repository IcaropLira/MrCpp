---
title: Geometria analítica
summary: Equações da reta (formas e conversões), paralelismo/perpendicularidade, distâncias, circunferência, cônicas, transformações (translação, rotação, reflexão, escala) e coordenadas polares.
status: done
complexity: —
tags: geometria analítica, reta, circunferência, cônicas, transformações, polares, teoria
---

## Retas

| Forma | Equação | Observação |
|---|---|---|
| geral | `ax + by + c = 0` | normal `(a, b)`, direção `(-b, a)` |
| reduzida | `y = mx + q` | não representa retas verticais (evite em código) |
| por dois pontos | `(y - y₁)(x₂ - x₁) = (x - x₁)(y₂ - y₁)` | com inteiros: `orient = 0` |
| paramétrica | `P + t·d` | segmentos: `t ∈ [0, 1]` |
| segmentária | `x/p + y/q = 1` | cortes p e q nos eixos |

- Por P₁, P₂: `a = y₂ - y₁`, `b = x₁ - x₂`, `c = -(a x₁ + b y₁)`. Normalize (divida por gcd e fixe o sinal) para **contar retas distintas** com inteiros.
- **Paralelas** ⇔ `a₁b₂ = a₂b₁`; **perpendiculares** ⇔ `a₁a₂ + b₁b₂ = 0` (com inclinações: `m₁m₂ = -1`).
- Distância de `(x₀, y₀)` à reta: `|a x₀ + b y₀ + c| / √(a² + b²)`. Entre paralelas: `|c₁ - c₂|/√(a² + b²)`.
- Interseção (Cramer): `det = a₁b₂ - a₂b₁`; `x = (b₁c₂ - b₂c₁)/det`, `y = (c₁a₂ - c₂a₁)/det`.
- Ângulo entre retas: `tg θ = |(m₁ - m₂)/(1 + m₁m₂)|`.
- Mediatriz de AB: passa por `(A + B)/2` com normal `B - A`: `(B - A)·X = (|B|² - |A|²)/2`.
- Área do triângulo por coordenadas: `½ |x₁(y₂ - y₃) + x₂(y₃ - y₁) + x₃(y₁ - y₂)|`.
- Contar pontos colineares máximos: para cada ponto, normalize as direções `(dx, dy)/gcd` com sinal fixo e conte num map. O(n² log n).

## Circunferência

- `(x - a)² + (y - b)² = r²`; geral `x² + y² + Dx + Ey + F = 0` com centro `(-D/2, -E/2)`, `r² = (D² + E²)/4 - F` (> 0 para existir).
- Reta e circunferência: distância do centro à reta `d` vs `r` (secante `<`, tangente `=`, externa `>`).
- Tangente no ponto T do círculo: perpendicular ao raio `CT`.
- Círculo por três pontos: circuncentro (ver Geometria euclidiana); colineares ⇒ não existe.

## Cônicas (eixos alinhados)

| Cônica | Equação | Fatos |
|---|---|---|
| elipse | `x²/a² + y²/b² = 1` (a ≥ b) | focos `(±c, 0)`, `c² = a² - b²`; soma das distâncias aos focos = 2a; área πab |
| hipérbole | `x²/a² - y²/b² = 1` | `c² = a² + b²`; |diferença das distâncias| = 2a; assíntotas `y = ±(b/a)x` |
| parábola | `y = ax² + bx + c` | vértice `x = -b/(2a)`, `Δ = b² - 4ac`; foco/diretriz: `x² = 4py` |

- Função quadrática: mínimo/máximo no vértice; raízes `(-b ± √Δ)/(2a)` (estável: `q = -(b + sgn(b)√Δ)/2`, raízes `q/a` e `c/q`).
- Soma e produto das raízes (Vieta): `-b/a` e `c/a`; para grau n: `Σ raízes = -aₙ₋₁/aₙ`.

## Transformações

- Translação: `P + v`. Escala em torno da origem: `k·P`. Em torno de C: `C + k(P - C)`.
- **Rotação** por θ em torno da origem: `(x cos θ - y sen θ, x sen θ + y cos θ)`; 90°: `(-y, x)`; 180°: `(-x, -y)`. Em torno de C: `C + rot(P - C)`.
- Reflexão em x: `(x, -y)`; na reta `y = x`: `(y, x)`; na reta geral: `P - 2·((a x + b y + c)/(a² + b²))·(a, b)`.
- Matriz 3×3 homogênea compõe tudo (e permite exponenciação de matriz para "aplicar a mesma transformação k vezes").
- Rotação de 45° com escala √2: `(x - y, x + y)` — o truque Manhattan ↔ Chebyshev.

## Coordenadas polares

`x = r cos θ`, `y = r sen θ`; `r = √(x² + y²)`, `θ = atan2(y, x)`. Área em polares: `½ ∫ r² dθ`. Ordenar pontos por ângulo: use meio-plano + cross (exato) em vez de atan2.
