---
title: Caminho hamiltoniano
summary: Existência de caminho ou ciclo que passa por todos os vértices, por DP em máscaras.
status: done
complexity: O(2^n · n)
tags: grafos, hamiltoniano, bitmask, dp
---

## Ideia

Problema NP-completo, então só serve para `n` pequeno (até cerca de 20). `dp[mask]` guarda, como máscara, o conjunto dos vértices em que um caminho que visita exatamente `mask` pode terminar. Estender o caminho a um vizinho ainda não visitado `w` adiciona `w` a `dp[mask | 1 << w]`.

## Código

```cpp
// adj[v] = máscara dos vizinhos de v (grafo dirigido; para não dirigido, simétrico); n <= 20
// existe caminho que visita todos os vértices uma vez?
bool caminho_hamiltoniano(const vector<int>& adj) {
    int n = adj.size();
    vector<int> dp(1 << n, 0);
    for (int v = 0; v < n; v++) dp[1 << v] = 1 << v;
    for (int mask = 1; mask < (1 << n); mask++) {
        for (int ends = dp[mask]; ends; ends &= ends - 1) {
            int v = __builtin_ctz(ends);
            for (int nx = adj[v] & ~mask; nx; nx &= nx - 1) {
                int w = __builtin_ctz(nx);
                dp[mask | 1 << w] |= 1 << w;
            }
        }
    }
    return dp[(1 << n) - 1] != 0;
}

// existe ciclo que visita todos os vértices uma vez? (n >= 2; fixa o início em 0)
bool ciclo_hamiltoniano(const vector<int>& adj) {
    int n = adj.size();
    if (n == 1) return false;
    vector<int> dp(1 << n, 0);
    dp[1] = 1;
    for (int mask = 1; mask < (1 << n); mask += 2) {  // só máscaras que contêm o vértice 0
        for (int ends = dp[mask]; ends; ends &= ends - 1) {
            int v = __builtin_ctz(ends);
            for (int nx = adj[v] & ~mask; nx; nx &= nx - 1) {
                int w = __builtin_ctz(nx);
                dp[mask | 1 << w] |= 1 << w;
            }
        }
    }
    int full = (1 << n) - 1;
    for (int ends = dp[full]; ends; ends &= ends - 1)
        if (adj[__builtin_ctz(ends)] & 1) return true;  // volta ao vértice 0
    return false;
}
```

## Complexidade e cuidados

- Memória `4 · 2^n` bytes: `n = 20` usa cerca de 4 MB.
- Em `ciclo_hamiltoniano` com `n = 2` o ciclo exige as arestas `0 -> 1` e `1 -> 0`.
- Para reconstruir o caminho, guarde também o predecessor ou refaça de trás para frente com `dp`.
- O problema do caixeiro viajante (custo mínimo) usa uma DP semelhante com `dp[mask][v]`.
