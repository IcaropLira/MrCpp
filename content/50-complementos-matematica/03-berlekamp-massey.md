---
title: Berlekamp-Massey e Kitamasa
summary: Descobre a menor recorrência linear de uma sequência mod p e calcula o n-ésimo termo com n até 1e18.
status: done
complexity: O(n²) + O(L² log n)
tags: berlekamp-massey, kitamasa, recorrência linear, matriz
---

## Quando usar

A resposta segue uma recorrência linear (DP com transição linear de estado pequeno, contagem em grafo fixo, caminhos em autômato) mas você não quer deduzi-la: gere ~`2L` termos por força bruta/DP, rode BM e depois Kitamasa para o termo `n`.

```cpp
// Berlekamp-Massey: dada a sequência (mod p primo), acha a menor recorrência linear
// a[i] = c1·a[i−1] + ... + cL·a[i−L].  Precisa de ~2L termos.  O(n²).
// Depois, o n-ésimo termo sai por exponenciação de matriz (O(L³ log n)) ou Kitamasa (O(L² log n)).
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll MOD = 1e9 + 7;
ll pw(ll b, ll e) { ll r = 1; b %= MOD; for (; e; e >>= 1, b = b * b % MOD) if (e & 1) r = r * b % MOD; return r; }

vector<ll> berlekamp_massey(const vector<ll> &s) {
    vector<ll> C = {1}, B = {1};
    int L = 0, m = 1; ll b = 1;
    for (size_t n = 0; n < s.size(); n++) {
        ll d = 0;
        for (int i = 0; i <= L; i++) d = (d + C[i] * s[n - i]) % MOD;
        if (d == 0) { m++; continue; }
        vector<ll> T = C; ll coef = d * pw(b, MOD - 2) % MOD;
        if (C.size() < B.size() + m) C.resize(B.size() + m, 0);
        for (size_t i = 0; i < B.size(); i++) C[i + m] = (C[i + m] - coef * B[i] % MOD + MOD) % MOD;
        if (2 * L <= (int)n) { L = n + 1 - L; B = T; b = d; m = 1; } else m++;
    }
    C.resize(L + 1);
    vector<ll> c(L);                       // a[i] = Σ c[j] a[i−1−j]
    for (int j = 0; j < L; j++) c[j] = (MOD - C[j + 1]) % MOD;
    return c;
}

ll kitamasa(const vector<ll> &c, const vector<ll> &a, ll n) {   // n-ésimo termo (0-indexado)
    int L = c.size(); if (n < (ll)a.size() && n < L) return a[n];
    auto mul = [&](const vector<ll> &x, const vector<ll> &y) {   // polinômios mod (x^L − Σ c x^{L−1−j})
        vector<ll> r(2 * L, 0);
        for (int i = 0; i < L; i++) for (int j = 0; j < L; j++) r[i + j] = (r[i + j] + x[i] * y[j]) % MOD;
        for (int i = 2 * L - 1; i >= L; i--) for (int j = 0; j < L; j++) r[i - 1 - j] = (r[i - 1 - j] + r[i] * c[j]) % MOD;
        r.resize(L); return r;
    };
    vector<ll> res(L, 0), base(L, 0); res[0] = 1;
    if (L == 1) base[0] = c[0]; else base[1] = 1;
    for (; n; n >>= 1, base = mul(base, base)) if (n & 1) res = mul(res, base);
    ll ans = 0; for (int i = 0; i < L; i++) ans = (ans + res[i] * a[i]) % MOD;
    return ans;
}

int main() {
    int k; ll n; cin >> k >> n;
    vector<ll> s(k); for (auto &x : s) cin >> x;
    auto c = berlekamp_massey(s);
    cout << c.size() << '\n';
    for (size_t i = 0; i < c.size(); i++) cout << c[i] << " \n"[i + 1 == c.size()];
    cout << kitamasa(c, s, n) << '\n';
}
```

Exemplo testado — entrada:

```text
10 100
0 1 1 2 3 5 8 13 21 34
```

saída:

```text
2
1 1
687995182
```

> Verificação: 300 recorrências aleatórias de ordem até 4, termo n até 60.
