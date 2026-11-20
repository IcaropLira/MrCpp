---
title: Lucas e CRT geral
summary: C(n, k) mod p primo pequeno com n até 1e18; sistema de congruências com módulos quaisquer.
status: done
complexity: O(p + log_p n) · O(log m) por equação
tags: lucas, crt, teorema chinês, binomial, euclides estendido
---

## Fatos

- **Lucas**: `C(n, k) ≡ Π C(nᵢ, kᵢ) (mod p)`, com `nᵢ, kᵢ` os dígitos na base `p`. Se algum `kᵢ > nᵢ`, dá 0.
- Módulo composto livre de quadrados (ex.: m = 3·5·7·11): Lucas em cada primo + CRT. (Com potência de primo, pᵉ, use o Lucas generalizado de Granville.)
- **CRT geral**: `x ≡ a₁ (m₁)`, `x ≡ a₂ (m₂)` tem solução ⇔ `a₁ ≡ a₂ (mod g)`, `g = gcd(m₁, m₂)`; a solução é única mod `lcm`. Use `__int128` nas contas.

## Código (consultas `C n k p` e `R c a₁ m₁ … `)

```cpp
// Lucas: C(n, k) mod p primo pequeno, n até 1e18:  C(n,k) ≡ Π C(n_i, k_i) (dígitos na base p)
// CRT geral (módulos não coprimos): combina x ≡ a1 (m1), x ≡ a2 (m2); -1 se impossível
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using i128 = __int128;

ll pw(ll b, ll e, ll m) { ll r = 1 % m; b %= m; for (; e; e >>= 1, b = (i128)b * b % m) if (e & 1) r = (i128)r * b % m; return r; }
ll lucas(ll n, ll k, ll p) {                    // pré-calcular fatoriais até p se muitas consultas
    if (k < 0 || k > n) return 0;
    ll r = 1;
    while (n || k) {
        ll a = n % p, b = k % p;
        if (b > a) return 0;
        ll num = 1, den = 1;
        for (ll i = 0; i < b; i++) { num = num * ((a - i) % p) % p; den = den * ((i + 1) % p) % p; }
        r = r * num % p * pw(den, p - 2, p) % p;
        n /= p; k /= p;
    }
    return r;
}
ll ext(ll a, ll b, ll &x, ll &y) { if (!b) { x = 1; y = 0; return a; } ll g = ext(b, a % b, y, x); y -= a / b * x; return g; }
pair<ll,ll> crt(ll a1, ll m1, ll a2, ll m2) {   // retorna (x, lcm) ou (-1, -1)
    ll x, y, g = ext(m1, m2, x, y);
    if ((a2 - a1) % g) return {-1, -1};
    ll l = m1 / g * m2;
    i128 t = (i128)(a2 - a1) / g * x % (m2 / g);
    ll r = (ll)(((i128)a1 + t * m1) % l); if (r < 0) r += l;
    return {r, l};
}

int main() {
    int q; cin >> q;
    while (q--) {
        string t; cin >> t;
        if (t == "C") { ll n, k, p; cin >> n >> k >> p; cout << lucas(n, k, p) << '\n'; }
        else { int c; cin >> c; ll a = 0, m = 1; bool ok = true;
            while (c--) { ll ai, mi; cin >> ai >> mi; if (ok) { auto [r, l] = crt(a, m, ai, mi); if (r < 0) ok = false; else a = r, m = l; } }
            cout << (ok ? a : -1) << '\n'; }
    }
}
```

Exemplo testado — entrada:

```text
3
C 1000000000000000000 3 13
R 2 2 3 3 5
R 2 1 4 2 6
```

saída:

```text
0
8
-1
```

> Verificação: 4000 consultas aleatórias contra math.comb e busca direta.
