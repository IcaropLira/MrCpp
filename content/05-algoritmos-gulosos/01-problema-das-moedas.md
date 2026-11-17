---
title: Problema das moedas
summary: Troco mínimo guloso, teste de sistema canônico e o contraexemplo clássico.
status: done
complexity: O(n) por troco; O(n · C) para testar o sistema
tags: guloso, moedas, troco
---

## Ideia

Escolher sempre a maior moeda que cabe é ótimo só para alguns sistemas (os canônicos, como 1, 5, 10, 25, 50, 100). Para `{1, 3, 4}` e valor 6 o guloso dá `4 + 1 + 1` (3 moedas) mas o ótimo é `3 + 3` (2). Um sistema é canônico se e só se não existe contraexemplo abaixo de `c[n-2] + c[n-1]` (as duas maiores moedas), então basta comparar o guloso com a DP até esse limite.

## Código

```cpp
// moedas em ordem decrescente, contendo 1; devolve o número de moedas do guloso
int greedy_coins(const vector<int>& c, int x) {
    int cnt = 0;
    for (int v : c) cnt += x / v, x %= v;
    return cnt;
}

// c em ordem decrescente e contendo 1: o guloso é ótimo para todo valor?
bool is_canonical(const vector<int>& c) {
    int n = c.size();
    if (n < 2) return true;
    int lim = c[0] + c[1];  // as duas maiores moedas
    vector<int> dp(lim + 1, INT_MAX);
    dp[0] = 0;
    for (int x = 1; x <= lim; x++) {
        for (int v : c) if (v <= x && dp[x - v] + 1 < dp[x]) dp[x] = dp[x - v] + 1;
        if (greedy_coins(c, x) != dp[x]) return false;
    }
    return true;
}
```

## Complexidade e cuidados

- Sem a moeda 1 alguns valores são impossíveis; trate esse caso à parte (DP com `INF`).
- Se o sistema não for canônico, use a DP de troco mínimo (`11-dp-classica`).
- O limite `c[0] + c[1]` vem do teorema de Kozen e Zaks: o menor contraexemplo, se existir, é menor que a soma das duas maiores moedas.
- Para contar *formas* de dar o troco o guloso não serve; use DP.
