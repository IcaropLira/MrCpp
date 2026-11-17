---
title: Manacher
summary: Raio de todos os palíndromos centrados em cada posição em O(n).
status: done
complexity: O(n)
tags: strings, palíndromos, manacher
---

## Ideia

Para cada centro, `d1[i]` é o número de palíndromos de tamanho ímpar centrados em `i` (raio contando o próprio centro) e `d2[i]` o de tamanho par centrados entre `i-1` e `i`. A ideia é reaproveitar o palíndromo mais à direita já encontrado `[l, r]`: dentro dele, o valor em `i` é pelo menos o do espelho `l + r - i`, limitado por `r - i + 1`, e só depois se tenta estender comparando caracteres.

## Código

```cpp
// d1[i]: nº de palíndromos ímpares centrados em i; d2[i]: nº de palíndromos pares centrados entre i-1 e i
void manacher(const string& s, vector<int>& d1, vector<int>& d2) {
    int n = s.size();
    d1.assign(n, 0); d2.assign(n, 0);
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = (i > r) ? 1 : min(d1[l + r - i], r - i + 1);
        while (i - k >= 0 && i + k < n && s[i - k] == s[i + k]) k++;
        d1[i] = k--;
        if (i + k > r) l = i - k, r = i + k;
    }
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = (i > r) ? 0 : min(d2[l + r - i + 1], r - i + 1);
        while (i - k - 1 >= 0 && i + k < n && s[i - k - 1] == s[i + k]) k++;
        d2[i] = k--;
        if (i + k > r) l = i - k - 1, r = i + k;
    }
}

// maior palíndromo: {início, tamanho}
pair<int, int> maior_palindromo(const string& s) {
    vector<int> d1, d2;
    manacher(s, d1, d2);
    pair<int, int> best = {0, 0};
    for (int i = 0; i < (int)s.size(); i++) {
        if (2 * d1[i] - 1 > best.second) best = {i - d1[i] + 1, 2 * d1[i] - 1};
        if (2 * d2[i] > best.second) best = {i - d2[i], 2 * d2[i]};
    }
    return best;
}
```

## Complexidade e cuidados

- O total de substrings palindrômicas (por posição) é `sum d1 + sum d2`.
- A cada palíndromo ímpar centrado em `i` com raio `d1[i]`, ele cobre `[i - d1[i] + 1, i + d1[i] - 1]`.
- Substrings palindrômicas *distintas* usam a árvore de palíndromos (eertree).
- Strings vazias devolvem `{0, 0}`.
