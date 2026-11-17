---
title: Moedas: mínimo e contagem
summary: DP de troco: menor número de moedas, formas sem ordem e formas com ordem.
status: done
complexity: O(n · x)
tags: dp, moedas, mochila ilimitada
---

## Ideia

`dp[s]` é a resposta para o valor `s`. Para o mínimo: `dp[s] = 1 + min dp[s - v]`. Para contar, a ordem dos laços decide o que se conta: moedas no laço externo contam *combinações* (cada conjunto uma vez); valor no laço externo conta *sequências* (a ordem importa).

## Código

```cpp
const ll MOD = 1e9 + 7;

// menor número de moedas que somam x, ou -1
int min_moedas(const vector<int>& c, int x) {
    const int INF = INT_MAX;
    vector<int> dp(x + 1, INF);
    dp[0] = 0;
    for (int s = 1; s <= x; s++)
        for (int v : c)
            if (v <= s && dp[s - v] != INF) dp[s] = min(dp[s], dp[s - v] + 1);
    return dp[x] == INF ? -1 : dp[x];
}

// formas de somar x sem importar a ordem (1+2 e 2+1 contam uma vez)
ll combinacoes(const vector<int>& c, int x) {
    vector<ll> dp(x + 1, 0);
    dp[0] = 1;
    for (int v : c)
        for (int s = v; s <= x; s++) dp[s] = (dp[s] + dp[s - v]) % MOD;
    return dp[x];
}

// formas de somar x importando a ordem (1+2 e 2+1 são diferentes)
ll sequencias(const vector<int>& c, int x) {
    vector<ll> dp(x + 1, 0);
    dp[0] = 1;
    for (int s = 1; s <= x; s++)
        for (int v : c)
            if (v <= s) dp[s] = (dp[s] + dp[s - v]) % MOD;
    return dp[x];
}
```

## Complexidade e cuidados

- As moedas devem ser positivas; moeda 0 gera laço infinito de formas.
- Trocar a ordem dos laços em `combinacoes` conta sequências: é o erro mais comum.
- Se o guloso funciona (sistema canônico), é mais rápido; veja a ficha do problema das moedas.
- Memória `O(x)`; para `x` muito grande use meet in the middle ou matrizes.
