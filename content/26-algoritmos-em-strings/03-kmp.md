---
title: Algoritmo KMP
summary: Função de prefixo e busca de padrão.
status: done
complexity: O(n + m)
tags: strings, kmp
---

## Ideia

`pi[i]` é o tamanho da maior borda de `s[0..i]`. Concatenar `p + "#" + t` encontra todas as ocorrências.

## Código

```cpp
vector<int> prefix(const string& s) {
    vector<int> pi(s.size());
    for (size_t i = 1; i < s.size(); i++) {
        int k = pi[i - 1];
        while (k && s[i] != s[k]) k = pi[k - 1];
        pi[i] = k + (s[i] == s[k]);
    }
    return pi;
}
```

## Uso

Ocorrências de `p` em `t`: calcule `prefix(p + "#" + t)` e procure posições com valor `|p|`.
