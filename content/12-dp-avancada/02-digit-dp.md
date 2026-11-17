---
title: Digit DP
summary: Contar números até N com uma propriedade nos dígitos, usando a flag "tight".
status: done
complexity: O(dígitos · estados · 10)
tags: dp, dígitos, contagem
---

## Ideia

Construa o número dígito a dígito, da esquerda para a direita. O estado é a posição, o que a propriedade precisa lembrar (soma, último dígito) e a flag `tight`: enquanto os dígitos escolhidos são iguais ao prefixo de `N`, o próximo dígito não pode passar do de `N`; depois que se escolhe um menor, qualquer dígito vale. Para um intervalo `[L, R]` use `f(R) - f(L-1)`.

## Código

```cpp
// quantos x em [0, N] têm soma dos dígitos == s
ll soma_digitos(ll N, int s) {
    string d = to_string(N);
    int n = d.size();
    vector<vector<array<ll, 2>>> memo(n + 1, vector<array<ll, 2>>(s + 1, {-1, -1}));
    function<ll(int, int, int)> go = [&](int pos, int rem, int tight) -> ll {
        if (rem < 0) return 0;
        if (pos == n) return rem == 0;
        ll& r = memo[pos][rem][tight];
        if (r != -1) return r;
        r = 0;
        int lim = tight ? d[pos] - '0' : 9;
        for (int x = 0; x <= lim; x++) r += go(pos + 1, rem - x, tight && x == lim);
        return r;
    };
    return go(0, s, 1);
}

// quantos x em [1, N] não têm dois dígitos adjacentes iguais
ll sem_adjacentes_iguais(ll N) {
    if (N <= 0) return 0;
    string d = to_string(N);
    int n = d.size();
    // memo[pos][último dígito (10 = ainda não começou)][tight]
    vector<vector<array<ll, 2>>> memo(n + 1, vector<array<ll, 2>>(11, {-1, -1}));
    function<ll(int, int, int)> go = [&](int pos, int last, int tight) -> ll {
        if (pos == n) return last != 10;  // exclui o zero (nenhum dígito colocado)
        ll& r = memo[pos][last][tight];
        if (r != -1) return r;
        r = 0;
        int lim = tight ? d[pos] - '0' : 9;
        for (int x = 0; x <= lim; x++) {
            if (last == 10 && x == 0) r += go(pos + 1, 10, tight && x == lim);  // zeros à esquerda
            else if (x != last) r += go(pos + 1, x, tight && x == lim);
        }
        return r;
    };
    return go(0, 10, 1);
}
```

## Complexidade e cuidados

- A memoização só vale para o mesmo `N`; zere/recrie a tabela para cada chamada (ou memoize só o caso `tight = 0`).
- Zeros à esquerda não contam como dígitos em propriedades como "sem repetição"; por isso o estado `10` (ainda não começou).
- Para `[L, R]`, use `f(R) - f(L-1)` com `L >= 1`.
- Para propriedades em outra base, troque `to_string` e o limite `9` pela base.
