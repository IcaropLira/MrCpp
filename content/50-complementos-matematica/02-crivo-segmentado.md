---
title: Crivo segmentado
summary: Primos em [L, R] com R até 1e12 marcando múltiplos dos primos até √R.
status: done
complexity: O((R − L) log log R + √R)
tags: crivo, primos, segmentado
---

```cpp
// Crivo segmentado: primos em [L, R] com R até ~1e12 e R − L até ~1e7.  O((R−L) log log R + √R)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

vector<ll> primos_intervalo(ll L, ll R) {
    ll lim = sqrtl(R) + 1;
    vector<bool> comp(lim + 1, false); vector<ll> base;
    for (ll i = 2; i <= lim; i++) if (!comp[i]) { base.push_back(i); for (ll j = i * i; j <= lim; j += i) comp[j] = true; }
    vector<bool> eh(R - L + 1, true);
    for (ll p : base) for (ll j = max(p * p, (L + p - 1) / p * p); j <= R; j += p) eh[j - L] = false;
    if (L <= 1) for (ll x = L; x <= min(R, 1LL); x++) eh[x - L] = false;   // 0 e 1 não são primos
    vector<ll> r;
    for (ll x = L; x <= R; x++) if (eh[x - L]) r.push_back(x);
    return r;
}

int main() {
    ll L, R; cin >> L >> R;
    auto p = primos_intervalo(L, R);
    cout << p.size() << '\n';
    for (size_t i = 0; i < p.size(); i++) cout << p[i] << " \n"[i + 1 == p.size()];
}
```

Exemplo testado — entrada:

```text
999999999990 1000000000100
```

saída:

```text
4
1000000000039 1000000000061 1000000000063 1000000000091
```
