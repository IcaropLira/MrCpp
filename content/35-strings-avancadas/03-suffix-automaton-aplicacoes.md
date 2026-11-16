---
title: Suffix Automaton — aplicações
summary: Conta substrings distintas, maior substring comum e frequência de ocorrências usando o autômato.
status: done
complexity: O(n) estados e transições esperados com map; O(n sigma) com alfabeto fixo
tags: strings, suffix automaton, substring
---

## Substrings distintas

Cada estado v representa um conjunto de substrings com comprimentos entre len(link[v])+1 e len[v]. Portanto, a quantidade total de substrings distintas é:

~~~cpp
long long distinct_substrings(const vector<int>& len,
                              const vector<int>& link) {
    long long ans = 0;
    for (int v = 1; v < (int)len.size(); v++)
        ans += len[v] - len[link[v]];
    return ans;
}
~~~

## Maior substring comum entre duas strings

Construa o autômato para a primeira string. Percorra a segunda mantendo o estado e o comprimento do maior sufixo que é substring da primeira.

~~~cpp
pair<int,int> longest_common_substring(
    const string& b,
    const vector<array<int,26>>& next,
    const vector<int>& link,
    const vector<int>& len
) {
    int v = 0, l = 0, best = 0, end = -1;
    for (int i = 0; i < (int)b.size(); i++) {
        int c = b[i] - 'a';
        while (v && !next[v][c]) {
            v = link[v];
            l = len[v];
        }
        if (next[v][c]) v = next[v][c], l++;
        else v = 0, l = 0;
        if (l > best) best = l, end = i;
    }
    return {best, end - best + 1}; // tamanho e início em b; -1 se vazio
}
~~~

## Frequência de ocorrências

Ao construir o autômato, incremente occ[cur] = 1 para cada novo estado correspondente a uma posição final original; clones recebem 0. Processe estados em ordem decrescente de len e some occ[v] em occ[link[v]]. Depois, occ[v] é o número de ocorrências de qualquer substring representada pelo estado v.

## Cuidados

- A contagem de substrings distintas soma len[v]-len[link[v]] para todos os estados exceto a raiz.
- O maior substring comum pressupõe transições de alfabeto minúsculo e autômato construído para a primeira string.
- A rotina de frequência exige propagação em ordem decrescente de len.
- Clones não representam uma nova posição final e devem iniciar com frequência zero.
