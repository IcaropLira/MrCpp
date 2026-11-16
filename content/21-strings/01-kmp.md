---
title: KMP — prefix function
summary: Busca ocorrências de um padrão em texto em tempo linear.
status: done
complexity: O(n + m)
tags: strings, kmp, prefix function
---

## Quando usar

Buscar todas as ocorrências de um padrão em um texto sem retroceder no texto, inclusive quando há muitas sobreposições.

## Código

~~~cpp
vector<int> prefix_function(const string& s) {
    int n = s.size();
    vector<int> pi(n);
    for (int i = 1; i < n; i++) {
        int j = pi[i-1];
        while (j > 0 && s[i] != s[j]) j = pi[j-1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }
    return pi;
}

vector<int> kmp(const string& text, const string& pat) {
    vector<int> ans;
    if (pat.empty()) {
        for (int i = 0; i <= (int)text.size(); i++) ans.push_back(i);
        return ans;
    }

    vector<int> pi = prefix_function(pat);
    int j = 0;
    for (int i = 0; i < (int)text.size(); i++) {
        while (j > 0 && text[i] != pat[j]) j = pi[j-1];
        if (text[i] == pat[j]) j++;
        if (j == (int)pat.size()) {
            ans.push_back(i - j + 1);
            j = pi[j-1];
        }
    }
    return ans;
}
~~~

## Cuidados

- Os índices retornados são posições iniciais, base 0.
- Após encontrar uma ocorrência, volte para pi[m-1] para permitir sobreposições.
- O código compara bytes de char; para Unicode, processe code points em vez de bytes.
