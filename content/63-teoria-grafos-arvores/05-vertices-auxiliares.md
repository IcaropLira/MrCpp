---
title: Vértices auxiliares e grafo de estados — teoria
summary: Vértices-ponte para cortar O(N²) arestas, split in/out para peso em vértice, camadas para restrições (cupom, K usos, bike).
status: done
complexity: O(N + M) arestas em vez de O(N · M)
tags: modelagem, vértices auxiliares, grafo de estados, camadas, dijkstra, teoria
---

## O que são

Nós **adicionados ao grafo** para modelar e simplificar restrições, transformando cenários atípicos em problemas padrão (Dijkstra, BFS, componentes, fluxo). Ideia geral: transformar um `O(N·M)` em `O(N + M)`.

## 1. Vértice-ponte por grupo (alunos e músicas)

Dois alunos são amigos se compartilham uma música; contar grupos de conversa = componentes conexas.

- Ingênuo: aresta aluno–aluno → se todos gostam da mesma música, grafo **completo**: `N(N-1)/2` arestas.
- Auxiliar: um vértice por **música**; aresta aluno — música para cada música do conjunto. Cada aluno só liga às suas músicas ⇒ nº de arestas = **soma dos conjuntos** (≤ 2·10⁵). A conectividade (resposta) **não muda**.

Generalizações: "todos de um grupo ligados entre si com custo c" → um nó do grupo com arestas de custo c/2 (ou entrada c, saída 0, se dirigido); "todos com o mesmo valor/cor"; segtree de vértices para "ligar a um intervalo".

## 2. Não dirigido → dirigido

Uma aresta não dirigida = **duas** dirigidas (ida e volta). Na maioria dos problemas a propriedade a manter é a **conectividade**, então podemos manipular o grafo à vontade desde que ela se mantenha.

## 3. Peso no vértice → vértice de entrada e saída

Algoritmos de caminho mínimo não tratam peso em vértice. Divida cada `V` em `V_in → V_out` com custo `A[V]` (o trânsito):

- `V_in` só tem uma aresta saindo (para `V_out`); `V_out` só tem uma entrando (de `V_in`).
- Estrada `V — U` (custo T) vira `V_out → U_in` e `U_out → V_in`.
- Todo caminho que **entra** em `V` é obrigado a passar pela aresta `V_in → V_out` ⇒ o trânsito é contado.
- Resposta: `dist(1_in, N_out)`. Exemplo da aula: 3 + 5 + 2 + 3 + 1 = **14** (8 vértices, 12 setas).

Também é o truque de **capacidade em vértice** em fluxo máximo.

## 4. Grafo de estados (camadas)

Quando há uma escolha "sem volta" (cupom, uso limitado), o estado vira `(vértice, flag)`:

- **Flight Discount**: `DIST[V][0/1]` = menor distância a V tendo usado ou não o cupom. Duas cópias do grafo; o voo `a → b` ganha a seta `(a,0) → (b,1)` com `⌊c/2⌋`. Só se desce da camada 0 para a 1 ⇒ as camadas formam um DAG entre si. Usar o cupom nunca piora ⇒ resposta na camada 1 (ou `min` das duas). Ingênuo: um Dijkstra por aresta, `O(M·N log N)`; com camadas, um Dijkstra só: `O((N + M) log M)`, 2N vértices e 3M arestas.
- **Até K usos** (Micro-ondas): K+1 camadas; aresta especial sobe de `k` para `k+1`; resposta `min_k dist[(N, k)]`.
- **Bicycles**: estado `(cidade, bike em uso)`; comprar a bike da cidade = aresta de custo 0 para outra camada. `n²` estados.
- Outros: `(vértice, tempo mod k)`, `(vértice, máscara de chaves)`, `(vértice, paridade)`, `(vértice, direção)`.

Índice do estado `(v, k)` → `v + k·n` (vetores lineares).

## Por que funciona

O novo grafo **preserva** os caminhos válidos do problema original e **só** eles (as restrições viram a forma do grafo). Se as camadas só "descem", há estrutura de DAG entre elas, que é o que torna correta a DP/Dijkstra sobre estados.
