---
title: Truque da divisão (blocos de floor(n/i))
summary: Percorre os O(sqrt n) valores distintos de floor(n/i), com somatórios e floor/ceil seguros para negativos.
status: done
complexity: O(sqrt n)
tags: divisão, somatório, floor, blocos
---

## Ideia

`floor(n/i)` assume no máximo `2*sqrt(n)` valores distintos. Para um `l` fixo, o maior `r` com o mesmo quociente é `n / (n / l)`; dentro de `[l, r]` o quociente é constante e somas como `Σ i` viram fórmulas fechadas. Para dois números `n` e `m` simultâneos, o fim do bloco é o menor dos dois.

## Código

```cpp
ll fdiv(ll a, ll b) { return a / b - ((a % b != 0) && ((a < 0) != (b < 0))); }
ll cdiv(ll a, ll b) { return a / b + ((a % b != 0) && ((a < 0) == (b < 0))); }

// f(l, r, q): para todo i em [l, r], n / i == q
template <class F> void blocks(ll n, F f) {
    for (ll l = 1, r; l <= n; l = r + 1) { r = n / (n / l); f(l, r, n / l); }
}

// f(l, r, qn, qm): n / i == qn e m / i == qm em [l, r]
template <class F> void blocks2(ll n, ll m, F f) {
    for (ll l = 1, r; l <= min(n, m); l = r + 1) {
        r = min(n / (n / l), m / (m / l));
        f(l, r, n / l, m / l);
    }
}

ll sum_floor(ll n) { // Σ floor(n/i), i = 1..n
    ll s = 0;
    blocks(n, [&](ll l, ll r, ll q) { s += (r - l + 1) * q; });
    return s;
}

ll sigma_sum(ll n, ll mod) { // Σ i * floor(n/i) mod `mod` (soma dos divisores até n)
    ll s = 0;
    blocks(n, [&](ll l, ll r, ll q) {
        ll t = (ll)((__int128)(l + r) * (r - l + 1) / 2 % mod);
        s = (s + t * (q % mod)) % mod;
    });
    return s;
}
```

## Uso

```cpp
cout << sum_floor(1000000000000LL) << "\n"; // ~2.8e13, ~2e6 blocos
```

## Complexidade e cuidados

- `fdiv`/`cdiv` corrigem a divisão do C++, que trunca para zero; use-os sempre que o dividendo puder ser negativo. O divisor não pode ser 0.
- `blocks` exige `n >= 1`; para `i` começando em outro valor, ajuste `l`.
- `Σ floor(n/i)` é ~`n ln n`: cabe em `long long` para `n` até ~1e15.
- `sigma_sum` precisa de `mod < 3e9` para o produto caber; `(l+r)*(r-l+1)` é feito em `__int128`.
- `ceil(n/i)` também é constante por blocos; use `r = (n-1)/((n-1)/l)` para `n > 1` ou reescreva como `floor((n+i-1)/i)`.
