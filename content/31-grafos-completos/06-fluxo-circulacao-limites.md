---
title: Fluxo com limites inferiores e circulação
summary: Reduz circulação com lower bounds a uma instância de fluxo máximo com superfonte e supersorvedouro.
status: done
complexity: Uma chamada de max-flow sobre O(V) vértices e O(E) arestas
tags: fluxo, lower bound, circulação, modelagem
---

## Quando usar

Quando cada aresta u->v precisa transportar entre low e high unidades e o fluxo deve conservar fluxo em todos os vértices. Não há fonte/sorvedouro fixos: queremos uma circulação viável.

## Redução

Para cada aresta, reserve obrigatoriamente low unidades e deixe capacidade residual high-low. Atualize bal[u] -= low e bal[v] += low. Adicione superfonte SS e supersorvedouro TT:

- Se bal[v] > 0, adicione SS -> v com capacidade bal[v].
- Se bal[v] < 0, adicione v -> TT com capacidade -bal[v].
- A circulação é viável se o fluxo máximo de SS a TT saturar todas as arestas que saem de SS.

## Código — construção da redução

Dinic é a estrutura de fluxo máximo apresentada na ficha correspondente.

~~~cpp
struct LowerBoundCirculation {
    int n, SS, TT;
    Dinic dinic;
    vector<long long> bal;
    long long demand = 0;

    LowerBoundCirculation(int n)
        : n(n), SS(n), TT(n + 1), dinic(n + 2), bal(n) {}

    void add_edge(int u, int v, long long low, long long high) {
        assert(0 <= low && low <= high);
        dinic.add_edge(u, v, high - low);
        bal[u] -= low;
        bal[v] += low;
    }

    bool feasible() {
        for (int v = 0; v < n; v++) {
            if (bal[v] > 0) {
                dinic.add_edge(SS, v, bal[v]);
                demand += bal[v];
            } else if (bal[v] < 0) {
                dinic.add_edge(v, TT, -bal[v]);
            }
        }
        return dinic.flow(SS, TT) == demand;
    }
};
~~~

## Cuidados

- A ficha pressupõe Dinic::add_edge(u,v,cap) e Dinic::flow(s,t) com arestas dirigidas.
- Para exigir fluxo de s até t com limites inferiores, acrescente uma aresta artificial t -> s com capacidade suficientemente grande, verifique a circulação e recupere o fluxo nessa aresta.
- Não esqueça que high-low é a capacidade residual depois de reservar o mínimo obrigatório.
- Use long long para limites, balanços e demanda total.
