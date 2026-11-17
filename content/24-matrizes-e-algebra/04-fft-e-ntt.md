---
title: FFT e NTT
summary: Multiplicação de polinômios em O(n log n): FFT com complexos (arredondada) e NTT módulo 998244353 (exata).
status: done
complexity: O(n log n)
tags: polinômios, fft, ntt, convolução
---

## Ideia

A convolução `c_k = sum a_i b_{k-i}` é o produto de polinômios. A FFT avalia os polinômios nas raízes da unidade, multiplica ponto a ponto e interpola. Com números complexos a resposta é arredondada (cuidado com precisão: valores finais até cerca de `1e14`); a NTT usa raízes da unidade módulo `998244353 = 119 · 2^23 + 1` e é exata módulo esse primo.

## Código

```cpp
using cd = complex<double>;

void fft(vector<cd>& a, bool inv) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        double ang = 2 * acos(-1.0) / len * (inv ? -1 : 1);
        cd wl(cos(ang), sin(ang));
        for (int i = 0; i < n; i += len) {
            cd w(1);
            for (int j = 0; j < len / 2; j++, w *= wl) {
                cd u = a[i + j], v = a[i + j + len / 2] * w;
                a[i + j] = u + v;
                a[i + j + len / 2] = u - v;
            }
        }
    }
    if (inv) for (auto& x : a) x /= n;
}

// produto exato de polinômios com coeficientes inteiros (|resultado| até ~1e14)
vector<ll> multiplica_fft(const vector<ll>& a, const vector<ll>& b) {
    if (a.empty() || b.empty()) return {};
    int n = 1;
    while (n < (int)(a.size() + b.size() - 1)) n <<= 1;
    vector<cd> fa(a.begin(), a.end()), fb(b.begin(), b.end());
    fa.resize(n); fb.resize(n);
    fft(fa, false); fft(fb, false);
    for (int i = 0; i < n; i++) fa[i] *= fb[i];
    fft(fa, true);
    vector<ll> r(a.size() + b.size() - 1);
    for (size_t i = 0; i < r.size(); i++) r[i] = llround(fa[i].real());
    return r;
}

const ll MOD = 998244353, G = 3;
ll pw(ll a, ll e) {
    ll r = 1;
    for (a %= MOD; e; e >>= 1, a = a * a % MOD) if (e & 1) r = r * a % MOD;
    return r;
}

void ntt(vector<ll>& a, bool inv) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        ll wl = pw(G, (MOD - 1) / len);
        if (inv) wl = pw(wl, MOD - 2);
        for (int i = 0; i < n; i += len) {
            ll w = 1;
            for (int j = 0; j < len / 2; j++, w = w * wl % MOD) {
                ll u = a[i + j], v = a[i + j + len / 2] * w % MOD;
                a[i + j] = (u + v) % MOD;
                a[i + j + len / 2] = (u - v + MOD) % MOD;
            }
        }
    }
    if (inv) {
        ll ni = pw(n, MOD - 2);
        for (auto& x : a) x = x * ni % MOD;
    }
}

// produto módulo 998244353 (tamanho do resultado até 2^23)
vector<ll> multiplica_ntt(vector<ll> a, vector<ll> b) {
    if (a.empty() || b.empty()) return {};
    int need = a.size() + b.size() - 1, n = 1;
    while (n < need) n <<= 1;
    for (auto& x : a) x = ((x % MOD) + MOD) % MOD;
    for (auto& x : b) x = ((x % MOD) + MOD) % MOD;
    a.resize(n); b.resize(n);
    ntt(a, false); ntt(b, false);
    for (int i = 0; i < n; i++) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    a.resize(need);
    return a;
}
```

## Complexidade e cuidados

- Na FFT o erro cresce com `n` e com o tamanho dos coeficientes: se o resultado passa de `1e14`, divida os coeficientes em pedaços (por exemplo 15 bits) ou use NTT com vários módulos.
- A NTT só funciona para tamanhos até `2^23`; para outros módulos primos ache a raiz primitiva e confira que `2^k` divide `MOD - 1`.
- Para multiplicar números grandes, trate os dígitos como coeficientes e propague o vai-um depois.
- Há versões mais rápidas (pré-calcular raízes, FFT de tamanho real); esta é a mais curta e legível.
