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

## Outras reduções recorrentes

### Caminhos disjuntos por vértices

Divida cada vértice v em entrada e saída e conecte in(v) -> out(v) com capacidade 1 (ou capacidade específica). Cada aresta original u -> v vira out(u) -> in(v). O fluxo máximo passa a contar caminhos internamente disjuntos por vértices. Se a fonte e o destino puderem ser usados várias vezes, atribua capacidade alta a eles.

### Matching bipartido

Crie fonte S, nós da partição esquerda, nós da direita e sorvedouro T. Use capacidade 1 em S -> L, L -> R quando houver compatibilidade e R -> T. O fluxo máximo é o tamanho do matching.

### Fechamento de peso máximo

Para escolher um conjunto de projetos com lucro positivo e dependências, ligue S aos projetos de lucro positivo com capacidade lucro; projetos de lucro negativo a T com capacidade oposto do custo. Para dependência u exige v, adicione aresta u -> v com capacidade INF. A resposta é soma dos lucros positivos menos o corte mínimo.

### Restrições de atribuição

Uma tarefa por agente e agente por tarefa: reduza a matching bipartida. Se houver custos, use fluxo de custo mínimo em vez de Dinic.

## Modelagem antes do código

1. Identifique o que cada vértice representa.
2. Defina exatamente o significado de cada aresta.
3. Escolha capacidade 1, capacidade do objeto ou INF conforme a restrição.
4. Prove que toda solução original corresponde a um fluxo/corte e vice-versa.
5. Verifique se a capacidade da fonte e do sorvedouro deve ser preservada na transformação.
