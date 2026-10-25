---
title: Jogo de Nim
summary: Quem vence no Nim.
status: done
complexity: O(n)
tags: jogos, nim, xor
---

## Ideia

O primeiro jogador vence se o XOR dos tamanhos das pilhas for diferente de zero.

## Código

```cpp
bool firstWins(const vector<int>& piles) {
    int x = 0;
    for (int p : piles) x ^= p;
    return x != 0;
}
```
