---
title: Fatos, paradoxos e números úteis
summary: Paradoxo do aniversário (colisão de hash), série harmônica, limites de divisores/primos, provas de log em small to large e binary lifting.
status: done
complexity: —
tags: paradoxo do aniversário, harmônica, divisores, primos, fatos, teoria
---

## Paradoxo do aniversário (hash!)

- Com `h` valores aleatórios em `M` possibilidades, a probabilidade de alguma colisão é ≈ `1 - e^(-h²/2M)` ≈ `h² / 2M`.
- Colisão fica provável quando `h ≈ √M`. Com `M = 10⁹+7`, `√M ≈ 3·10⁴`: comparar ~10⁴–10⁵ hashes entre si **já colide**.
- Comparar **um par** de hashes: erro ≈ `1/M`. Comparar **todos com todos**: erro ≈ `h²/2M`.
- **Hash duplo** (dois primos ~10⁹) → `M ≈ 10¹⁸`: colisão só com `h ≈ 10⁹`. Ou mod `2⁶¹ - 1` com `__int128`.
- Base **aleatória** e maior que o alfabeto: impede casos anti-hash preparados.

## Série harmônica

- `n/1 + n/2 + … + n/n ≈ n ln n`. Laços "para cada `d`, percorra os múltiplos de `d`" custam `O(n log n)`.
- Crivo de Eratóstenes: `O(n log log n)`.

## Por que é log?

- **Small to large**: um elemento só muda de caixa quando está na menor; a caixa nova tem ≥ 2× o tamanho → muda ≤ `log₂ n` vezes. Total `O(n log n)` movimentos (teste da aula: ingênuo > 30 s, small to large 0,4 s com n = 2·10⁵).
- **Binary lifting**: qualquer distância `k` é soma de potências de 2 distintas (binário de `k`) → `O(log k)` saltos.
- **Árvore binária / segtree**: a largura dobra a cada nível → altura `log₂ n`.
- **BIT**: cada passo liga/desliga um bit de `i` → `O(log n)`.
- **Union by size (DSU)**: mesma prova do small to large.
- **HLD**: um caminho cruza `O(log n)` arestas leves.

## Números que ajudam

| Fato | Valor |
|---|---|
| Primos ≤ 10⁶ | 78 498 |
| Primos ≤ 10⁷ | 664 579 |
| Maior quantidade de divisores para n ≤ 10⁶ | 240 |
| Maior quantidade de divisores para n ≤ 10⁹ | 1 344 |
| Maior quantidade de divisores para n ≤ 10¹⁸ | 103 680 |
| Primos distintos de n ≤ 10¹⁸ | no máximo 15 |
| 10⁹+7 e 998 244 353 | primos (998244353 = 119·2²³ + 1, bom para NTT) |
| 2⁶¹ − 1 | primo de Mersenne (hash) |
| Fibonacci: F(90) | ≈ 2,9·10¹⁸ (cabe em long long) |
| 20! | ≈ 2,4·10¹⁸ (21! não cabe) |
| C(60, 30) | ≈ 1,2·10¹⁷ |
| Catalan C₁₉ | ≈ 1,8·10⁹ |

## "Paradoxos" e contraintuições de contest

- **Float não é exato**: `0.1 + 0.2 != 0.3`; `sqrt(2)*sqrt(2) != 2`. Use inteiros sempre que der.
- **A segtree "é melhor" mas o prefixo basta** quando não há update (contraexemplo: Candies).
- **A ordem de visita muda a linearização** de uma árvore, mas não sua estrutura → precisa de forma canônica.
- **Trocar a raiz só muda uma aresta de dono** (rerooting).
- **Um único `swap` antes do merge** (small to large) muda `O(n²)` para `O(n log n)`.
- **Grafo não direcionado = dirigido com ida e volta**: a conectividade é o que importa, então dá para manipular o grafo à vontade desde que a preserve (base dos vértices auxiliares).
- **Usar o cupom nunca piora** (⌊c/2⌋ ≤ c), por isso basta olhar a camada "usado".
- **Pontos no meio do lado**: o fecho "matemático" não os tem, mas alguns juízes pedem (CSES 2195).
- **Probabilidade de vencer ≠ esperança**; linearidade da esperança vale mesmo com variáveis dependentes.
