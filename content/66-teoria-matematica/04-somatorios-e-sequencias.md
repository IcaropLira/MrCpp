---
title: Somatórios e sequências
summary: Somas fechadas (PA, PG, quadrados, cubos), harmônica, contribuição, recorrências lineares e truques de soma.
status: done
complexity: —
tags: somatório, pa, pg, recorrência, harmônica, teoria
---

## Somas fechadas

| Soma | Fórmula |
|---|---|
| 1 + 2 + … + n | n(n+1)/2 |
| 1² + … + n² | n(n+1)(2n+1)/6 |
| 1³ + … + n³ | (n(n+1)/2)² |
| 1 + 3 + 5 + … (n termos) | n² |
| PA: a, a+r, … (n termos) | n·(a₁ + aₙ)/2 |
| PG: a + aq + … + aqⁿ⁻¹ | a(qⁿ − 1)/(q − 1) |
| PG infinita (|q| < 1) | a/(1 − q) |
| Σ i·qⁱ | derive a PG |
| Σ_{i=1}^{n} 1/i | ≈ ln n + 0,5772 |
| Σ_{i<j} (aᵢ·aⱼ) | ((Σa)² − Σa²)/2 |
| Σ_{i<j} |aᵢ − aⱼ| | ordene; Σ aᵢ·(2i − n + 1) (0-indexado) |

Pares `(i, j)` com `i < j`: `n(n-1)/2 = C(n, 2)`. Subarrays: `n(n+1)/2`. Subarrays contendo a posição i (0-ind.): `(i+1)(n-i)`.

## Técnica da contribuição

Inverter a ordem das somas: `Σ_{subarrays} Σ_{i ∈ sub} aᵢ = Σ_i aᵢ·(i+1)(n-i)`. Soma das distâncias numa árvore: cada aresta contribui `sz·(n - sz)`. Soma de mínimos de todos os subarrays: para cada i, em quantos subarrays ele é o mínimo (vizinho menor à esquerda/direita com pilha).

## Recorrências lineares

`aₙ = c₁aₙ₋₁ + … + c_k aₙ₋ₖ` → exponenciação de matriz k×k em O(k³ log n) (ou Kitamasa/Berlekamp–Massey). Fibonacci:
```
[F(n+1) F(n)  ]   [1 1]ⁿ
[F(n)   F(n-1)] = [1 0]
```

## Funções de piso

- `Σ_{i=1}^{n} ⌊n/i⌋ = Σ d(k)` ≈ n ln n; calcule em O(√n) agrupando blocos onde `⌊n/i⌋` é constante: o bloco que começa em `i` termina em `n / (n / i)`.
- `⌊⌊n/a⌋/b⌋ = ⌊n/(ab)⌋`.

## Sequências de cabeça

- Potências de 2 até 2⁶²; `2¹⁰ ≈ 10³`, `2²⁰ ≈ 10⁶`, `2³⁰ ≈ 10⁹`.
- Fatoriais: 10! = 3 628 800; 12! ≈ 4,8·10⁸; 13! ≈ 6,2·10⁹; 20! ≈ 2,4·10¹⁸.
- Catalan: 1, 1, 2, 5, 14, 42, 132, 429, 1430. Bell: 1, 1, 2, 5, 15, 52, 203. Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89.
