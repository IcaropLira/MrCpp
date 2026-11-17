---
title: Escalonamento de tarefas
summary: Máximo de intervalos disjuntos: ordene pelo fim e pegue sempre que couber.
status: done
complexity: O(n log n)
tags: guloso, intervalos, escalonamento
---

## Ideia

Entre os intervalos que ainda cabem, o que termina primeiro deixa mais espaço para os demais: trocar a escolha de qualquer solução ótima pelo de menor fim nunca a piora. Ordene por fim e leve cada intervalo cujo início não é menor que o fim do último levado. Ordenar por início ou por duração *não* funciona.

## Código

```cpp
// intervalos [l, r) com l < r (semiabertos: um pode começar onde o outro termina)
// devolve o máximo de disjuntos
int max_intervalos(vector<pair<int, int>> v) {  // {l, r}
    sort(v.begin(), v.end(), [](auto& a, auto& b) { return a.second < b.second; });
    int cnt = 0, fim = INT_MIN;
    for (auto [l, r] : v)
        if (l >= fim) cnt++, fim = r;
    return cnt;
}
```

## Complexidade e cuidados

- Se os intervalos forem fechados `[l, r]`, troque a condição para `l > fim`.
- Para reconstruir a resposta, guarde os índices escolhidos.
- Versão ponderada (cada intervalo tem um peso) não é gulosa: use DP com busca binária.
- Exige `l < r`: com intervalos de comprimento zero o resultado depende da ordem dos empates no fim (por exemplo `[1,3)` e `[3,3)`), então descarte-os antes ou desempate por início.
