---
title: Bubble sort
summary: Ordenação por trocas adjacentes; o número de trocas é o número de inversões.
status: done
complexity: O(n²)
tags: ordenação, bubble sort, inversões
---

## Ideia

A cada passada, o maior elemento restante "sobe" até o fim. Cada troca de vizinhos desfaz exatamente uma inversão, então o total de trocas é o número de pares `i < j` com `a[i] > a[j]`. Serve para entender inversões; em problemas reais use `sort` ou contagem de inversões em `O(n log n)`.

## Código

```cpp
// ordena a e devolve o número de trocas (= número de inversões)
ll bubble_sort(vector<int>& a) {
    ll trocas = 0;
    int n = a.size();
    for (int i = 0; i < n; i++) {
        bool trocou = false;
        for (int j = 0; j + 1 < n - i; j++)
            if (a[j] > a[j + 1]) swap(a[j], a[j + 1]), trocas++, trocou = true;
        if (!trocou) break;  // já ordenado
    }
    return trocas;
}
```

## Complexidade e cuidados

- Pior caso e caso médio `O(n²)`; já ordenado custa `O(n)` por causa da parada antecipada.
- É estável: elementos iguais nunca trocam de posição (a comparação é estrita).
- O retorno cabe em `long long`: até `n(n-1)/2` inversões.
