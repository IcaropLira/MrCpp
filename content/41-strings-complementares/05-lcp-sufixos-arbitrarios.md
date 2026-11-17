---
title: LCP de sufixos arbitrários
summary: Responde o LCP de dois sufixos quaisquer em O(1) com SA, array LCP e sparse table, e compara substrings.
status: done
complexity: O(n log n) pré-processamento, O(1) por consulta
tags: strings, suffix array, lcp, sparse table, rmq
---

## Ideia

Com `rk[i]` a posição do sufixo `i` no SA, o LCP entre os sufixos `i` e `j` (com `rk[i] < rk[j]`) é o mínimo de `lcp[rk[i]+1 .. rk[j]]`, pois o LCP de sufixos não adjacentes é o mínimo dos vizinhos entre eles. Esse mínimo em intervalo sai de uma sparse table em O(1).

Com isso, comparar `s[a..a+la)` e `s[b..b+lb)` fica O(1): se o LCP cobre o menor dos dois, decide pelo tamanho; senão, pela ordem dos sufixos no SA.

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

struct LcpQuery {
    int n;
    vector<int> sa, rk, lg;
    vector<vector<int>> sp; // sp[j][i] = min de lcp[i .. i+2^j-1]

    LcpQuery(const string& s) : n(s.size()) {
        sa = build_sa(s);
        vector<int> lcp = build_lcp(s, sa);
        rk.assign(n, 0);
        for (int i = 0; i < n; i++) rk[sa[i]] = i;
        lg.assign(n + 2, 0);
        for (int i = 2; i <= n + 1; i++) lg[i] = lg[i / 2] + 1;
        sp.assign(lg[max(n, 1)] + 1, vector<int>(n));
        sp[0] = lcp;
        for (int j = 1; j < (int)sp.size(); j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                sp[j][i] = min(sp[j-1][i], sp[j-1][i + (1 << (j-1))]);
    }

    // LCP dos sufixos que começam em i e j
    int query(int i, int j) const {
        if (i == j) return n - i;
        int l = rk[i], r = rk[j];
        if (l > r) swap(l, r);
        l++; // mínimo de lcp[l..r]
        int k = lg[r - l + 1];
        return min(sp[k][l], sp[k][r - (1 << k) + 1]);
    }

    // compara s[a..a+la) com s[b..b+lb): -1, 0 ou 1
    int cmp(int a, int la, int b, int lb) const {
        int l = min({query(a, b), la, lb});
        if (l == la || l == lb) return la == lb ? 0 : (la < lb ? -1 : 1);
        return rk[a] < rk[b] ? -1 : 1;
    }
};
~~~

## Complexidade e cuidados

- Índices 0-based e válidos (`0 <= i, j < n`); para substring vazia no fim use um comprimento 0 com índice menor que `n`.
- `query(i, i)` devolve `n - i`.
- Memória O(n log n); para `n` grande use sparse table de `int` como acima, nunca `ll`.
- Alfabeto: bytes; `n = 0` não deve ser consultado.
- Aplicações: igualdade de substrings, ordenação de substrings, maior prefixo comum de dois cortes.
