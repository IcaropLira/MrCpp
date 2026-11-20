---
title: Probabilidade, esperança e teoria dos jogos
summary: Linearidade da esperança, distribuições úteis, DP de probabilidade, mod de frações; Nim, Sprague-Grundy e jogos clássicos.
status: done
complexity: —
tags: probabilidade, esperança, nim, grundy, jogos, teoria
---

## Probabilidade

- `P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`; independentes: `P(A ∩ B) = P(A)P(B)`.
- Condicional: `P(A|B) = P(A ∩ B)/P(B)`; Bayes: `P(A|B) = P(B|A)P(A)/P(B)`.
- **Resposta "mod p" de probabilidade** `a/b`: imprima `a · b⁻¹ mod p`.

## Esperança

- **Linearidade**: `E[X + Y] = E[X] + E[Y]` **sempre** (mesmo dependentes). Quebre em indicadores: `E[contagem] = Σ P(evento i)`.
- Geométrica (sucesso com prob. p): esperança de tentativas = `1/p`.
- **Colecionador de cupons** (n tipos): `n·Hₙ ≈ n ln n`.
- Binomial(n, p): média `np`, variância `np(1-p)`.
- DP de esperança: `E[estado] = custo + Σ P(próximo)·E[próximo]`; com auto-laço `E = c + pE + …` isole `E`.
- Pontos fixos de permutação aleatória: esperança 1. Inversões esperadas: `n(n-1)/4`.

## Teoria dos jogos (jogos imparciais, quem não joga perde)

- **Posição P** (perdedora para quem joga): todos os movimentos vão para posições N. **Posição N**: existe movimento para P.
- **Nim**: pilhas `a₁, …, aₙ`; o primeiro ganha ⇔ `a₁ ⊕ a₂ ⊕ … ⊕ aₙ ≠ 0`. Jogada vencedora: deixar xor 0.
- **Sprague–Grundy**: `g(posição) = mex{ g(próximas) }`; posição perdedora ⇔ `g = 0`. **Soma de jogos**: `g = g₁ ⊕ g₂ ⊕ …`.
- Jogo de subtração (tirar 1..k): `g(n) = n mod (k + 1)`.
- Misère Nim (quem joga por último perde): igual ao Nim, exceto quando todas as pilhas têm tamanho ≤ 1 — aí o jogador da vez vence ⇔ a quantidade de pilhas de tamanho 1 é par.
- Staircase Nim: só as posições ímpares importam (xor delas).
- Wythoff (duas pilhas, tirar de uma ou igual das duas): perdedoras `(⌊kφ⌋, ⌊kφ²⌋)`.
- Jogos parciais / minimax: DP sobre estados com "melhor para quem joga"; jogos de soma zero `dp = max(ganho - dp[próximo])`.
