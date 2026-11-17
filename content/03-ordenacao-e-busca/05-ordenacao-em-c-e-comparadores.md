---
title: Ordenação em C++ e comparadores
summary: sort, stable_sort, comparadores personalizados, ordenação de índices e seleção parcial.
status: done
complexity: O(n log n)
tags: ordenação, stl, comparador
---

## Ideia

`sort` exige um comparador que seja uma ordem fraca estrita: `cmp(a, a)` deve ser `false` e, se `cmp(a, b)` é verdadeiro, `cmp(b, a)` é falso. Violar isso (por exemplo usando `<=`) causa comportamento indefinido e pode travar ou dar segfault. Para empates, defina um critério de desempate explícito ou use `stable_sort`.

## Código

```cpp
struct Item { string nome; int idade; };

// idade decrescente; empate: nome crescente
bool cmp(const Item& a, const Item& b) {
    if (a.idade != b.idade) return a.idade > b.idade;
    return a.nome < b.nome;
}

// índices que ordenam v (estável): v[id[0]] <= v[id[1]] <= ...
vector<int> argsort(const vector<ll>& v) {
    vector<int> id(v.size());
    iota(id.begin(), id.end(), 0);
    stable_sort(id.begin(), id.end(), [&](int i, int j) { return v[i] < v[j]; });
    return id;
}

// os k menores em ordem, sem ordenar o resto: O(n log k)
vector<int> k_menores(vector<int> a, int k) {
    k = min<int>(k, a.size());
    partial_sort(a.begin(), a.begin() + k, a.end());
    a.resize(k);
    return a;
}
```

## Complexidade e cuidados

- `nth_element(a.begin(), a.begin() + k, a.end())` coloca o k-ésimo menor na posição `k` em `O(n)` médio, sem ordenar o resto.
- Comparar `double` com `==` ou `<=` dentro do comparador quebra a ordem fraca estrita; compare com `<` e trate empates a parte.
- Para ordenar do maior para o menor: `sort(a.rbegin(), a.rend())` ou `greater<>()`.
- Evite copiar objetos grandes: receba `const T&` no comparador e ordene índices quando o elemento for pesado.
