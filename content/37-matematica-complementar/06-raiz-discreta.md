---
title: Raiz discreta (x^k = a mod p)
summary: Resolve x^k congruente a a módulo primo p com raiz primitiva e BSGS, devolvendo todas as soluções.
status: done
complexity: O(sqrt(p) + número de soluções)
tags: raiz discreta, raiz primitiva, bsgs, teoria dos números
---

## Ideia

Seja `g` raiz primitiva de `p`. Para `a != 0` escreva `x = g^y`; a equação vira `(g^k)^y = a`, um logaritmo discreto na base `h = g^k`, cuja ordem é `(p-1)/d` com `d = gcd(k, p-1)`. Resolve-se `y` por baby-step giant-step (como em `33-matematica-avancada/04-logaritmo-discreto`), restrito à ordem de `h`.

Existindo uma solução `y`, todas as outras são `y + t*(p-1)/d` para `t = 0..d-1` (soma-se um múltiplo da ordem de `h`), o que dá exatamente `d` raízes distintas. Se `a = 0` a única raiz é `x = 0`. Sem solução para `y`, `a` não é potência `k`-ésima.

## Código

Reaproveita `pw`, `prim_root` e `order` de `05-raiz-primitiva-ordem`.

```cpp
// menor y >= 0 com h^y = a (mod p), onde ord é a ordem de h; -1 se não existe
ll bsgs(ll h, ll a, ll p, ll ord) {
    ll m = (ll)sqrtl((long double)ord) + 1;
    unordered_map<ll, ll> baby;
    baby.reserve(2 * m);
    ll cur = 1;
    for (ll j = 0; j < m; j++) { baby.emplace(cur, j); cur = mulmod(cur, h, p); }
    ll f = pw(h, (ord - m % ord) % ord, p); // h^-m
    cur = a;
    for (ll i = 0; i <= m; i++) {
        auto it = baby.find(cur);
        if (it != baby.end()) return i * m + it->second;
        cur = mulmod(cur, f, p);
    }
    return -1;
}

// todas as raízes x em [0, p) de x^k = a (mod p); p primo, k >= 1
vector<ll> kth_roots(ll k, ll a, ll p) {
    a %= p; if (a < 0) a += p;
    if (a == 0) return {0};
    ll g = prim_root(p), ph = p - 1, d = __gcd(k, ph), ord = ph / d;
    ll y = bsgs(pw(g, k % ph, p), a, p, ord);
    if (y < 0) return {};
    vector<ll> r;
    ll x = pw(g, y, p), step = pw(g, ord, p); // g^ord tem ordem d
    for (ll t = 0; t < d; t++, x = mulmod(x, step, p)) r.push_back(x);
    sort(r.begin(), r.end());
    return r;
}
```

## Uso

```cpp
for (ll x : kth_roots(2, 4, 13)) cout << x << " "; // 2 11
cout << kth_roots(3, 5, 1000000007).size() << "\n"; // 0 ou 3 (gcd(3, p-1))
```

## Complexidade e cuidados

- `p` primo; para módulo composto é preciso tratar cada potência de primo e juntar por CRT.
- O número de raízes é `gcd(k, p-1)` quando existe alguma; a saída pode ser grande se `k` compartilha muito com `p-1`.
- O custo de `unordered_map` domina; para `p` ~1e9 são ~3e4 entradas, trivial. Acima de ~1e13 o BSGS fica inviável.
- `prim_root` fatora `p-1` por tentativa em `O(sqrt p)`.
- Para `k = 2` prefira Tonelli-Shanks (`33-matematica-avancada/05-raiz-quadrada-modular`), que é polinomial em `log p`.
