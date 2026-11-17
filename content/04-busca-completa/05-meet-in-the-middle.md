---
title: Meet in the middle
summary: Divide n em duas metades de 2^(n/2) subconjuntos e combina; exemplo: subconjuntos de soma alvo, n até 40.
status: done
complexity: O(2^(n/2) · n)
tags: busca completa, meet in the middle, subconjuntos
---

## Ideia

Com `n = 40`, `2^40` é inviável, mas `2^20` é fácil. Gere as somas de todos os subconjuntos de cada metade. Para cada soma `s` da esquerda, conte quantas somas da direita valem `alvo - s`: ordenando a direita, isso é uma busca binária. O custo cai de `2^n` para `2^(n/2)` vezes um fator logarítmico.

## Código

```cpp
vector<ll> somas(const vector<ll>& a) {  // soma de todos os subconjuntos
    vector<ll> r = {0};
    for (ll x : a) {
        int m = r.size();
        for (int i = 0; i < m; i++) r.push_back(r[i] + x);
    }
    return r;
}

// quantos subconjuntos de a (por posição, vazio incluso) somam alvo; n <= 40
ll mitm(const vector<ll>& a, ll alvo) {
    int h = a.size() / 2;
    vector<ll> L = somas(vector<ll>(a.begin(), a.begin() + h));
    vector<ll> R = somas(vector<ll>(a.begin() + h, a.end()));
    sort(R.begin(), R.end());
    ll cnt = 0;
    for (ll s : L) {
        auto [lo, hi] = equal_range(R.begin(), R.end(), alvo - s);
        cnt += hi - lo;
    }
    return cnt;
}
```

## Complexidade e cuidados

- Memória `O(2^(n/2))`: para `n = 40` são cerca de um milhão de somas por metade.
- Funciona com valores negativos e arbitrários, ao contrário da DP por soma, que exige valores pequenos.
- Para mínimo de `|soma - alvo|`, use `lower_bound` e olhe o vizinho de cada lado.
- Se os subconjuntos tiverem restrições entre as metades (por exemplo, tamanho), guarde também o tamanho e agrupe por ele.
