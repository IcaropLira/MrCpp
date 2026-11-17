---
title: Suffix array
summary: Ordem lexicográfica de todos os sufixos em O(n log n) e vetor LCP de Kasai.
status: done
complexity: O(n log n)
tags: strings, suffix array, lcp, kasai
---

## Ideia

O suffix array `sa` lista os índices iniciais dos sufixos em ordem. A construção por duplicação ordena os sufixos pelos `2^h` primeiros caracteres; cada rodada ordena pares `(classe da metade esquerda, classe da metade direita)` com counting sort, dobrando `h`. O vetor LCP (maior prefixo comum entre sufixos vizinhos no `sa`) sai em `O(n)` pelo algoritmo de Kasai, que aproveita que `lcp` cai no máximo 1 ao avançar um sufixo.

## Código

```cpp
// ordena as rotações cíclicas de s (s deve terminar em um caractere único e menor que todos)
vector<int> sa_ciclico(const string& s) {
    int n = s.size();
    vector<int> p(n), c(n), cnt(max(256, n), 0);
    for (char ch : s) cnt[(unsigned char)ch]++;
    for (int i = 1; i < 256; i++) cnt[i] += cnt[i - 1];
    for (int i = n - 1; i >= 0; i--) p[--cnt[(unsigned char)s[i]]] = i;
    c[p[0]] = 0;
    int classes = 1;
    for (int i = 1; i < n; i++) {
        if (s[p[i]] != s[p[i - 1]]) classes++;
        c[p[i]] = classes - 1;
    }
    vector<int> pn(n), cn(n);
    for (int h = 0; (1 << h) < n; h++) {
        for (int i = 0; i < n; i++) {
            pn[i] = p[i] - (1 << h);
            if (pn[i] < 0) pn[i] += n;
        }
        fill(cnt.begin(), cnt.begin() + classes, 0);
        for (int i = 0; i < n; i++) cnt[c[pn[i]]]++;
        for (int i = 1; i < classes; i++) cnt[i] += cnt[i - 1];
        for (int i = n - 1; i >= 0; i--) p[--cnt[c[pn[i]]]] = pn[i];
        cn[p[0]] = 0;
        classes = 1;
        for (int i = 1; i < n; i++) {
            pair<int, int> cur = {c[p[i]], c[(p[i] + (1 << h)) % n]};
            pair<int, int> prev = {c[p[i - 1]], c[(p[i - 1] + (1 << h)) % n]};
            if (cur != prev) classes++;
            cn[p[i]] = classes - 1;
        }
        c.swap(cn);
    }
    return p;
}

// suffix array de s (caracteres diferentes de '\0')
vector<int> suffix_array(string s) {
    s.push_back('\0');
    vector<int> p = sa_ciclico(s);
    p.erase(p.begin());  // o sentinela vem primeiro
    return p;
}

// lcp[i] = lcp(sufixo sa[i], sufixo sa[i+1]); tamanho n-1
vector<int> lcp_kasai(const string& s, const vector<int>& sa) {
    int n = s.size();
    vector<int> rank(n), lcp(max(0, n - 1), 0);
    for (int i = 0; i < n; i++) rank[sa[i]] = i;
    for (int i = 0, k = 0; i < n; i++) {
        if (rank[i] == n - 1) { k = 0; continue; }
        int j = sa[rank[i] + 1];
        while (i + k < n && j + k < n && s[i + k] == s[j + k]) k++;
        lcp[rank[i]] = k;
        if (k) k--;
    }
    return lcp;
}
```

## Complexidade e cuidados

- O sentinela `'\0'` precisa ser menor que todo caractere de `s`; strings com `'\0'` no meio quebram a construção.
- Número de substrings distintas: `n(n+1)/2 - sum lcp`.
- Para o menor valor de LCP entre dois sufixos quaisquer, use sparse table sobre `lcp`.
- Há construção `O(n)` (SA-IS), mas `O(n log n)` com counting sort resolve `n = 1e6` com folga em competições.
