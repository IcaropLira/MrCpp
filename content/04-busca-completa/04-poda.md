---
title: Poda
summary: Corta ramos da busca que não podem melhorar a resposta; exemplo: contar subconjuntos com soma alvo.
status: done
complexity: Depende da instância; O(2^n) no pior caso
tags: busca completa, poda, branch and bound
---

## Ideia

Poda é abandonar um ramo cedo, quando se sabe que ele não leva a uma solução (ou a uma melhor). No exemplo, os valores são ordenados e guarda-se a soma dos que restam: se a soma atual ultrapassa o alvo, ou se mesmo pegando todos os restantes não se alcança o alvo, o ramo é descartado.

## Código

```cpp
// quantos subconjuntos (por posição) de a somam exatamente alvo; a[i] >= 0
ll contar_subconjuntos(vector<ll> a, ll alvo) {
    sort(a.rbegin(), a.rend());
    int n = a.size();
    vector<ll> resto(n + 1, 0);  // resto[i] = a[i] + ... + a[n-1]
    for (int i = n - 1; i >= 0; i--) resto[i] = resto[i + 1] + a[i];
    ll cnt = 0;
    function<void(int, ll)> go = [&](int i, ll soma) {
        if (soma > alvo || soma + resto[i] < alvo) return;  // podas
        if (i == n) { cnt++; return; }
        go(i + 1, soma + a[i]);
        go(i + 1, soma);
    };
    go(0, 0);
    return cnt;
}
```

## Complexidade e cuidados

- As podas só são válidas porque os valores são não negativos; com negativos, `soma > alvo` não implica falha.
- Ordenar do maior para o menor faz a poda por excesso disparar mais cedo.
- Poda não muda o pior caso teórico, mas muda muito o tempo prático. Meça o número de nós visitados.
- Em otimização (branch and bound) pode-se podar quando um limite otimista já não supera a melhor resposta encontrada.
