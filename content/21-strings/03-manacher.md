---
title: Manacher
summary: Calcula os maiores palíndromos centrados em cada posição.
status: done
complexity: O(n)
tags: strings, palindromo, manacher
---

## Quando usar

Responder consultas sobre palíndromos ou encontrar o maior substring palindrômico em tempo linear.

## Código

~~~cpp
pair<int,int> longest_palindrome(const string& s) {
    int n = s.size();
    vector<int> d1(n), d2(n);
    int bestL = 0, bestLen = 0;

    // d1[i]: raio do palíndromo ímpar centrado em i.
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = (i > r ? 1 : min(d1[l+r-i], r-i+1));
        while (i-k >= 0 && i+k < n && s[i-k] == s[i+k]) k++;
        d1[i] = k;
        int len = 2*k-1, start = i-k+1;
        if (len > bestLen) bestLen = len, bestL = start;
        if (i+k-1 > r) l = i-k+1, r = i+k-1;
    }

    // d2[i]: raio do palíndromo par centrado entre i-1 e i.
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = (i > r ? 0 : min(d2[l+r-i+1], r-i+1));
        while (i-k-1 >= 0 && i+k < n && s[i-k-1] == s[i+k]) k++;
        d2[i] = k;
        int len = 2*k, start = i-k;
        if (len > bestLen) bestLen = len, bestL = start;
        if (i+k-1 > r) l = i-k, r = i+k-1;
    }

    return {bestL, bestLen}; // substring s[bestL .. bestL+bestLen)
}
~~~

## Cuidados

- A resposta é um intervalo semiaberto [início, início + tamanho).
- d1 trata comprimentos ímpares; d2 trata comprimentos pares.
- Comparação é por char/byte; para Unicode, adapte a representação.
