---
title: Busca binária, ternária e técnicas de varredura
summary: Busca binária na resposta (invariantes, reais), ternária, dois ponteiros, meet in the middle, offline, busca binária paralela e aleatorização.
status: done
complexity: O(log) iterações
tags: busca binária, ternária, dois ponteiros, meet in the middle, offline, aleatorizado, teoria
---

## Busca binária (inteiros) sem erro

Invariante: `ok(lo)` falso, `ok(hi)` verdadeiro (predicado monótono F…FV…V).
```cpp
long long lo = MIN - 1, hi = MAX;          // lo sempre falso, hi sempre verdadeiro
while (hi - lo > 1) { long long mid = lo + (hi - lo) / 2; (ok(mid) ? hi : lo) = mid; }
// hi = primeiro verdadeiro
```
- **Na resposta**: "dá para fazer com X?" monótono em X → busque o menor X. Ex.: maior mínimo, menor máximo, k-ésimo menor de uma matriz/soma de pares (conte quantos ≤ X).
- `lower_bound` = primeiro `≥ x`; `upper_bound` = primeiro `> x`; quantos iguais = diferença.
- Reais: 100 iterações (ou até `hi - lo < eps`); não use `while (lo < hi)` com double.
- Cuidado com overflow no `ok` (produtos) e em `lo + hi`.

## Busca ternária

Função **unimodal** (sobe e desce, estritamente): compare `f(m1)` e `f(m2)` e descarte um terço. Inteiros: pare quando `hi - lo < 3` e teste todos; ou busque binário no "sinal da derivada" `f(m) < f(m+1)`. Com patamares a ternária pode falhar. Funções convexas: soma de convexas é convexa (ex.: soma de |x − aᵢ| → mediana).

## Dois ponteiros

Quando, ao avançar `r`, o melhor `l` nunca volta (janela "boa" é monótona): subarray com soma ≤ S (valores ≥ 0), maior janela com ≤ k distintos, pares com soma x em vetor ordenado. O(n).

## Meet in the middle

n ≤ 40: divida em duas metades de 2^20, gere todas as somas de cada uma, ordene uma e para cada soma da outra use busca binária/dois ponteiros. Também em busca bidirecional (BFS dos dois lados).

## Offline e reordenação

- Ordenar consultas (por r, por valor, por bloco — Mo) e varrer com uma estrutura.
- **Busca binária paralela**: muitas consultas "primeiro momento em que algo acontece": faça todas as buscas binárias juntas, simulando as atualizações uma vez por rodada → O((n + q) log · custo).
- **Divisão e conquista no tempo** (com DSU com rollback): arestas que existem em intervalos de tempo.
- Inverter o tempo: remoções viram inserções (DSU só une).

## Aleatorização

- Embaralhar a entrada evita piores casos (treap, quicksort, círculo mínimo de Welzl esperado O(n)).
- Hash com base/semente aleatória (anti-hack).
- "Escolha aleatória acerta com prob. ≥ 1/2" repetida 30–60 vezes (ex.: elemento que aparece em ≥ metade, mediana aproximada).
- Sempre `mt19937`, nunca `rand()`.
