---
title: SCC, 2-SAT, articulações e componentes — teoria
summary: Componentes fortemente conexas (Tarjan/Kosaraju), grafo condensado, 2-SAT, pontos de articulação, componentes biconexas e block-cut tree.
status: done
complexity: O(V + E)
tags: scc, tarjan, kosaraju, 2-sat, articulação, biconexo, block-cut tree, teoria
---

## Componentes fortemente conexas (grafo dirigido)

- `u` e `v` na mesma SCC ⇔ `u` alcança `v` e `v` alcança `u`.
- **Kosaraju**: DFS guardando a ordem de saída; DFS no grafo **transposto** na ordem inversa — cada árvore é uma SCC.
- **Tarjan**: uma DFS com `tin`/`low` e pilha; `v` é raiz de SCC quando `low[v] == tin[v]`. As SCCs saem em **ordem topológica reversa**.
- **Grafo condensado** (cada SCC vira um vértice) é sempre um **DAG** → DP em DAG por cima (maior soma de pesos alcançável, alcançabilidade…).
- Arestas mínimas para tornar fortemente conexo: `max(#fontes, #sumidouros)` do condensado (0 se já tem 1 SCC).

## 2-SAT

Cláusulas `(a ∨ b)` com variáveis booleanas. Cada literal é um vértice (`x` e `¬x`); `(a ∨ b)` vira `¬a → b` e `¬b → a`.
- **Insatisfatível ⇔ `x` e `¬x` na mesma SCC** para algum x.
- Atribuição: `x = verdadeiro` se `comp[x]` vem **depois** de `comp[¬x]` na ordem topológica (com Tarjan, que numera em ordem reversa: `comp[x] < comp[¬x]`).
- Traduções: `a → b` ≡ `(¬a ∨ b)`; forçar `a` ≡ `(a ∨ a)`; XOR `a ⊕ b` ≡ `(a ∨ b) ∧ (¬a ∨ ¬b)`; "no máximo um de vários" exige truque de prefixo (O(n) cláusulas).

## Pontos de articulação e biconexidade (não dirigido)

- `p` não raiz é articulação ⇔ algum filho `v` na DFS tree tem **`low[v] ≥ tin[p]`**; a raiz é ⇔ tem ≥ 2 filhos.
- Ponte ⇔ `low[v] > tin[p]` (ver Pontes).
- **Componentes 2-aresta-conexas**: remova as pontes; contraindo → **bridge tree**.
- **Componentes biconexas (2-vértice-conexas)**: pilha de arestas na DFS; **block-cut tree** (blocos + articulações) é uma árvore → perguntas "todo caminho de u a v passa por w?" viram perguntas em árvore (LCA).
- Grafo sem pontes pode ser **orientado** para ficar fortemente conexo (Robbins): oriente as arestas da árvore para baixo e as back edges para cima.

## Alcançabilidade e ciclos

- Ciclo em dirigido: DFS com cores (aresta para vértice cinza) ou Kahn não processa todos.
- Ciclo em não dirigido: aresta para vértice visitado que não é o pai (cuidado com multiarestas) ou DSU.
- Grafo funcional (cada vértice com 1 saída): cada componente = um ciclo com árvores penduradas; Floyd (tartaruga e lebre) acha o ciclo com O(1) memória; binary lifting dá o k-ésimo sucessor.
