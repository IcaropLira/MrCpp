---
title: Suffix Array e LCP
summary: Ordena todos os sufixos e calcula o tamanho dos prefixos comuns adjacentes.
status: done
complexity: O(n log n) com counting sort por classes
tags: strings, suffix array, lcp
---

## Quando usar

Ordenar sufixos, comparar substrings, encontrar repetições e resolver consultas de padrão com busca binária.

## Código

~~~cpp
vector<int> suffix_array(const string& s) {
    int n = s.size(), N = n + 1;
    vector<int> a(N), p(N), c(N);

    for (int i = 0; i < n; i++) a[i] = (unsigned char)s[i] + 1;
    a[n] = 0; // sentinela menor que qualquer byte

    vector<int> cnt(max(N, 258), 0);
    for (int x : a) cnt[x]++;
    for (int i = 1; i < (int)cnt.size(); i++) cnt[i] += cnt[i-1];
    for (int i = N-1; i >= 0; i--) p[--cnt[a[i]]] = i;

    int classes = 1;
    c[p[0]] = 0;
    for (int i = 1; i < N; i++) {
        if (a[p[i]] != a[p[i-1]]) classes++;
        c[p[i]] = classes - 1;
    }

    vector<int> pn(N), cn(N);
    for (int k = 1; k < N; k <<= 1) {
        for (int i = 0; i < N; i++) {
            pn[i] = p[i] - k;
            if (pn[i] < 0) pn[i] += N;
        }

        fill(cnt.begin(), cnt.begin() + classes, 0);
        for (int x : pn) cnt[c[x]]++;
        for (int i = 1; i < classes; i++) cnt[i] += cnt[i-1];
        for (int i = N-1; i >= 0; i--)
            p[--cnt[c[pn[i]]]] = pn[i];

        cn[p[0]] = 0;
        int newClasses = 1;
        for (int i = 1; i < N; i++) {
            pair<int,int> cur = {c[p[i]], c[(p[i]+k)%N]};
            pair<int,int> prv = {c[p[i-1]], c[(p[i-1]+k)%N]};
            if (cur != prv) newClasses++;
            cn[p[i]] = newClasses - 1;
        }
        c.swap(cn);
        classes = newClasses;
        if (classes == N) break;
    }

    p.erase(p.begin()); // remove o sufixo da sentinela
    return p;
}

vector<int> lcp_array(const string& s, const vector<int>& sa) {
    int n = s.size(), k = 0;
    vector<int> rank(n), lcp(n);
    for (int i = 0; i < n; i++) rank[sa[i]] = i;

    for (int i = 0; i < n; i++) {
        int r = rank[i];
        if (r == 0) continue;
        int j = sa[r-1];
        while (i+k < n && j+k < n && s[i+k] == s[j+k]) k++;
        lcp[r] = k;
        if (k) k--;
    }
    return lcp; // lcp[i] = LCP(sa[i], sa[i-1]); lcp[0] = 0
}
~~~

## Cuidados

- A sentinela é removida do resultado; o sufixo vazio não aparece no SA final.
- LCP usa a convenção com o vizinho anterior na ordem do SA.
- A complexidade do SA é O(n log n) com counting sort das classes; LCP é O(n).
- A implementação trabalha com bytes. Para alfabetos Unicode, comprima code points primeiro.
