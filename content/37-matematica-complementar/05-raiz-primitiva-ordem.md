---
title: Raiz primitiva e ordem multiplicativa
summary: Calcula a ordem de a módulo m, decide se existe raiz primitiva e acha a menor, usando a fatoração de phi(m).
status: done
complexity: O(sqrt(m) + log^2 m) por consulta
tags: raiz primitiva, ordem, totiente, teoria dos números
---

## Ideia

A ordem de `a` módulo `m` (com `gcd(a,m)=1`) é o menor `d > 0` com `a^d = 1`, e sempre divide `phi(m)`. Partindo de `o = phi(m)`, tenta-se dividir `o` por cada primo `q` de `phi(m)` enquanto `a^(o/q) = 1`; o que sobra é a ordem exata.

`g` é raiz primitiva quando sua ordem é `phi(m)`, isto é, `g^(phi/q) != 1` para todo primo `q | phi(m)`. Existem raízes primitivas só para `m = 1, 2, 4, p^k, 2p^k` (`p` primo ímpar). Quando existem, a menor costuma ser minúscula, então a busca linear por `g = 1, 2, ...` é rápida. As demais são `g^i` com `gcd(i, phi) = 1`.

## Código

```cpp
ll mulmod(ll a, ll b, ll m) { return (__int128)a * b % m; }
ll pw(ll b, ll e, ll m) {
    ll r = 1 % m; b %= m;
    for (; e > 0; e >>= 1, b = mulmod(b, b, m)) if (e & 1) r = mulmod(r, b, m);
    return r;
}

vector<ll> prime_factors(ll n) { // primos distintos, divisão por tentativa
    vector<ll> f;
    for (ll p = 2; p * p <= n; p++) if (n % p == 0) { f.push_back(p); while (n % p == 0) n /= p; }
    if (n > 1) f.push_back(n);
    return f;
}

ll phi_of(ll n) { ll r = n; for (ll p : prime_factors(n)) r -= r / p; return r; }

ll order(ll a, ll m) { // gcd(a, m) = 1, m >= 2
    ll ph = phi_of(m), o = ph;
    for (ll q : prime_factors(ph)) while (o % q == 0 && pw(a, o / q, m) == 1) o /= q;
    return o;
}

bool has_root(ll m) {
    if (m <= 4) return true;
    if (m % 4 == 0) return false;
    if (m % 2 == 0) m /= 2;
    return prime_factors(m).size() == 1; // potência de primo ímpar
}

ll prim_root(ll m) { // menor raiz primitiva módulo m, ou -1 se não existe
    if (m == 1) return 0;
    if (!has_root(m)) return -1;
    ll ph = phi_of(m);
    vector<ll> fs = prime_factors(ph);
    for (ll g = 1; g < m; g++) {
        if (__gcd(g, m) != 1) continue;
        bool ok = true;
        for (ll q : fs) if (pw(g, ph / q, m) == 1) { ok = false; break; }
        if (ok) return g;
    }
    return -1;
}
```

## Uso

```cpp
cout << prim_root(998244353) << " " << order(2, 1000000007) << "\n"; // 3 e a ordem de 2
// todas as raízes: g^i para i em [1, phi] com gcd(i, phi) = 1
```

## Complexidade e cuidados

- A fatoração é por tentativa em `O(sqrt(n))`: serve para `m` até ~1e12 (fatorar `phi(m)` também custa `O(sqrt(phi))`). Para módulos maiores use Pollard rho.
- Para `m` primo, `phi = m - 1` e a ordem de qualquer `a` não nulo divide `m - 1`.
- `order` supõe `gcd(a, m) = 1`; sem isso o laço devolve lixo.
- `has_root` evita o laço inútil até `m` nos módulos sem raiz (como 8, 12, 15).
- `mulmod` com `__int128` mantém tudo correto para `m` até ~9e18.
