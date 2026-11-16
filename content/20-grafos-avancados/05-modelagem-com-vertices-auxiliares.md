---
title: Modelagem com vértices auxiliares
summary: Transforma restrições, capacidades e escolhas em vértices e arestas de um grafo.
status: done
complexity: Depende da redução; O(V + E) para construir o grafo
tags: grafos, modelagem, fluxo, redução
---

## Padrões de modelagem

- **Superfonte e supersorvedouro:** conecte uma nova fonte às origens e os destinos a um novo sorvedouro.
- **Capacidade de vértice:** substitua v por v_in e v_out, ligados por uma aresta cuja capacidade limita o uso de v.
- **Aresta como vértice:** crie um nó para cada aresta original; conecte os extremos a esse nó para transformar restrições sobre arestas em restrições sobre vértices.
- **Escolhas bipartidas:** crie uma partição para cada tipo de objeto; arestas representam compatibilidade. Reduza a matching ou fluxo.
- **Restrições de precedência:** modele cada tarefa como vértice e cada dependência como aresta; a ordem topológica verifica se há ciclo.
- **Conectividade por intervalos:** use árvores de segmentos sobre tempo/índice para ligar operações a vários vértices sem criar todas as arestas.

## Exemplo — limitar a passagem por um vértice

~~~cpp
int in(int v) { return 2 * v; }
int out(int v) { return 2 * v + 1; }

int novoN = 2 * n;
Dinic dinic(novoN);

for (int v = 0; v < n; v++)
    dinic.add_edge(in(v), out(v), capacidade[v]);

for (auto [u, v, cap] : arestas)
    dinic.add_edge(out(u), in(v), cap);

long long resposta = dinic.flow(out(s), in(t));
~~~

## Cuidados

- Defina se a capacidade limita entrada, saída ou passagem pelo vértice.
- Ajuste fonte e sorvedouro para não aplicar indevidamente a capacidade de vértice a eles.
- A transformação aumenta o número de vértices, mas mantém o tamanho do grafo linear.
- Desenhe o grafo transformado e prove a correspondência entre soluções.
