---
title: Tarefas e prazos
summary: Tarefas de duração 1 com prazo e lucro: maximize o lucro com heap de mínimo.
status: done
complexity: O(n log n)
tags: guloso, prazos, heap
---

## Ideia

Cada tarefa dura uma unidade de tempo, tem um prazo `d` (deve terminar no tempo `d` ou antes, com tempos `1, 2, ...`) e um lucro. Processe as tarefas por prazo crescente, mantendo um min-heap com os lucros escolhidos. Ao inserir, se o heap passar do prazo atual (`tamanho > d`), remova o menor lucro. No fim o heap guarda o melhor conjunto viável.

## Código

```cpp
// tarefas {prazo, lucro}; devolve o lucro máximo
ll tarefas_e_prazos(vector<pair<int, ll>> t) {
    sort(t.begin(), t.end());  // por prazo crescente
    priority_queue<ll, vector<ll>, greater<>> pq;
    for (auto [d, p] : t) {
        pq.push(p);
        if ((int)pq.size() > d) pq.pop();  // não cabe: descarta o menor lucro
    }
    ll total = 0;
    while (!pq.empty()) total += pq.top(), pq.pop();
    return total;
}
```

## Complexidade e cuidados

- Um conjunto de tarefas é viável se, ordenado por prazo, a i-ésima tem prazo `>= i`; o heap mantém essa invariante.
- Alternativa equivalente: ordene por lucro decrescente e ocupe o último horário livre `<= d` com DSU.
- Prazos maiores que `n` podem ser truncados para `n`.
- Com durações diferentes o problema vira NP-difícil (mochila); este guloso exige duração 1.
