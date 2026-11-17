---
title: Esperança
summary: Linearidade da esperança, coupon collector e esperança por DP, em double e em módulo primo.
status: done
complexity: O(S · F) no exemplo do dado
tags: probabilidade, esperança, dp
---

## Ideia

A esperança é linear: `E[X + Y] = E[X] + E[Y]` mesmo com dependência. Para contar algo, escreva-o como soma de indicadores e some as probabilidades. Exemplos: o número esperado de pontos fixos de uma permutação aleatória é `n · (1/n) = 1`; o coupon collector (juntar os `n` cupons) leva `n · H_n` sorteios. Quando o processo tem estados, `E[estado] = 1 + sum p · E[próximo]` e a DP é resolvida de trás para frente.

## Código

```cpp
// coupon collector: sorteios esperados para ver os n cupons, n * H_n
double coupon(int n) {
    double h = 0;
    for (int i = 1; i <= n; i++) h += 1.0 / i;
    return n * h;
}

// lançamentos esperados de um dado justo de F faces até a soma chegar a pelo menos S
double lancamentos_ate_soma(int F, int S) {
    vector<double> E(S + F + 1, 0.0);  // E[s] = 0 para s >= S
    for (int s = S - 1; s >= 0; s--) {
        double t = 0;
        for (int f = 1; f <= F; f++) t += E[s + f];
        E[s] = 1 + t / F;
    }
    return E[0];
}

// o mesmo valor como fração P/Q reduzida módulo MOD (primo)
const ll MOD = 998244353;
ll pw(ll a, ll e) {
    ll r = 1;
    for (a %= MOD; e; e >>= 1, a = a * a % MOD) if (e & 1) r = r * a % MOD;
    return r;
}
ll lancamentos_ate_soma_mod(int F, int S) {
    vector<ll> E(S + F + 1, 0);
    ll invF = pw(F, MOD - 2);
    for (int s = S - 1; s >= 0; s--) {
        ll t = 0;
        for (int f = 1; f <= F; f++) t = (t + E[s + f]) % MOD;
        E[s] = (1 + t * invF) % MOD;
    }
    return E[0];
}
```

## Complexidade e cuidados

- Em módulo, a esperança é um racional `P/Q` e a saída é `P · Q^{-1} mod p`: exige `Q` não divisível por `p`.
- Linearidade dispensa independência; já o produto `E[XY] = E[X] E[Y]` exige.
- Para somas parciais (`t`) em DP com janela, use soma de prefixos e fique em `O(S)`.
- `n · H_n ≈ n (ln n + 0,577)`: para `n = 100` são cerca de 518 sorteios.
