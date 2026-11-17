---
title: bitset
summary: Vetor de bits com operações em blocos de 64; exemplo: soma de subconjuntos.
status: done
complexity: O(n · S / 64)
tags: stl, bitset, dp
---

## Ideia

`bitset<N>` guarda `N` bits (tamanho fixo em tempo de compilação) e faz `&`, `|`, `^`, deslocamentos e contagem em palavras de 64 bits, ou seja, 64 vezes mais rápido que um laço. Um uso clássico é a mochila booleana: `dp |= dp << x` marca todos os valores alcançáveis ao incluir o item `x`.

## Código

```cpp
const int S = 100001;

// quais somas de 0..S-1 podem ser formadas escolhendo um subconjunto de a
bitset<S> somas_possiveis(const vector<int>& a) {
    bitset<S> dp;
    dp[0] = 1;
    for (int x : a) dp |= dp << x;
    return dp;
}
```

## Complexidade e cuidados

- `dp << x` descarta bits que passam de `N-1`: escolha `N` maior que a soma máxima.
- `b.count()` conta bits ligados e `b._Find_first()`/`_Find_next(i)` percorrem só os ligados (extensão do GCC).
- O tamanho precisa ser constante; para tamanho variável use `vector<bool>` ou `vector<ull>` manual.
- Com itens grandes e muitos, combine com a técnica de itens repetidos (binarização) para reduzir o número de itens.
