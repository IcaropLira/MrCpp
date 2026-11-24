---
title: Modelagem avançada com vértices e arestas
summary: Catálogo de truques de construção de grafo — vértices virtuais, segtree de vértices, grafo de estados, grafo dual, grafo em grade, complemento, arestas implícitas, Dijkstra multicritério e reduções para fluxo/2-SAT.
status: done
complexity: depende do grafo construído
tags: modelagem, vértices auxiliares, grafo de estados, segtree de vértices, grade, dual, teoria
---

## Vértices extras

| Situação | Construção | Arestas |
|---|---|---|
| "todos do grupo g se ligam com custo c" | vértice do grupo: `v → G` (c), `G → v` (0) | O(Σ grupos) em vez de O(Σ grupo²) |
| mesmo valor/cor/letra = teletransporte | um vértice por valor | idem |
| "de v para **todo** vértice em [l, r]" | **segtree de vértices** (árvore "de cima para baixo" com arestas 0 pai→filho) | O(log n) por intervalo |
| "de **todo** vértice em [l, r] para v" | segunda segtree (filho→pai com 0) | O(log n) |
| custo no vértice | `v_in → v_out` com o custo | 2n vértices |
| capacidade no vértice (fluxo) | `v_in → v_out` com a capacidade | |
| fonte múltipla / sumidouro múltiplo | super-vértice com arestas 0 | |
| "pagar para usar uma estação/porta" | vértice da estação com custo de entrada | |
| atalho para "qualquer vértice com propriedade P" | vértice virtual ligado a todos com P | |

## Grafo de estados (vértice = (lugar, informação extra))

| Informação extra | Exemplo | Tamanho |
|---|---|---|
| usou cupom/poder? | Flight Discount | 2n |
| quantas vezes usou (≤ K) | Micro-ondas | (K+1) n |
| item/bike/veículo atual | Bicycles | n · tipos |
| tempo mod k (sinais, horários) | semáforos periódicos | n · k |
| máscara de chaves coletadas | labirinto com portas | n · 2ᵏ |
| direção atual / última aresta | custo para virar, carro que não dá ré | n · 4 ou 2m |
| paridade do caminho | caminho de tamanho par/ímpar | 2n |
| combustível restante | posto de gasolina | n · C |
| posição de dois agentes | dois robôs que se movem juntos | n² |

Use BFS (custo 1), 0-1 BFS (custos 0/1) ou Dijkstra; DP se as camadas formarem DAG.

## Grade como grafo

- Vértice `(i, j)` → índice `i·m + j`; vizinhos com `dx[] = {1, -1, 0, 0}`, `dy[] = {0, 0, 1, -1}` (8 direções para rei; 8 saltos para cavalo).
- **BFS multifonte**: distância de cada célula ao "fogo"/monstro mais próximo — coloque todas as fontes na fila com 0.
- Componentes: BFS/DSU. Ilhas que tocam a borda: BFS a partir da borda.
- Grade enorme com poucos obstáculos: **comprima coordenadas** (só linhas/colunas relevantes ±1).
- Paridade de cor (xadrez): a grade é bipartida → matching (dominós, cobertura).

## Arestas implícitas / grafos enormes

- Não construa o grafo: gere vizinhos sob demanda (estado = número, string, permutação).
- Muitas arestas "todos com todos" mas peso = f(valores): ordene e ligue só vizinhos relevantes (MST de pontos em Manhattan: 4 varreduras; MST com peso `|aᵢ - aⱼ|`: só adjacentes após ordenar).
- BFS no **complemento** de um grafo esparso: mantenha um conjunto de não visitados e remova quem não é vizinho (O(n + m) amortizado).
- MST com peso xor: Borůvka + trie.

## Grafo dual e cortes geométricos

- Em grafo **planar**, corte mínimo s–t = caminho mínimo no **dual** (faces viram vértices). Clássico: "bloquear a passagem de baixo para cima com obstáculos" = conectar a borda esquerda à direita com obstáculos que se tocam (DSU/BFS entre obstáculos + duas bordas virtuais).
- Círculos/sensores bloqueando um corredor: vértices = círculos + parede de cima + parede de baixo; aresta se tocam; bloqueado ⇔ as paredes ficam conectadas.

## Reduções

| Problema | Vira |
|---|---|
| "escolha a ou b em cada par, com implicações" | 2-SAT |
| atribuição um-para-um com custo | matching / Hungarian / MCMF |
| "selecionar projetos com pré-requisitos" | corte mínimo (fechamento) |
| caminhos disjuntos | fluxo |
| restrições `x_j - x_i ≤ w` | Bellman-Ford (restrições de diferença) |
| ordem compatível com pares "a antes de b" | ordenação topológica |
| equivalências "a ~ b" incrementais | DSU (com paridade/peso se houver relação) |
| conectividade após remoções | inverter o tempo (DSU com inserções) |
| perguntas "todo caminho de u a v passa por w?" | block-cut tree / dominadores |
