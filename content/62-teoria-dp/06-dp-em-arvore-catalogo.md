---
title: DP em árvore — catálogo de padrões
summary: Todos os formatos de estado que caem em prova (seleção, cobertura, dominação, matching, mochila, contagem, distâncias, caminhos, cortes, esperança), custos e truques de implementação.
status: done
complexity: O(n) a O(n²)
tags: dp em árvore, padrões, rerooting, mochila na árvore, dominação, matching, teoria
---

## Receita

1. **Enraíze** (em 1). Todo caminho/conjunto tem um vértice **mais alto**: conte/otimize cada objeto no seu vértice mais alto.
2. **Estado** = `dp[v][o que o pai precisa saber sobre v]` (escolhido? dominado? casado? tamanho? profundidade?).
3. **Transição** = juntar filhos um a um (produto para contagens independentes, soma para custos, max para ótimos).
4. Se pedirem a resposta **para cada raiz** → rerooting (prefixo/sufixo dos irmãos).

## Catálogo

| Problema | Estado | Transição (resumo) | Custo |
|---|---|---|---|
| Conjunto independente máximo (peso) | `[v fora, v dentro]` | dentro: Σ fora dos filhos; fora: Σ max | O(n) |
| Nº de conjuntos independentes / colorir sem vizinhos verdes | idem | produtos | O(n) |
| Cobertura mínima de vértices | `[fora, dentro]` | fora ⇒ filhos dentro | O(n) |
| **Conjunto dominante** mínimo | `[dentro, fora-dominado-por-filho, fora-não-dominado]` | ver Complementos | O(n) |
| **Emparelhamento** máximo | `[livre, casado com filho]` | troca o melhor filho | O(n) |
| Colorir com k cores sem vizinhos iguais | — | `k·(k-1)^(n-1)` (fórmula) | O(1) |
| Colorir com custo por cor | `[cor de v]` | mín sobre cores ≠ dos filhos (guarde as 2 melhores) | O(n k) |
| Subárvore conexa contendo v (contagem) | `f[v]` | `Π (f[c] + 1)` | O(n) |
| **Mochila na árvore** (k vértices conexos, orçamento) | `[v][tamanho]` | merge limitado por tamanhos | **O(n²)** / O(n K) |
| Pares a distância K | `[v][prof]` | conta antes de juntar | O(n K) |
| Soma das distâncias (todos os pares) | `sz` | `Σ sz(n - sz)` | O(n) |
| Soma das distâncias a cada v | rerooting | `ans[c] = ans[v] + n - 2 sz[c]` | O(n) |
| Excentricidade de cada v | duas maiores descidas + up | rerooting | O(n) |
| Diâmetro / caminho de soma máxima | maior descida | duas maiores descidas positivas | O(n) |
| Cortar arestas: componentes de tamanho par / múltiplo de k | `sz` | corta se `sz % k == 0` | O(n) |
| Cortar para k componentes otimizando algo | `[v][nº de cortes]` | mochila na árvore | O(n²) |
| Infecção/apagar vértices (Infected Tree) | `dp[v]` salvos | max sobre qual filho apagar | O(n) |
| Jogo em árvore (quem move um token) | `win[v]` | ganha se algum filho perde | O(n) |
| Esperança (passeio aleatório para a raiz/folha) | `E[v]` | `E[v] = 1 + Σ p·E[u]` (isolar auto-referência) | O(n) |
| Nº de ordenações topológicas da árvore (heap orderings) | `ways[v]` | `n! / Π sz[v]` (hook length em árvore) | O(n) |
| Hash/isomorfismo | forma canônica | filhos ordenados | O(n log n) |
| k-ésimo ancestral / caminho | binary lifting | DP `up[j][v]` | O(n log n) |

## Merge O(n²) — por que funciona

Ao juntar o filho `u` em `v`, o custo é `(tamanho já processado de v) · sz[u]`. Cada par de vértices é "pago" uma vez, no merge do seu LCA ⇒ total ≤ `n²/2`. Com limite `K` na segunda dimensão, cada merge custa `min(a, K) · min(b, K)` ⇒ total **O(nK)**. **Cuidado**: o laço tem que ir só até os tamanhos atuais, não até K fixo.

## Truques de implementação

- **Sem recursão**: BFS a partir da raiz dá `ordem` e `pai`; percorra `ordem` invertida para subir a DP e normal para descer (todas as aulas usam esse padrão).
- **Prefixo/sufixo** dos irmãos quando o merge não tem inverso (produto mod não primo, max).
- **Duas maiores** (e de qual filho veio a maior) para "excluir um filho" com max.
- **Long path decomposition** (herdar o vetor do filho mais **profundo**): DPs indexadas por profundidade em O(n) total.
- **Small to large**: DPs indexadas por valores/cores em O(n log n).
- **Euler tour**: a ordem `tin` permite DP "em vetor" (subárvore = intervalo contíguo).
- **Floresta**: rode a DP em cada componente (ou ligue todas as raízes a um vértice virtual 0).
- **Grafo funcional / unicíclico**: ache o ciclo, rode DP em árvore nas árvores penduradas e depois uma DP circular no ciclo (fixe o estado do primeiro vértice do ciclo e teste as 2 possibilidades).

## Fórmulas de árvore que ajudam

- Nº de pares cujo caminho passa por `v`: `C(n, 2) - Σ C(sᵢ, 2)` (sᵢ = componentes sem v).
- Nº de caminhos que usam a aresta `(v, pai)`: `sz[v] · (n - sz[v])`.
- Esperança da distância entre dois vértices aleatórios: `Σ sz(n - sz) / C(n, 2)`.
- Árvore com `n` vértices e `L` folhas: `Σ (grau - 2) = -2` ⇒ `L = 2 + Σ_{grau ≥ 3} (grau - 2)`.
- Ordenações topológicas (pais antes dos filhos) de uma árvore enraizada: `n! / Π sz[v]`.
