---
title: Probabilidade e esperança — avançado
summary: Distribuições (fórmulas de média e variância), variância e covariância, truques de esperança (indicadores, P(X ≥ k)), cadeias de Markov, passeios aleatórios, ruína do jogador, problemas clássicos.
status: done
complexity: —
tags: probabilidade, esperança, variância, distribuições, markov, passeio aleatório, teoria
---

## Distribuições

| Distribuição | P(X = k) | E[X] | Var[X] |
|---|---|---|---|
| Bernoulli(p) | p, 1 − p | p | p(1 − p) |
| Binomial(n, p) | C(n,k) pᵏ (1−p)ⁿ⁻ᵏ | np | np(1 − p) |
| Geométrica (tentativas até o 1º sucesso) | (1 − p)ᵏ⁻¹ p | 1/p | (1 − p)/p² |
| Hipergeométrica (n de N, K bons) | C(K,k)C(N−K,n−k)/C(N,n) | nK/N | — |
| Poisson(λ) | e^(−λ) λᵏ/k! | λ | λ |
| Uniforme discreta {a..b} | 1/(b − a + 1) | (a + b)/2 | ((b−a+1)² − 1)/12 |
| Uniforme contínua [a, b] | densidade 1/(b − a) | (a + b)/2 | (b − a)²/12 |
| Exponencial(λ) | densidade λe^(−λx) | 1/λ | 1/λ² |

## Esperança e variância

- Linearidade: `E[ΣXᵢ] = ΣE[Xᵢ]` **sempre**.
- `Var[X] = E[X²] - E[X]²`; `Var[aX + b] = a² Var[X]`; independentes: `Var[X + Y] = Var X + Var Y`.
- `E[X²]` por indicadores: `E[(ΣIᵢ)²] = Σ E[Iᵢ] + 2Σ_{i<j} P(Iᵢ ∧ Iⱼ)`.
- X inteiro ≥ 0: **`E[X] = Σ_{k≥1} P(X ≥ k)`**. Ex.: esperança do máximo de n dados: `Σ_k (1 - ((k-1)/6)ⁿ)`.
- Independentes: `E[XY] = E[X]E[Y]`.
- Esperança do máximo/mínimo de uniformes contínuas em [0,1]: `n/(n+1)` e `1/(n+1)`; k-ésima menor: `k/(n+1)`.

## Clássicos

- **Cupons** (n tipos): `E = n·Hₙ`; para obter k tipos distintos: `n(1/n + 1/(n-1) + … + 1/(n-k+1))`.
- **Aniversário**: `P(sem colisão) = Π (1 - i/N)` ≈ `e^(-k²/2N)`.
- **Ruína do jogador** (começa com i, para em 0 ou N, prob. p de +1): `p = 1/2` ⇒ `P(chegar a N) = i/N`, tempo esperado `i(N - i)`. `p ≠ 1/2`, r = q/p: `(1 - rⁱ)/(1 - r^N)`.
- **Passeio aleatório** simples em ℤ: volta à origem com prob. 1 (1D e 2D), mas o tempo esperado é infinito; em 3D não volta com prob. ~0,66.
- Esperança de passos para sair de uma reta/árvore: sistema linear ou DP (em árvore, isolando o termo do pai).
- **Monty Hall**: trocar de porta ganha com prob. 2/3.
- Sorteio com reposição até repetir (aniversário em N): `E ≈ √(πN/2)`.
- Nº esperado de ciclos de uma permutação aleatória: `Hₙ`; pontos fixos: 1; recordes (máximos de prefixo): `Hₙ`.
- Nº esperado de inversões: `n(n-1)/4`; de subidas: `(n-1)/2`.

## Cadeias de Markov

- Estado vetor `v`, matriz de transição `P`: após k passos `v·Pᵏ` (exponenciação de matriz).
- **Tempo esperado até absorver**: `E[s] = 1 + Σ P(s→t)·E[t]`; com ciclos → sistema linear (Gauss) ou, se for DAG, DP.
- Estacionária: `π P = π`, `Σπ = 1` (Gauss). Em grafo não dirigido, passeio aleatório: `π(v) = grau(v)/(2E)`.
- Prob. de chegar em A antes de B: `f(A) = 1`, `f(B) = 0`, `f(s) = Σ P(s→t) f(t)`.

## Dicas de prova

- Resposta "mod p" de probabilidade: trabalhe com inversos modulares desde o início (frações).
- Probabilidade = (casos favoráveis)/(total) quando equiprovável — às vezes é mais fácil contar.
- Simetria: "qual a prob. de o elemento i ser o maior de um grupo aleatório de k" = 1/k.
- Esperança de algo "por par" ou "por elemento" → indicadores + linearidade.
- Monte Carlo para conferir a fórmula localmente.
