---
title: Sequência de de Bruijn
summary: Sequência cíclica em que toda palavra de tamanho n sobre k símbolos aparece exatamente uma vez.
status: done
complexity: O(k^n)
tags: grafos, de bruijn, strings, euleriano
---

## Ideia

No grafo de de Bruijn os vértices são as palavras de tamanho `n-1` e cada palavra de tamanho `n` é uma aresta; um circuito euleriano passa por todas as palavras uma vez e dá a sequência. O algoritmo clássico gera o mesmo resultado concatenando as palavras de Lyndon cujo tamanho divide `n`, em ordem lexicográfica, sem montar o grafo.

## Código

```cpp
// sequência de de Bruijn B(k, n): tamanho k^n, símbolos 0..k-1, considerada circular
vector<int> de_bruijn(int k, int n) {
    vector<int> a(k * n + 1, 0), seq;  // índices 1..n
    function<void(int, int)> go = [&](int t, int p) {
        if (t > n) {
            if (n % p == 0) for (int i = 1; i <= p; i++) seq.push_back(a[i]);
        } else {
            a[t] = a[t - p];
            go(t + 1, p);
            for (int j = a[t - p] + 1; j < k; j++) a[t] = j, go(t + 1, t);
        }
    };
    go(1, 1);
    return seq;
}
```

## Complexidade e cuidados

- Para ver todas as palavras, percorra a sequência circularmente: use `seq[(i + j) % k^n]`.
- É o menor texto circular que contém todas as senhas de `n` dígitos (cadeado de `k` dígitos).
- `k^n` precisa caber na memória; por exemplo `k = 10, n = 5` dá 100000.
- Existem `(k!)^(k^(n-1)) / k^n` sequências diferentes; esta é a lexicograficamente menor.
