---
title: Limite inferior da ordenação
summary: Toda ordenação por comparações precisa de pelo menos ceil(log2(n!)) comparações no pior caso.
status: done
complexity: Ω(n log n)
tags: ordenação, limite inferior, árvore de decisão
---

## Ideia

Um algoritmo que só compara elementos é uma árvore de decisão binária. Ela precisa de uma folha para cada uma das `n!` permutações, e uma árvore binária de altura `h` tem no máximo `2^h` folhas. Logo `h >= ceil(log2(n!))`, que cresce como `n log n`. Counting sort e radix sort escapam disso porque não comparam: usam o valor da chave como índice.

## Código

```cpp
// menor k com 2^k >= n! (n <= 33): mínimo de comparações no pior caso
int min_comparisons(int n) {
    unsigned __int128 f = 1;
    for (int i = 2; i <= n; i++) f *= i;
    int k = 0;
    while (((unsigned __int128)1 << k) < f) k++;
    return k;
}
```

## Uso

`min_comparisons(4)` devolve 5 e `min_comparisons(10)` devolve 22.

## Complexidade e cuidados

- É um limite inferior: merge sort faz `n log n - O(n)` comparações, perto do limite. Para `n = 5` o limite é 7 e o algoritmo de Ford-Johnson (merge insertion) atinge 7; a inserção binária simples faz 8.
- Vale só para algoritmos baseados em comparação; não vale para counting sort, radix sort ou ordenação com chaves pequenas.
- Para `n > 33` o fatorial estoura `__int128`; use a soma `sum log2(i)` (aproximação) ou a fórmula de Stirling.
