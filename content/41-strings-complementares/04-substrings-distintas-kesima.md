---
title: Substrings distintas e k-ésima substring
summary: Conta substrings distintas e encontra a k-ésima em ordem lexicográfica usando suffix array e LCP.
status: done
complexity: O(n log^2 n) com o SA do snippet; O(n) após SA e LCP
tags: strings, suffix array, lcp, substrings distintas
---

## Ideia

Percorrendo os sufixos em ordem do SA, o sufixo `sa[i]` traz `n - sa[i] - lcp[i]` prefixos novos: os de tamanho maior que `lcp[i]`, pois os demais já apareceram no sufixo anterior. Logo o número de substrings distintas é `n(n+1)/2 - sum lcp[i]`.

Além disso, as substrings distintas em ordem lexicográfica aparecem agrupadas nessa varredura: primeiro os prefixos novos de `sa[0]` (do menor para o maior), depois os de `sa[1]` e assim por diante. Para a k-ésima, subtraímos o tamanho de cada grupo até `k` cair em um deles.

## Código

~~~cpp
// SA por duplicação de prefixos, O(n log^2 n); substitua pelo da seção de Suffix Array se precisar de mais velocidade
vector<int> build_sa(const string& s) {
    int n = s.size();
    vector<int> sa(n), rk(n), tmp(n);
    if (n == 0) return sa;
    for (int i = 0; i < n; i++) sa[i] = i, rk[i] = (unsigned char)s[i];
    for (int k = 1; ; k <<= 1) {
        auto key = [&](int i) { return pair<int,int>(rk[i], i + k < n ? rk[i + k] : -1); };
        sort(sa.begin(), sa.end(), [&](int a, int b) { return key(a) < key(b); });
        tmp[sa[0]] = 0;
        for (int i = 1; i < n; i++) tmp[sa[i]] = tmp[sa[i-1]] + (key(sa[i-1]) < key(sa[i]));
        rk = tmp;
        if (rk[sa[n-1]] == n - 1) break;
    }
    return sa;
}

// lcp[i] = LCP(sa[i-1], sa[i]); lcp[0] = 0 (Kasai)
vector<int> build_lcp(const string& s, const vector<int>& sa) {
    int n = s.size(), k = 0;
    vector<int> rk(n), lcp(n, 0);
    for (int i = 0; i < n; i++) rk[sa[i]] = i;
    for (int i = 0; i < n; i++) {
        if (rk[i] == 0) { k = 0; continue; }
        int j = sa[rk[i] - 1];
        while (i + k < n && j + k < n && s[i + k] == s[j + k]) k++;
        lcp[rk[i]] = k;
        if (k) k--;
    }
    return lcp;
}

ll count_distinct(const string& s) {
    int n = s.size();
    vector<int> sa = build_sa(s), lcp = build_lcp(s, sa);
    ll tot = (ll)n * (n + 1) / 2;
    for (int x : lcp) tot -= x;
    return tot;
}

// k-ésima (1-indexada) substring distinta em ordem lexicográfica; "" se k é grande demais
string kth_substring(const string& s, ll k) {
    int n = s.size();
    vector<int> sa = build_sa(s), lcp = build_lcp(s, sa);
    for (int i = 0; i < n; i++) {
        ll novas = n - sa[i] - lcp[i]; // prefixos de sa[i] com tamanho > lcp[i]
        if (k <= novas) return s.substr(sa[i], lcp[i] + k);
        k -= novas;
    }
    return "";
}
~~~

## Complexidade e cuidados

- Alfabeto: bytes. O SA do snippet compara `rk` por pares; a seção de Suffix Array traz a versão O(n log n).
- `k` é 1-indexado; se `k` excede o total, devolve string vazia. Use `ll`: o total chega a ~n^2/2.
- Aqui "distintas" é sem a substring vazia.
- `lcp[i]` é o LCP com o vizinho anterior no SA; `lcp[0] = 0`.
- `s` vazia devolve 0 e `""`.
