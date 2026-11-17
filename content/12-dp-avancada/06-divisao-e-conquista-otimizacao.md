---
title: Divisão e conquista (otimização de DP)
summary: Acelera dp[k][i] = min_j dp[k-1][j] + custo(j,i) de O(k n²) para O(k n log n) quando o ótimo é monótono.
status: done
complexity: O(k · n log n)
tags: dp, divisão e conquista, otimização
---

## Ideia

Se o índice ótimo `opt(i)` de `dp[k][i]` cresce junto com `i` (isto vale quando o custo satisfaz a desigualdade do quadrângulo), calcule o meio `mid` varrendo só `[optl, optr]`, descubra seu ótimo e recurse: a esquerda usa `[optl, opt]` e a direita `[opt, optr]`. Cada nível da recursão varre `O(n)` candidatos no total, e há `log n` níveis.

## Código

```cpp
// divide a em k blocos contíguos não vazios minimizando a soma dos quadrados das somas dos blocos
ll particao(const vector<ll>& a, int k) {
    int n = a.size();
    vector<ll> pre(n + 1, 0);
    for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];
    auto cost = [&](int j, int i) { ll s = pre[i] - pre[j]; return s * s; };  // bloco a[j..i-1]

    const ll INF = LLONG_MAX / 4;
    vector<ll> prev(n + 1, INF), cur(n + 1, INF);
    prev[0] = 0;  // camada 0: só o prefixo vazio
    function<void(int, int, int, int)> go = [&](int l, int r, int optl, int optr) {
        if (l > r) return;
        int mid = (l + r) / 2, bi = -1;
        ll best = INF;
        for (int j = optl; j <= min(mid - 1, optr); j++) {
            if (prev[j] >= INF) continue;
            ll v = prev[j] + cost(j, mid);
            if (v < best) best = v, bi = j;
        }
        cur[mid] = best;
        go(l, mid - 1, optl, bi < 0 ? optl : bi);
        go(mid + 1, r, bi < 0 ? optl : bi, optr);
    };
    for (int t = 1; t <= k; t++) {
        fill(cur.begin(), cur.end(), INF);
        go(t, n, t - 1, n - 1);  // com t blocos, o prefixo tem pelo menos t elementos
        swap(prev, cur);
    }
    return prev[n];
}
```

## Complexidade e cuidados

- Só vale se o ótimo for monótono (custo com desigualdade do quadrângulo: `c(a,c) + c(b,d) <= c(a,d) + c(b,c)` para `a<=b<=c<=d`). Teste contra a DP cúbica antes de confiar.
- Aqui `k <= n`; com `k > n` não há partição em blocos não vazios.
- Para `k` grande, a técnica do Aliens (WQS) elimina o fator `k`.
- `cost(j, i)` precisa ser `O(1)` (use somas de prefixo).
