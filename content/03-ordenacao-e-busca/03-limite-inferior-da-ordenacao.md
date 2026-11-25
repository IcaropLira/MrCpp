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
// menor k com 2^k >= n! (0 <= n <= 33); -1 fora do domínio
int min_comparisons(int n) {
    if (n < 0 || n > 33) return -1;
    unsigned __int128 f = 1;
    for (int i = 2; i <= n; i++) f *= i;
    int k = 0;
    while (((unsigned __int128)1 << k) < f) k++;
    return k;
}
```

## Uso

`min_comparisons(4)` devolve 5 e `min_comparisons(10)` devolve 22. Para `n = 0` ou `n = 1`, devolve 0 (pois `0! = 1! = 1`). Valores fora de `0..33` devolvem `-1`.

## Complexidade e cuidados

- É um limite inferior: merge sort faz `n log n - O(n)` comparações, perto do limite. Para `n = 5` o limite é 7 e o algoritmo de Ford-Johnson (merge insertion) atinge 7; a inserção binária simples faz 8.
- Vale só para algoritmos baseados em comparação; não vale para counting sort, radix sort ou ordenação com chaves pequenas.
- O fatorial cabe em `unsigned __int128` até `33!`; a função rejeita valores fora de `0..33` antes de calcular, evitando overflow e resultado enganoso. Para valores maiores, use a soma `sum log2(i)` (aproximação) ou a fórmula de Stirling.
