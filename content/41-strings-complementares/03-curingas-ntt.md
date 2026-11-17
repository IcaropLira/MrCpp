---
title: Casamento com curingas via NTT
summary: Encontra ocorrências de um padrão com curingas em um texto usando três convoluções módulo 998244353.
status: done
complexity: O((n + m) log(n + m))
tags: strings, curingas, ntt, convolução
---

## Ideia

Atribuímos a cada caractere um valor aleatório não nulo e ao curinga o valor 0. Para o alinhamento `i`, a soma

`S(i) = sum_j p_j * t_(i+j) * (p_j - t_(i+j))^2`

é zero quando todos os pares casam (um par com curinga zera o fator, e pares iguais zeram o quadrado). Expandindo, `S = sum p^3 t - 2 sum p^2 t^2 + sum p t^3`, cada parcela é uma convolução (com o padrão invertido). Como os valores são aleatórios, uma soma nula por acaso de um alinhamento errado ocorre com probabilidade desprezível (cerca de `1/998244353` por alinhamento); a função aceita curinga também no texto.

## Código

~~~cpp
const ll MOD = 998244353;

ll pw(ll b, ll e) {
    ll r = 1; b %= MOD;
    for (; e; e >>= 1, b = b * b % MOD) if (e & 1) r = r * b % MOD;
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
        ll w = pw(3, (MOD - 1) / len);
        if (inv) w = pw(w, MOD - 2);
        for (int i = 0; i < n; i += len) {
            ll x = 1;
            for (int j = 0; j < len / 2; j++, x = x * w % MOD) {
                ll u = a[i + j], v = a[i + j + len / 2] * x % MOD;
                a[i + j] = (u + v) % MOD;
                a[i + j + len / 2] = (u - v + MOD) % MOD;
            }
        }
    }
    if (inv) {
        ll ni = pw(n, MOD - 2);
        for (ll& x : a) x = x * ni % MOD;
    }
}

vector<ll> conv(vector<ll> a, vector<ll> b) {
    int need = a.size() + b.size() - 1, n = 1;
    while (n < need) n <<= 1;
    a.resize(n); b.resize(n);
    ntt(a, false); ntt(b, false);
    for (int i = 0; i < n; i++) a[i] = a[i] * b[i] % MOD;
    ntt(a, true);
    a.resize(need);
    return a;
}

// posições i (0-index) em que p casa com t[i..i+|p|-1]; '?' em qualquer lado casa com tudo
vector<int> wildcard_match(const string& t, const string& p, char wild = '?') {
    int n = t.size(), m = p.size();
    vector<int> res;
    if (m > n) return res;
    static mt19937_64 rng(712367);
    ll val[256] = {};
    for (int c = 0; c < 256; c++) val[c] = rng() % (MOD - 1) + 1;
    val[(unsigned char)wild] = 0;
    vector<ll> T(n), P(m), T2(n), P2(m), T3(n), P3(m);
    for (int i = 0; i < n; i++) {
        ll x = val[(unsigned char)t[i]];
        T[i] = x; T2[i] = x * x % MOD; T3[i] = T2[i] * x % MOD;
    }
    for (int i = 0; i < m; i++) { // padrão invertido para virar convolução
        ll x = val[(unsigned char)p[m - 1 - i]];
        P[i] = x; P2[i] = x * x % MOD; P3[i] = P2[i] * x % MOD;
    }
    // soma_j p^3 t - 2 p^2 t^2 + p t^3 = soma_j p t (p - t)^2
    vector<ll> A = conv(T, P3), B = conv(T2, P2), C = conv(T3, P);
    for (int i = 0; i + m <= n; i++) {
        int k = i + m - 1;
        ll s = (A[k] - 2 * B[k] % MOD + C[k] + 2 * MOD) % MOD;
        if (s == 0) res.push_back(i);
    }
    return res;
}
~~~

## Complexidade e cuidados

- O resultado é probabilístico (erro apenas de falso positivo, por colisão módulo p). Para reduzir, repita com outra semente.
- Alfabeto: bytes; o curinga padrão é `'?'` e não deve ser um caractere comum do texto.
- Posições 0-based do início da ocorrência; padrão maior que o texto devolve vazio.
- O tamanho da NTT é a menor potência de 2 maior ou igual a `n + m - 1`, abaixo de 2^23, o limite do módulo 998244353.
- Os valores aleatórios dependem da semente fixa; troque por `chrono` se houver risco de hack.
