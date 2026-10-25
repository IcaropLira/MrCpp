---
title: Hashing de strings
summary: Hash polinomial de substrings (módulo 2^61 − 1).
status: done
complexity: O(n) + O(1)
tags: strings, hashing
---

## Ideia

O hash de um prefixo permite obter o de qualquer substring. O módulo `2^61 − 1` com base aleatória é seguro contra anti-hash.

## Código

```cpp
struct Hash {
    static constexpr ll M = (1LL << 61) - 1;
    vector<ll> h, p; ll B;
    static ll mul(ll a, ll b) { __int128 x = (__int128)a * b; ll r = (x & M) + (ll)(x >> 61); return r >= M ? r - M : r; }
    Hash(const string& s) : h(s.size() + 1), p(s.size() + 1, 1) {
        mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
        B = rng() % (M - 1000) + 500;
        for (size_t i = 0; i < s.size(); i++) h[i+1] = (mul(h[i], B) + s[i]) % M, p[i+1] = mul(p[i], B);
    }
    ll get(int l, int r) { return (h[r + 1] - mul(h[l], p[r - l + 1]) + M) % M; } // [l, r]
};
```
