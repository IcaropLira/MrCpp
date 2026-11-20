---
title: Combinatória
summary: Binomiais e identidades, estrelas e barras, Catalan, Stirling, Bell, desarranjos, inclusão-exclusão, Burnside, Cayley e contagens em grafos.
status: done
complexity: pré O(n) para fatoriais
tags: combinatória, binomial, catalan, stirling, inclusão-exclusão, burnside, teoria
---

## Contagens básicas

| Situação | Fórmula |
|---|---|
| Permutações de n | n! |
| Arranjos (k de n, ordem importa) | n! / (n−k)! |
| Combinações (k de n) | C(n, k) = n! / (k!(n−k)!) |
| Permutações com repetição (multiconjunto) | n! / (n₁! n₂! … ) |
| Combinações com repetição (estrelas e barras) | C(n + k − 1, k − 1) soluções de x₁+…+x_k = n, xᵢ ≥ 0 |
| … com xᵢ ≥ 1 | C(n − 1, k − 1) |
| Subconjuntos | 2ⁿ |
| Funções de A (|A|=a) em B (|B|=b) | bᵃ |
| Funções sobrejetoras | Σ (−1)ⁱ C(b, i)(b − i)ᵃ = b!·S(a, b) |
| Caminhos na grade (só direita/baixo) de (0,0) a (n,m) | C(n + m, n) |

## Binomial

- Pascal: `C(n, k) = C(n-1, k-1) + C(n-1, k)` → tabela O(n²) sem módulo primo.
- Com módulo primo e n ≤ 10⁶: fatoriais e fatoriais inversos → O(1) por consulta.
- `Σ_k C(n, k) = 2ⁿ`; `Σ_k (-1)ᵏ C(n, k) = 0`; `Σ_k C(n, k)² = C(2n, n)`.
- **Vandermonde**: `C(m + n, r) = Σ_k C(m, k) C(n, r - k)`.
- **Hockey stick**: `Σ_{i=r}^{n} C(i, r) = C(n + 1, r + 1)`.
- `k·C(n, k) = n·C(n-1, k-1)`.
- Binômio: `(x + y)ⁿ = Σ C(n, k) xᵏ yⁿ⁻ᵏ`.

## Catalan

`Cₙ = C(2n, n) / (n + 1) = C(2n, n) - C(2n, n+1)`; `C₀ = 1`, `Cₙ₊₁ = Σ Cᵢ Cₙ₋ᵢ`.
1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796…
Conta: sequências de parênteses balanceadas com n pares; árvores binárias com n nós; triangulações de polígono com n+2 lados; caminhos de Dyck; permutações que evitam 231 (pilha).
**Ballot / reflexão**: caminhos que tocam a diagonal proibida = caminhos refletidos.

## Stirling e Bell

- **Stirling 2ª espécie** `S(n, k)`: partições de n elementos em k blocos não vazios. `S(n, k) = k·S(n-1, k) + S(n-1, k-1)`.
- **Stirling 1ª espécie** `s(n, k)`: permutações de n com k ciclos. `s(n, k) = (n-1)·s(n-1, k) + s(n-1, k-1)`.
- **Bell** `Bₙ = Σ_k S(n, k)`: 1, 1, 2, 5, 15, 52, 203, 877, 4140…

## Desarranjos

Permutações sem ponto fixo: `Dₙ = (n-1)(Dₙ₋₁ + Dₙ₋₂)`, `D₀ = 1`, `D₁ = 0` → 1, 0, 1, 2, 9, 44, 265… ≈ n!/e.

## Inclusão-exclusão

`|A₁ ∪ … ∪ Aₙ| = Σ|Aᵢ| - Σ|Aᵢ ∩ Aⱼ| + … + (-1)^(n+1)|A₁ ∩ … ∩ Aₙ|`. Em código: iterar sobre máscaras (n ≤ 20) com sinal pela paridade. Ex.: números ≤ N divisíveis por algum dos primos dados; contar coprimos com n usando os primos de n.

## Burnside / Pólya

Nº de configurações distintas sob um grupo de simetrias G = **média dos pontos fixos**: `(1/|G|) Σ_g fix(g)`.
Colares com n contas e k cores (só rotações): `(1/n) Σ_{d|n} φ(d)·k^(n/d)`. Com reflexões (pulseiras): soma também os pontos fixos das n reflexões e divide por 2n.

## Árvores e grafos

- **Cayley**: árvores rotuladas com n vértices: `n^(n-2)`. Florestas com k árvores enraizadas em k vértices dados: `k·n^(n-k-1)`.
- Sequência de Prüfer: bijeção árvore ↔ sequência de n−2 números; vértice de grau d aparece d−1 vezes.
- **Matrix-tree (Kirchhoff)**: nº de árvores geradoras = qualquer cofator da Laplaciana.
- Grafos rotulados com n vértices: `2^(n(n-1)/2)`.
- Árvores binárias com n nós: Catalan.

## Outras

- Fibonacci: `Fₙ = Fₙ₋₁ + Fₙ₋₂`; conta ladrilhamentos 2×n com dominós, sequências binárias sem "11"; `Fₙ₊ₘ = Fₘ Fₙ₊₁ + Fₘ₋₁ Fₙ`; Zeckendorf.
- Números de partição p(n) (sem ordem): 1, 1, 2, 3, 5, 7, 11, 15, 22, 30, 42… (p(100) ≈ 1,9·10⁸) — DP tipo moedas.
- Euleriano A(n, k): permutações com k subidas.
