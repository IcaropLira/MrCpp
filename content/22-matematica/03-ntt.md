---
title: NTT — convolução modular
summary: Multiplica polinômios em O(n log n) usando transformada numérica.
status: done
complexity: O(n log n)
tags: matematica, ntt, convolucao
---

## Quando usar

Multiplicar polinômios ou calcular convoluções quando os coeficientes são módulo 998244353.

## Código

~~~cpp
const int MOD = 998244353;
const int ROOT = 3;

int modpow(int a, int e) {
    long long r = 1, x = a;
    while (e) {
        if (e & 1) r = r*x % MOD;
        x = x*x % MOD;
        e >>= 1;
    }
    return (int)r;
}

void ntt(vector<int>& a, bool invert) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) swap(a[i], a[j]);
    }

    for (int len = 2; len <= n; len <<= 1) {
        int wlen = modpow(ROOT, (MOD-1)/len);
        if (invert) wlen = modpow(wlen, MOD-2);

        for (int i = 0; i < n; i += len) {
            long long w = 1;
            for (int j = 0; j < len/2; j++) {
                int u = a[i+j];
                int v = w * a[i+j+len/2] % MOD;
                a[i+j] = u + v < MOD ? u+v : u+v-MOD;
                a[i+j+len/2] = u-v >= 0 ? u-v : u-v+MOD;
                w = w*wlen % MOD;
            }
        }
    }

    if (invert) {
        int invN = modpow(n, MOD-2);
        for (int& x : a) x = (long long)x * invN % MOD;
    }
}

vector<int> convolution(vector<int> a, vector<int> b) {
    if (a.empty() || b.empty()) return {};
    int need = a.size() + b.size() - 1;
    int n = 1;
    while (n < need) n <<= 1;
    a.resize(n); b.resize(n);
    ntt(a, false); ntt(b, false);
    for (int i = 0; i < n; i++) a[i] = (long long)a[i] * b[i] % MOD;
    ntt(a, true);
    a.resize(need);
    return a;
}
~~~

## Cuidados

- O tamanho da NTT deve ser potência de 2 e dividir MOD-1; para 998244353, o maior tamanho suportado é 2^23.
- Coeficientes devem ser normalizados para [0, MOD).
- Para inteiros exatos, NTT sob um único módulo pode não bastar; use múltiplos módulos e reconstrução CRT.
