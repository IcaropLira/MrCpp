---
title: Z-function
summary: Calcula o maior prefixo que também começa em cada posição.
status: done
complexity: O(n)
tags: strings, z function
---

## Ideia

z[i] é o tamanho do maior prefixo de s que coincide com uma substring começando em i. Mantemos a janela [l,r) mais à direita que já coincide com o prefixo.

## Código

~~~cpp
vector<int> z_function(const string& s) {
    int n = s.size();
    vector<int> z(n);
    int l = 0, r = 0;

    for (int i = 1; i < n; i++) {
        if (i < r) z[i] = min(r - i, z[i-l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]])
            z[i]++;
        if (i + z[i] > r) {
            l = i;
            r = i + z[i];
        }
    }
    if (n) z[0] = n;
    return z;
}
~~~

## Busca de padrão

Para procurar pat no texto, calcule Z sobre pat + '#' + texto, usando um separador que não apareça nas strings. Cada posição com z[i] >= |pat| é uma ocorrência.

## Cuidados

- Complexidade O(n) amortizada.
- z[0] costuma ser definido como n, embora algumas referências usem 0.
- Escolha um separador que não exista no alfabeto de entrada.
