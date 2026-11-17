---
title: Contando ladrilhos
summary: Ladrilhar com dominós: recorrência 2×n e DP por perfil em grade n×m.
status: done
complexity: O(n · m · 2^m)
tags: dp, bitmask, ladrilhos, dominó
---

## Ideia

Para `2 × n`, o último bloco é um dominó vertical (resta `n-1`) ou dois horizontais (resta `n-2`): `f(n) = f(n-1) + f(n-2)`. Em grade `n × m`, processe as células em ordem de linhas e guarde uma máscara de `m` bits: o bit `j` diz se a célula já está preenchida por um dominó vindo de antes. Em cada célula vazia, ponha um dominó vertical (ocupa a de baixo) ou horizontal (ocupa a da direita).

## Código

```cpp
// ladrilhos 2 x n com dominós 1x2
ll domino_2xn(int n) {
    ll a = 1, b = 1;  // f(0), f(1)
    for (int i = 2; i <= n; i++) tie(a, b) = make_pair(b, a + b);
    return n == 0 ? 1 : b;
}

// ladrilhos n x m com dominós 1x2 (m pequeno, m <= 12); o resultado é exato em long long
ll dominos(int n, int m) {
    vector<ll> dp(1 << m, 0), nd;
    dp[0] = 1;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++) {
            nd.assign(1 << m, 0);
            for (int mask = 0; mask < (1 << m); mask++) {
                ll v = dp[mask];
                if (!v) continue;
                if (mask >> j & 1) nd[mask ^ (1 << j)] += v;  // já preenchida
                else {
                    if (i + 1 < n) nd[mask | (1 << j)] += v;  // vertical
                    if (j + 1 < m && !(mask >> (j + 1) & 1)) nd[mask | (1 << (j + 1))] += v;  // horizontal
                }
            }
            dp = nd;
        }
    return dp[0];
}
```

## Complexidade e cuidados

- Se `n * m` é ímpar a resposta é 0.
- Verificação: `dominos(8, 8) = 12988816`.
- Troque `n` e `m` para deixar a menor dimensão como `m`: o custo é `2^m`.
- Para contar módulo `p` com `n` enorme, monte a matriz de transição `2^m × 2^m` e eleve à potência.
