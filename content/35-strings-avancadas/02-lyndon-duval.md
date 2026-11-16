---
title: Lyndon Factorization — Duval
summary: Decompõe uma string na sequência não crescente de palavras de Lyndon.
status: done
complexity: O(n)
tags: strings, lyndon, duval, fatorizacao
---

## Quando usar

Em problemas de fatorização lexicográfica, periodicidade, strings mínimas cíclicas e algoritmos avançados de strings.

## Definição

Uma palavra de Lyndon é estritamente menor, em ordem lexicográfica, que todos os seus sufixos não vazios próprios. O algoritmo de Duval decompõe qualquer string em palavras de Lyndon em ordem não crescente.

## Código

~~~cpp
vector<string> lyndon_factorization(const string& s) {
    int n = s.size(), i = 0;
    vector<string> ans;
    while (i < n) {
        int j = i + 1, k = i;
        while (j < n && s[k] <= s[j]) {
            if (s[k] < s[j]) k = i;
            else k++;
            j++;
        }
        int len = j - k;
        while (i <= k) {
            ans.push_back(s.substr(i, len));
            i += len;
        }
    }
    return ans;
}
~~~

## Cuidados

- A fatorização é única e as palavras aparecem em ordem lexicográfica não crescente.
- A função cria substrings; para evitar cópias, retorne pares [l,r).
- Comparação segue a ordem dos caracteres da string; para alfabeto customizado, adapte a comparação.
