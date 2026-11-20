---
title: DPs clássicas e otimizações — formulário
summary: Recorrências de mochila, LIS, LCS, edição, intervalos, bitmask, dígitos, árvores, contagem; otimizações CHT, D&C, Knuth, Aliens, SOS, matriz e bitset.
status: done
complexity: veja cada recorrência
tags: dp, mochila, lis, lcs, edit distance, bitmask, digit dp, cht, knuth, teoria
---

## Recorrências que você deve saber escrever de olho fechado

| Problema | Estado e transição | Custo |
|---|---|---|
| Mochila 0/1 | `dp[c] = max(dp[c], dp[c - w] + v)` com `c` **decrescente** | O(n W) |
| Mochila ilimitada | mesmo, `c` **crescente** | O(n W) |
| Mochila limitada (qᵢ cópias) | divisão binária das cópias ou deque por resto | O(n W log q) / O(n W) |
| Mochila por valor (W enorme) | `dp[v]` = menor peso para valor v | O(n V) |
| Troco mínimo / nº de maneiras | `dp[x] = min(dp[x - c] + 1)` / `ways[x] += ways[x - c]` (moedas por fora = combinações; x por fora = sequências) | O(n X) |
| LIS | `lower_bound` em `tails` (estrita) / `upper_bound` (não estrita) | O(n log n) |
| LCS | `dp[i][j] = a_i == b_j ? dp[i-1][j-1] + 1 : max(dp[i-1][j], dp[i][j-1])` | O(nm); bitset O(nm/64) |
| Edição (Levenshtein) | `min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + [a_i ≠ b_j])` | O(nm) |
| Subarray máximo (Kadane) | `cur = max(x, cur + x)` | O(n) |
| Caminhos em grade | `dp[i][j] = dp[i-1][j] + dp[i][j-1]` (bloqueios = 0) | O(nm) |
| Intervalos (juntar, parênteses, palíndromos) | `dp[l][r]` por tamanho crescente, `k` dividindo | O(n³) |
| Bitmask (TSP, atribuição) | `dp[mask][último]` | O(2ⁿ n²) |
| Partição em subconjuntos | iterar submáscaras: `for (s = m; s; s = (s-1) & m)` | O(3ⁿ) |
| Dígitos (quantos ≤ N com propriedade) | `dp[pos][estado][tight][começou]` | O(len · estados · 10) |
| Árvore | `dp[v][estado]` filhos antes do pai; mochila na árvore O(n²) total | O(n) – O(n²) |
| Perfis (ladrilhar grade) | `dp[coluna][máscara do perfil]` | O(m 2ⁿ ...) |
| Probabilidade/esperança | `E[s] = c + Σ p · E[s']` (isolar auto-laço) | — |
| Jogos | `win[s] = existe jogada para estado perdedor` | — |

## Otimizações

| Forma | Técnica | Custo |
|---|---|---|
| soma/min em janela de índices | prefixo / deque | O(1) |
| máx sobre valores numa faixa | segtree/BIT por valor | O(log n) |
| `dp[i] = min_j (dp[j] + b_j · a_i)` (retas) | **Convex Hull Trick** (inclinações monótonas: deque; geral: Li Chao) | O(1) amort. / O(log C) |
| `dp[k][i] = min_{j<i} dp[k-1][j] + C(j, i)` com `opt` monótono | **Divisão e conquista** | O(k n log n) |
| intervalos com desigualdade quadrangular | **Knuth** | O(n²) |
| "exatamente k" com f(k) côncava | **Aliens** (λ) | O(n log C) |
| soma sobre submáscaras | **SOS DP** | O(n 2ⁿ) |
| transição linear, n enorme | **exponenciação de matriz** / Berlekamp-Massey + Kitamasa | O(k³ log n) / O(k² log n) |
| DP booleana de somas | **bitset** | /64 |
| estados com dois parâmetros pequenos | trocar o que é índice e o que é valor (mochila por valor) | — |
| meet in the middle (n ≤ 40) | dividir em metades e combinar ordenando | O(2^(n/2) n) |

## Desigualdade quadrangular (para Knuth / D&C)

`C(a, c) + C(b, d) ≤ C(a, d) + C(b, c)` para `a ≤ b ≤ c ≤ d`. Vale para `C = (soma do intervalo)²`, `C = soma do intervalo` (Knuth também precisa de monotonia), distâncias em linha etc. Na dúvida: teste `opt` monótono com força bruta em casos pequenos.

## Checklist de DP

1. O estado guarda tudo que influencia o futuro (e nada mais)?
2. Ordem de cálculo respeita as dependências?
3. Inicialização (inválidos = ±INF, não 0).
4. Resposta: é `dp[final]` ou o máximo sobre vários estados?
5. Memória: dá para rolar o vetor (só a camada anterior)?
