---
title: Álgebra linear, matrizes e polinômios
summary: Gauss (real, mod p, xor), determinante, posto, base de xor, exponenciação de matriz, FFT/NTT, interpolação de Lagrange, funções geradoras.
status: done
complexity: Gauss O(n³) · FFT O(n log n)
tags: gauss, matriz, determinante, base xor, fft, ntt, lagrange, funções geradoras, teoria
---

## Eliminação de Gauss

- Sistema `Ax = b` (n×m): escalone escolhendo pivô (real: maior |valor| para estabilidade; mod p: qualquer não nulo + inverso). O(n² m).
- Sem pivô numa coluna → variável livre (infinitas soluções). Linha `0 = c ≠ 0` → sem solução. Nº de soluções mod p = `p^(livres)`.
- **Determinante** = produto dos pivôs × (−1)^(trocas). Inversa: escalone `[A | I]`.
- **Posto** = nº de pivôs.
- **Mod 2 / xor**: use `bitset` → O(n³/64). Sistemas de "apertar botões que invertem lâmpadas".

## Base de xor (base linear)

Insira números do bit mais alto para o mais baixo, reduzindo pela base; um número novo entra só se não for combinação dos anteriores (≤ 60 elementos).
- **Xor máximo de subconjunto**: guloso do bit alto para o baixo.
- `x` é atingível ⇔ reduz a 0. Nº de xors distintos = `2^(tamanho da base)`.
- k-ésimo menor xor: reduza a base para a forma escalonada reduzida e use os bits de k.

## Matrizes

- Exponenciação: `Mᵏ` em O(n³ log k). Recorrência linear de ordem d → matriz d×d (companheira).
- Caminhos de tamanho exatamente k entre i e j = `(Aᵏ)[i][j]`. Com (min, +) no lugar de (+, ·): menor caminho com exatamente k arestas.
- Soma `I + A + … + Aᵏ`: matriz em blocos `[[A, I], [0, I]]`.

## FFT / NTT (convolução)

- `c[k] = Σ a[i]·b[k-i]` em O(n log n). Tamanho: potência de 2 ≥ `|a| + |b| - 1`.
- **NTT** mod `998244353` (= 119·2²³ + 1, raiz primitiva 3): exata, até 2²³ elementos.
- Mod arbitrário (ex.: 10⁹+7): 3 NTTs + CRT, ou FFT dividindo em 2 partes de 15 bits.
- FFT com double: coeficientes até ~10⁶ com n ~10⁶ ainda ok; cuidado com precisão (`long double` ou quebrar).
- Aplicações: multiplicar polinômios/inteiros grandes, contar pares com soma s, casamento com curingas (`Σ (p - t)² p t`), "todas as somas a+b".
- **FWHT**: convoluções XOR/AND/OR em O(n log n) (AND/OR = SOS DP).

## Interpolação de Lagrange

Polinômio de grau ≤ d determinado por d+1 pontos. Com pontos `x = 0..d`: `P(x)` em O(d) usando prefixos/sufixos de `(x - i)` e fatoriais. Útil: `Σ_{i=1}^{n} iᵏ` é polinômio de grau k+1 em n → calcule k+2 valores e interpole.

## Funções geradoras (para modelar contagem)

- Sequência ↔ `A(x) = Σ aₙ xⁿ`. Produto = convolução. `1/(1 - x) = Σ xⁿ`; `1/(1 - x)ᵏ = Σ C(n+k-1, k-1) xⁿ` (estrelas e barras).
- Moedas de valores c: `Π 1/(1 - x^c)`. Cada item no máximo uma vez: `Π (1 + x^w)`.
- Exponencial (EGF) para objetos rotulados: `Σ aₙ xⁿ/n!`; permutações = `1/(1 - x)`; desarranjos = `e^(-x)/(1 - x)`.
- Catalan: `C(x) = 1 + x C(x)²`. Fibonacci: `x / (1 - x - x²)`.
