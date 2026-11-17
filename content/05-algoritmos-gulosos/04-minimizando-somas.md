---
title: Minimizando somas
summary: Três clássicos: mediana minimiza soma de distâncias, tempo médio de espera e produto escalar mínimo.
status: done
complexity: O(n log n)
tags: guloso, ordenação, mediana
---

## Ideia

Três resultados que aparecem o tempo todo. (1) `sum |a_i - x|` é mínima quando `x` é a mediana. (2) Para minimizar a soma dos instantes de término de tarefas em uma máquina, execute as mais curtas primeiro. (3) Pela desigualdade do rearranjo, a soma `sum a_i * b_{p(i)}` é mínima quando se pareia o maior com o menor (um vetor crescente, o outro decrescente).

## Código

```cpp
// (1) min sobre x de sum |a[i] - x|
ll min_soma_abs(vector<ll> a) {
    sort(a.begin(), a.end());
    ll m = a[a.size() / 2], s = 0;
    for (ll v : a) s += llabs(v - m);
    return s;
}

// (2) soma dos instantes de término com a ordem ótima (menor primeiro)
ll min_soma_termino(vector<ll> t) {
    sort(t.begin(), t.end());
    ll agora = 0, s = 0;
    for (ll d : t) agora += d, s += agora;
    return s;
}

// (3) min sobre permutações p de sum a[i] * b[p[i]]
ll min_produto_escalar(vector<ll> a, vector<ll> b) {
    sort(a.begin(), a.end());
    sort(b.rbegin(), b.rend());
    ll s = 0;
    for (size_t i = 0; i < a.size(); i++) s += a[i] * b[i];
    return s;
}
```

## Complexidade e cuidados

- Em (1), qualquer valor entre as duas medianas (tamanho par) dá o mesmo mínimo; o código usa a mediana superior.
- Com pesos `w_i` em (2), ordene por `t_i / w_i` crescente.
- Cuidado com overflow em (3): produtos e somas pedem `long long`.
- Para minimizar `sum (a_i - x)^2` o ótimo é a média, não a mediana.
