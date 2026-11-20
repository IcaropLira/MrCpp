---
title: DP em árvore — teoria
summary: dp[v][estado] sobre a subárvore; pintura sem adjacentes, Infected Tree e o que sobe/desce na árvore.
status: done
complexity: O(n · estados)
tags: dp em árvore, subárvore, independent set, teoria
---

## Problema motivador (Taro)

Árvore com N vértices; pinte cada um de **laranja** ou **verde**, sem dois verdes adjacentes. Quantas maneiras?

- DFS contando configuração por configuração: `DFS(v, cor)` chama 2 DFS por filho → **O(2ⁿ)** (chama o mesmo estado várias vezes).
- DP: `dp[v][c]` = maneiras de pintar a **subárvore de v** com `v` na cor `c` — a mesma coisa da DFS, mas guardada.

## Transições

- Folha: `dp[v][laranja] = dp[v][verde] = 1`.
- `v` laranja: filhos livres → `dp[v][0] = Π (dp[f][0] + dp[f][1])`.
- `v` verde: filhos obrigatoriamente laranja → `dp[v][1] = Π dp[f][0]`.
- Resposta: `dp[raiz][0] + dp[raiz][1]`.

Exemplo da aula: `dp[2][0] = dp[3][0] + dp[3][1] = 2`, `dp[2][1] = dp[3][0] = 1`; raiz `dp[1][0] = (dp[2][0]+dp[2][1])·(dp[4][0]+dp[4][1]) = 3·2 = 6`, `dp[1][1] = dp[2][0]·dp[4][0] = 2·1 = 2` → total 8.

Mesmo problema: **Independent Set** (AtCoder DP P, branco/preto, mod 10⁹+7).

## Implementação

- Recursiva: `dfs(v, pai)`; calcula filhos e combina na volta.
- Sem recursão: BFS a partir da raiz guarda `ordem` (pai antes do filho) e `pai[]`; percorra `ordem` **invertida** (filhos antes do pai) para subir a DP; percorra `ordem` normal para descer informação (rerooting).

## Infected Tree (CF 1689C)

Árvore binária, raiz infectada; a cada passo você apaga um vértice e a infecção avança. `dp[v]` = salvos se `v` está infectado:
- 1 filho `f`: apaga `f` → salva `sz[f] - 1`.
- 2 filhos `a, b`: `max(sz[a] - 1 + dp[b], sz[b] - 1 + dp[a])`.

## Padrões de estado

| Problema | Estado |
|---|---|
| Conjunto independente / coloração | `dp[v][cor de v]` |
| Emparelhamento máximo na árvore | `dp[v][v está casado?]` |
| Vertex cover | `dp[v][v no conjunto?]` |
| Subárvore conexa contendo v | `dp[v] = Π (dp[f] + 1)` |
| Diâmetro / maior caminho | duas maiores profundidades dos filhos |
| Mochila na árvore (escolher k vértices) | `dp[v][k]`, merge dos filhos em O(n²) total |

## Fechamento: o que sobe e o que desce?

- **Sobe** (filhos → pai): informação da subárvore (`sz`, `dp[v]`, maiores profundidades).
- **Desce** (pai → filhos): informação "de fora da subárvore" (`up[v]`), usada no rerooting.
