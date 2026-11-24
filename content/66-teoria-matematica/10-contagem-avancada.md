---
title: Contagem avançada
summary: Princípio da reflexão, Narayana, Motzkin, Schröder, Delannoy, hook length, LGV, partições, bolas e caixas (12 casos), Pólya, contagem com simetria e com restrições.
status: done
complexity: —
tags: combinatória, reflexão, bolas e caixas, hook length, lgv, partições, pólya, teoria
---

## Bolas em caixas (n bolas, k caixas)

| bolas | caixas | qualquer | ≤ 1 por caixa | ≥ 1 por caixa |
|---|---|---|---|---|
| distintas | distintas | kⁿ | k!/(k−n)! | k!·S(n, k) |
| iguais | distintas | C(n+k−1, k−1) | C(k, n) | C(n−1, k−1) |
| distintas | iguais | Σ_{i≤k} S(n, i) | [n ≤ k] | S(n, k) |
| iguais | iguais | p_k(n) (partições em ≤ k partes) | [n ≤ k] | p(n, k) partições em exatamente k partes |

`p(n, k) = p(n-1, k-1) + p(n-k, k)` (tirar a parte 1 de cada / tirar 1 de cada parte).

## Caminhos em grade e reflexão

- De (0,0) a (a, b) com passos → e ↑: `C(a + b, a)`.
- **Reflexão**: caminhos que **tocam** a reta `y = x + 1` (de (0,0) a (n, n)) = caminhos até o ponto refletido (n − 1, n + 1) ⇒ caminhos que **não** cruzam a diagonal: `C(2n, n) - C(2n, n+1) = Cₙ` (Catalan).
- Generalizado (não passar acima de `y = x + k`): `C(a+b, a) - C(a+b, a+k+1)`.
- **Ballot**: candidato A com a votos, B com b < a; prob. de A estar sempre à frente = `(a - b)/(a + b)`.
- Com obstáculos (poucos, k): ordene e use inclusão-exclusão/DP: `f[i] = caminhos(origem, oᵢ) - Σ_{j antes} f[j]·caminhos(oⱼ, oᵢ)`. O(k²).
- **LGV** (Lindström–Gessel–Viennot): nº de famílias de caminhos **disjuntos** de (a₁…aₖ) para (b₁…bₖ) = `det[ caminhos(aᵢ, bⱼ) ]`.

## Sequências famosas

| Nome | Fórmula | Conta | Início |
|---|---|---|---|
| Catalan | C(2n,n)/(n+1) | parênteses, árvores binárias, triangulações, Dyck | 1, 1, 2, 5, 14, 42, 132 |
| Narayana | C(n,k)C(n,k−1)/n | Dyck com k picos | linha n=4: 1, 6, 6, 1 |
| Motzkin | Mₙ = Mₙ₋₁ + Σ Mᵢ Mₙ₋₂₋ᵢ | cordas não cruzadas em n pontos (podem faltar) | 1, 1, 2, 4, 9, 21, 51 |
| Schröder (grande) | caminhos com passos (1,0),(0,1),(1,1) sob a diagonal | | 1, 2, 6, 22, 90, 394 |
| Delannoy D(m,n) | Σ C(m,k)C(n,k)2ᵏ | caminhos com →, ↑, ↗ | D(n,n): 1, 3, 13, 63, 321 |
| Bell | Σ_k S(n,k) | partições de conjunto | 1, 1, 2, 5, 15, 52, 203 |
| Euleriano A(n,k) | (k+1)A(n−1,k) + (n−k)A(n−1,k−1) | permutações com k subidas | linha 4: 1, 11, 11, 1 |
| Involuções | aₙ = aₙ₋₁ + (n−1)aₙ₋₂ | permutações com p∘p = id (pares/fixos) | 1, 1, 2, 4, 10, 26, 76 |
| Partições em partes distintas = em partes ímpares | Euler | | 1, 1, 1, 2, 2, 3, 4, 5 |

## Hook length (tabelas de Young)

Nº de tabelas de Young padrão de formato λ (n células): `n! / Π ganchos(c)` (gancho = células à direita + abaixo + 1). Ex.: retângulo 2×n dá Catalan. Em árvores: ordenações "pai antes do filho" = `n!/Π sz(v)`.

## Contagem com simetria (Burnside / Pólya)

- Burnside: `|órbitas| = (1/|G|) Σ_g |Fix(g)|`.
- **Colares** (só rotação), n contas, k cores: `(1/n) Σ_{d|n} φ(d)·k^(n/d)`.
- **Pulseiras** (rotação + reflexão): colares/2 mais: n ímpar → `+ ½·k^((n+1)/2)`; n par → `+ ¼·(k^(n/2) + k^(n/2+1))`.
- Rotações de um tabuleiro n×n (4 rotações): `(k^(n²) + 2·k^⌈n²/4⌉ + k^⌈n²/2⌉)/4`.
- Pólya: substitua `k` por `Σ xᵢ` em cada ciclo para contar por quantidade de cada cor.

## Inclusão–exclusão em formato de prova

- **Sobrejeções** n → k: `Σ_{i=0}^{k} (-1)ⁱ C(k, i)(k - i)ⁿ`.
- **Desarranjos**: `Dₙ = n! Σ (-1)ⁱ/i!`.
- Soluções de `x₁ + … + x_k = n` com `0 ≤ xᵢ ≤ c`: `Σ_i (-1)ⁱ C(k, i) C(n - i(c+1) + k - 1, k - 1)`.
- Contagem por gcd: `g(d)` = nº com gcd **múltiplo** de d (fácil); `f(d) = g(d) - Σ_{m>1} f(md)` (de trás para frente) — O(n log n).
- Coprimos com n em [1, x]: inclusão-exclusão nos primos de n (≤ 15 primos → 2¹⁵ termos).

## Pequenos teoremas de contagem

- **Pombo**: n + 1 objetos em n caixas ⇒ alguma com 2; generalizado: alguma com ≥ ⌈N/k⌉. Ex.: entre n + 1 prefixos mod n, dois são iguais ⇒ existe subarray com soma ≡ 0 (mod n).
- **Erdős–Szekeres**: sequência com mais de `rs` elementos distintos tem crescente de tamanho r+1 ou decrescente de tamanho s+1.
- **Contagem dupla**: conte o mesmo conjunto de duas maneiras (ex.: Σ graus = 2E).
- **Bijeções**: Prüfer (árvores ↔ sequências), parênteses ↔ caminhos de Dyck ↔ árvores binárias.
