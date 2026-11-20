---
title: Fundamentos de DP
summary: O que é DP, estado/transição/caso base, ordem de cálculo, pull vs push, memo vs iterativo e o problema do sapo.
status: done
complexity: (nº de estados) × (custo da transição)
tags: dp, estado, transição, caso base, memoização, teoria
---

## O que é

Técnica para problemas que se quebram em **subproblemas menores que se repetem**. Em vez de refazer o mesmo cálculo várias vezes, resolve cada subproblema **uma vez** e guarda o resultado. Transforma algoritmos exponenciais em polinomiais.

## As três perguntas

1. **Estado**: o que `dp[i]` representa? Guarde só o necessário para continuar (o sapo não precisa do caminho inteiro, só da posição).
2. **Transição**: "de onde eu poderia ter vindo para chegar em `i`?" — como calcular um estado a partir de outros.
3. **Caso base**: os menores problemas já resolvidos (o sapo começa em 1: `dp[1] = 1`, uma maneira — não pular).

**Complexidade = nº de estados × custo de cada transição.**

## Exemplo: sapo (saltos de 1 a K)

- `dp[i] = dp[i-1] + dp[i-2] + … + dp[i-K]`, `dp[1] = 1`. N = 5, K = 2 → 5 maneiras.
- O(N·K): com K = 10⁵ fica lento. A transição só pergunta "**qual a soma de dp em [i−K, i−1]?**" → prefix sum (não há updates em estados já calculados): `dp[i] = pref[i-1] - pref[i-K-1]`, `pref[i] = pref[i-1] + dp[i]` → **O(N)**.
- A resposta cresce exponencialmente → na prática é pedida mod 10⁹+7.

## Ordem de cálculo

- Iterativo: calcule os estados numa ordem em que as dependências já estejam prontas (índice crescente, filhos antes do pai, ordem topológica, valores menores antes).
- Memoização (recursão + tabela com `-1` = "não calculado"): ordem automática, mas cuidado com profundidade de recursão.

## Pull vs Push

- **Pull**: `dp[i] = combinação de dp[j]` dos predecessores.
- **Push**: ao terminar `v`, "empurra" `dp[to] += dp[v]` para os sucessores (natural em DAG na ordem topológica: Game Routes).

## Reconstrução da resposta

Guarde `pai[i]` = de qual estado veio o ótimo e volte por ele (Pillars).

## Checklist

- Os estados cobrem todas as possibilidades? A transição não conta algo duas vezes?
- Valor inicial correto (0 para soma, 1 para produto/contagem, ±INF para min/max).
- Módulo em cada operação de contagem.
- Memória: dá para guardar só a "camada" anterior? (Candies usa O(k).)
