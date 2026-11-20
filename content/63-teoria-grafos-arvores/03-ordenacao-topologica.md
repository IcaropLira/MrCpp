---
title: Ordenação topológica e DAG — teoria
summary: Definição, existência só em DAG, algoritmo de Kahn passo a passo, detecção de ciclo, DP em DAG e contagem de caminhos mínimos.
status: done
complexity: O(n + m)
tags: topológica, kahn, dag, grau de entrada, ciclo, teoria
---

## Definição

Ordem topológica = sequência dos vértices em que **toda seta `u → v` deixa `u` antes de `v`** ("toda seta aponta para frente"). Só existe se o grafo é um **DAG** (dirigido acíclico). Em geral **não é única** (ex.: `1 2 4 3 5` e `1 4 2 3 5`).

## Modelagem (tarefas do Sandro)

- Vértice = tarefa; seta `X → Y` = "X antes de Y".
- Primeira tarefa possível: ninguém aponta para ela ⇔ **grau de entrada 0**.

## Kahn (BFS por grau de entrada)

1. Calcule o grau de entrada de todos os vértices.
2. Coloque na fila todos com grau 0.
3. Retire `v` da fila, coloque na ordem. Para cada seta `v → to`: apague-a (`grau[to]--`); se `grau[to]` chegou a 0, `to` está livre → entra na fila (reação em cadeia).
4. Se a ordem tem menos de `n` vértices, **há ciclo** (sobrou alguém que nunca foi liberado) → "Sandro fails."

Qual o problema dessa solução? **Nenhum**: O(n + m).

## Variações

- **Menor ordem lexicográfica**: troque a fila por `priority_queue` mínima → O((n+m) log n). (O SPOJ TOPOSORT pede isso.)
- **Via DFS**: ordem reversa do tempo de saída da DFS; ciclo ⇔ aresta para vértice "em processamento" (cor cinza).
- **Por camadas**: processe a fila nível a nível para saber o "semestre mínimo" de cada tarefa (caminho mais longo em DAG).

## DP em DAG

Na ordem topológica, quando chegamos em `v` todos os predecessores já foram processados ("`v` já está completo"). Então:

- Contar caminhos `1 → n`: `ways[1] = 1`, `ways[to] += ways[v]` (Game Routes).
- Caminho mais longo/curto em DAG (inclusive com pesos negativos): relaxe na ordem topológica.

## Contar caminhos mínimos (Problema Motivador 2 / Investigation)

1. **Dijkstra** de 1 (pesos não negativos).
2. Uma aresta `u → v` com custo `c` está em algum caminho mínimo ⇔ **`dist[v] = dist[u] + c`** ("antecessor válido"). Se a igualdade é falsa, o caminho por `u` é subótimo e é ignorado.
3. As arestas ótimas formam um **DAG** (com pesos > 0). Na ordem topológica dele:
   `ways[v] = Σ ways[u]` sobre antecessores válidos; `min_voos[v] = min(min_voos[u] + 1)`; `max_voos[v] = max(max_voos[u] + 1)`.

Exemplo da aula: rotas 1→2→3→6 e 1→4→5→6, ambas de custo 3 → `Ways[6] = 2`.

(Com pesos 0 o "DAG ótimo" pode ter ciclo de custo 0; aí processe na ordem de `dist` e, em empate, com cuidado.)

## Aplicações que caem

- Compatibilidade de várias ordens parciais (Chat Screenshots): junte as setas e teste se é DAG.
- "Anda para sempre" (Endless Walk): vértices que alcançam ciclo = os que **sobram** ao rodar Kahn no grafo **invertido** (remove quem não tem saída).
- Pré-requisitos, build systems, ordem de avaliação de fórmulas, SCC → grafo condensado (sempre DAG).
