---
title: Círculos e retângulos
summary: Ponto no círculo, posição relativa de dois círculos e interseção de retângulos alinhados — tudo com quadrados e inteiros.
status: done
complexity: O(1)
tags: geometria, círculo, retângulo, interseção, teoria
---

## Ponto no círculo

Compare `d²(C, P)` com `r²`: menor → **dentro**; igual → **na borda**; maior → **fora**.
Ex. (C = (3,2), r = 2, r² = 4): P1 (3,3): 1 < 4 dentro · P2 (5,2): 4 = 4 borda · P3 (5,4): 8 > 4 fora.

## Dois círculos (d = distância entre centros)

| Situação | Condição |
|---|---|
| separados | `d > r1 + r2` |
| tangentes por fora | `d = r1 + r2` |
| se cruzam (2 pontos) | `|r1 - r2| < d < r1 + r2` |
| tangentes por dentro | `d = |r1 - r2|` |
| um dentro do outro | `d < |r1 - r2|` |
| concêntricos iguais | `d = 0` e `r1 = r2` |

Tudo ao quadrado: `d²` contra `(r1 + r2)²` e `(r1 - r2)²` — sem ponto flutuante.

## Retângulos alinhados aos eixos

Cada retângulo vira **dois intervalos** (um em x, um em y). Intervalos `[a, b]` e `[c, d]` se cruzam ⇔ `max(a, c) ≤ min(b, d)`.
Retângulos se cruzam ⇔ os intervalos se cruzam **nos dois eixos**.
Ex.: A = (0,0)–(4,3), B = (2,1)–(6,4): x: max(0,2)=2 ≤ 4=min(4,6) ✓; y: 1 ≤ 3 ✓.
Área da interseção: `max(0, min(b,d) - max(a,c))` em x vezes o mesmo em y. (Use `<` se tocar na borda não conta.)

## Fórmulas com círculos

- Área `π r²`, perímetro `2πr`, setor (θ em rad) `θ r²/2`, arco `θ r`.
- Corda a distância `h` do centro: comprimento `2√(r² - h²)`.
- Interseção de dois círculos: `a = (d² + r1² - r2²) / (2d)`, `h = √(r1² - a²)`; ponto médio `P = C1 + a·(C2 - C1)/d`; pontos `P ± h·perp((C2 - C1)/d)`.
- Círculo por 3 pontos (circuncírculo): centro na interseção das mediatrizes; `R = abc / (4·Área)`.
- Círculo inscrito no triângulo: `r = Área / s` (s = semiperímetro).
