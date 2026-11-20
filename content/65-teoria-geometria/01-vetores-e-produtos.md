---
title: Pontos, vetores, distâncias e produtos
summary: Ponto × vetor, Manhattan × Euclidiana, por que fugir do float, produto escalar, produto vetorial, orient e a tabela de perguntas.
status: done
complexity: O(1)
tags: geometria, vetor, dot, cross, orient, distância, float, teoria
---

## Ponto e vetor

- **Ponto**: uma posição `(x, y)`. **Vetor**: um deslocamento (quanto andar em x e em y).
- `AB = B - A`. Ex.: `A = (1, 1)`, `B = (5, 4)` → `AB = (4, 3)`.
- Por que vetor? Ângulo, lado e área viram **contas de somar e multiplicar coordenadas**.

## Distâncias

- **Manhattan**: `|xA - xB| + |yA - yB|` (andar pela grade/quarteirões). Ex.: 4 + 3 = 7.
- **Euclidiana**: `√((xA - xB)² + (yA - yB)²)` (linha reta). Ex.: √(16 + 9) = 5.
- **Chebyshev**: `max(|dx|, |dy|)` (rei no xadrez).
- Para **comparar** distâncias use `d² = dx² + dy²` (inteiro, exato).

## Por que fugir do float

`0.1 + 0.2 == 0.3` é falso (`0.30000000000000004`); `sqrt(2)**2 = 2.0000000000000004`; `dist(A,B) == dist(A,C)` pode errar. Com inteiros: `dist2(A,B) == dist2(A,C)` é exato; `3·3 + 4·4 == 5·5`.

- `|x|, |y| ≤ 10⁹` → produtos até ~2·10¹⁸: **`long long`** em C++.
- Quando a conta exige float (raiz, ângulo): compare com tolerância `|a - b| < eps`, `eps ≈ 1e-9`.
- **Regra: inteiros enquanto der; float só na resposta final.**

## Produto escalar (dot)

`u · v = ux·vx + uy·vy = |u|·|v|·cos θ`

| sinal | ângulo | exemplo |
|---|---|---|
| > 0 | agudo (mesmo lado) | (3,1)·(1,2) = 5 |
| = 0 | reto (**perpendiculares**) | (3,1)·(−1,3) = 0 |
| < 0 | obtuso | (3,1)·(−2,1) = −5 |

Projeção de `v` em `u`: `(u·v)/|u|`.

## Produto vetorial (cross)

`u × v = ux·vy - uy·vx = |u|·|v|·sen θ`

| sinal | significado | exemplo |
|---|---|---|
| > 0 | `v` está à **esquerda** de `u` (giro anti-horário) | (2,1)×(1,3) = 5 |
| = 0 | mesma direção (**paralelos/colineares**) | (2,1)×(4,2) = 0 |
| < 0 | `v` à **direita** (horário) | (2,1)×(3,−1) = −5 |

`|u × v|` = **área do paralelogramo** de lados `u` e `v`.

## Orientação de três pontos

`orient(A, B, C) = (B - A) × (C - A)`: `> 0` vira à esquerda, `< 0` à direita, `= 0` colineares.
Ex.: `(3,1)×(2,3) = 7` esquerda; `(3,1)×(4,-1) = -7` direita; `(2,1)×(4,2) = 0` colineares.

Inclinação `(y2 - y1)/(x2 - x1)` **divide** e quebra na reta vertical; `orient` só multiplica e é **exato**.

## Perguntas úteis

| Pergunta | Teste com inteiros |
|---|---|
| C está à esquerda de A → B? | `orient(A, B, C) > 0` |
| A, B, C colineares? | `orient(A, B, C) = 0` |
| u e v paralelos? | `u × v = 0` |
| u e v perpendiculares? | `u · v = 0` |
| Área do triângulo ABC | `|orient(A, B, C)| / 2` |
| Distância de P à reta AB | `|orient(A, B, P)| / |AB|` |
| P no segmento AB? | `orient(A,B,P) = 0` e `(A-P)·(B-P) ≤ 0` |
| Ângulo reto em P (triângulo) | `(Q-P)·(R-P) = 0` (ou Pitágoras com d²) |

**Quase toda geometria competitiva = vetor + escalar + vetorial (e às vezes ordenação).**

## Manhattan ↔ Chebyshev

`|dx| + |dy| = max(|Δ(x + y)|, |Δ(x - y)|)` (pois `|a| = max(a, -a)` e os 4 sinais viram 2 módulos). Com `s = x + y`, `d = x - y`, a maior distância de Manhattan entre pontos de um conjunto é `max(maxs - mins, maxd - mind)` → O(1) por ponto (CSES 3410). Ex.: P = (5, 2), Q = (0, 5): 5 + 3 = 8; `|7 - 5| = 2`, `|3 - (-5)| = 8` → 8.
