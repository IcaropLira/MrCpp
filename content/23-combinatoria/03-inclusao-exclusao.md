---
title: Inclusão-exclusão
summary: Conta a união (ou o complemento) alternando sinais; exemplos: coprimos, desarranjos e sobrejeções.
status: done
complexity: O(2^k) subconjuntos
tags: combinatória, inclusão-exclusão
---

## Ideia

`|A_1 ∪ ... ∪ A_k| = sum_{S ≠ ∅} (-1)^{|S|+1} |∩_{i∈S} A_i|`. Costuma ser usada pelo complemento: "quantos itens não têm nenhuma propriedade" é `sum_S (-1)^{|S|} |∩ A_i|`. Quando as interseções são fáceis (por exemplo, divisibilidade, onde a interseção é o mínimo múltiplo comum), enumera-se `S` por DFS e poda-se quando o produto passa de `N`.

## Código

```cpp
// quantos x em [1, N] não são divisíveis por nenhum dos primos/inteiros d[i] (d[i] >= 1, 2 a 2 coprimos ou não: usa lcm)
ll sem_divisores(ll N, const vector<ll>& d) {
    int k = d.size();
    ll total = 0;
    function<void(int, ll, int)> go = [&](int i, ll l, int sinal) {
        if (i == k) { total += sinal * (N / l); return; }
        go(i + 1, l, sinal);                       // não escolhe d[i]
        ll g = __gcd(l, d[i]);
        __int128 nl = (__int128)l / g * d[i];
        if (nl <= N) go(i + 1, (ll)nl, -sinal);    // escolhe (poda se o lcm passa de N)
    };
    go(0, 1, 1);
    return total;
}

const ll MOD = 1e9 + 7;
ll C[1005][1005];  // binomiais (preencher com Pascal até 1000)

// permutações de n elementos sem ponto fixo, por inclusão-exclusão
ll desarranjos(int n) {
    vector<ll> f(n + 1, 1);
    for (int i = 1; i <= n; i++) f[i] = f[i - 1] * i % MOD;
    ll r = 0;
    for (int k = 0; k <= n; k++) {
        ll t = C[n][k] * f[n - k] % MOD;
        r = (r + (k % 2 ? MOD - t : t)) % MOD;
    }
    return r;
}

// funções sobrejetoras de n elementos em k: sum_j (-1)^j C(k,j) (k-j)^n
ll sobrejecoes(int n, int k) {
    auto pw = [&](ll a, ll e) { ll r = 1; for (a %= MOD; e; e >>= 1, a = a * a % MOD) if (e & 1) r = r * a % MOD; return r; };
    ll r = 0;
    for (int j = 0; j <= k; j++) {
        ll t = C[k][j] * pw(k - j, n) % MOD;
        r = (r + (j % 2 ? MOD - t : t)) % MOD;
    }
    return r;
}
```

## Complexidade e cuidados

- Antes de usar `desarranjos` e `sobrejecoes`, preencha `C` com Pascal: `C[i][0] = 1; C[i][j] = (C[i-1][j-1] + C[i-1][j]) % MOD`.
- `sem_divisores` aceita divisores não coprimos porque usa o `lcm`; a poda `lcm > N` torna o DFS bem menor que `2^k`.
- O sinal é `(-1)^{|S|}`: erros de sinal são o bug mais comum; teste com `N` pequeno.
- Para `k` grande (mais de ~20 propriedades) prefira DP ou funções multiplicativas (Möbius).
