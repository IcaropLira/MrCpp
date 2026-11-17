---
title: Teorema chinês do resto
summary: Resolve x ≡ a_i (mod m_i) com módulos não necessariamente coprimos.
status: done
complexity: O(k log M)
tags: teoria dos números, crt, congruências, euclides estendido
---

## Ideia

Combine duas congruências por vez: `x ≡ a1 (mod m1)` e `x ≡ a2 (mod m2)`. Com `g = gcd(m1, m2)`, há solução se e só se `g` divide `a2 - a1`; então a solução única módulo `lcm(m1, m2)` vem do Euclides estendido: `x = a1 + m1 · t`, com `t ≡ ((a2 - a1) / g) · inv(m1 / g) (mod m2 / g)`. Repita acumulando o resultado.

## Código

```cpp
ll egcd(ll a, ll b, ll& x, ll& y) {
    if (!b) { x = 1; y = 0; return a; }
    ll x1, y1, g = egcd(b, a % b, x1, y1);
    x = y1; y = x1 - (a / b) * y1;
    return g;
}

// x ≡ a (mod m) e x ≡ b (mod n); devolve {x mod lcm, lcm} ou {-1, -1} se não há solução
pair<ll, ll> crt2(ll a, ll m, ll b, ll n) {
    ll x, y, g = egcd(m, n, x, y);
    if ((b - a) % g) return {-1, -1};
    ll l = m / g * n;  // lcm: precisa caber em long long
    ll t = (__int128)((b - a) / g) % (n / g) * x % (n / g);
    ll r = ((a + (__int128)m * t) % l + l) % l;
    return {r, l};
}

// sistema com vários módulos
pair<ll, ll> crt(const vector<ll>& a, const vector<ll>& m) {
    pair<ll, ll> r = {0, 1};
    for (size_t i = 0; i < a.size(); i++) {
        r = crt2(r.first, r.second, ((a[i] % m[i]) + m[i]) % m[i], m[i]);
        if (r.first < 0) return {-1, -1};
    }
    return r;
}
```

## Complexidade e cuidados

- O módulo final é o `lcm` dos módulos e precisa caber em `long long`; senão use `__int128` ou o Garner.
- Restos negativos são normalizados com `((a % m) + m) % m` antes de combinar.
- Para módulos coprimos, o resultado é a fórmula clássica com `M = prod m_i`.
- Se `crt` devolve `{-1, -1}` não há solução (sistema incompatível).
