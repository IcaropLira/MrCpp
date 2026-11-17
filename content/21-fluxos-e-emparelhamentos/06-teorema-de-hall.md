---
title: Teorema de Hall
summary: Há emparelhamento que cobre a esquerda se e só se todo subconjunto S tem |N(S)| >= |S|; achar o violador e a deficiência.
status: done
complexity: O(2^n)
tags: emparelhamento, hall, bitmask
---

## Ideia

Hall: um emparelhamento que cobre todos os `n` vértices da esquerda existe se e só se para todo subconjunto `S` da esquerda, `|N(S)| >= |S|`. Quando falha, o subconjunto violador mostra por quê. Além disso, `max |S| - |N(S)|` (a *deficiência*) é exatamente `n - emparelhamento máximo`. A enumeração por máscaras monta `N(S)` incrementalmente e serve para `n` pequeno.

## Código

```cpp
// adj[u] = máscara dos vizinhos (direita) de u, u em 0..n-1, n <= 22
// devolve a máscara de um S com |N(S)| < |S| (0 se Hall vale) e a deficiência em def
int hall_violador(const vector<int>& adj, int& def) {
    int n = adj.size();
    vector<int> viz(1 << n, 0);
    int pior = 0;
    def = 0;
    for (int S = 1; S < (1 << n); S++) {
        int low = __builtin_ctz(S);
        viz[S] = viz[S & (S - 1)] | adj[low];
        int d = __builtin_popcount(S) - __builtin_popcount(viz[S]);
        if (d > def) def = d, pior = S;
    }
    return pior;
}
```

## Complexidade e cuidados

- Se `def > 0`, o emparelhamento máximo vale `n - def`.
- Para `n` grande use Hopcroft-Karp e, se precisar do violador, os vértices alcançáveis por caminhos alternantes a partir de um vértice livre.
- Hall se aplica também a escolher representantes distintos (sistemas de representantes distintos) e a cobrir tarefas com trabalhadores.
- Memória `4 · 2^n` bytes.
