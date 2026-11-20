---
title: Euler Tour — teoria
summary: Linearizar a árvore com parênteses; tin/tout; subárvore = intervalo; teste de ancestral; caminho raiz→v; aplicações.
status: done
complexity: O(n) para linearizar
tags: euler tour, tin, tout, linearização, subárvore, teoria
---

## O que é

Técnica de **linearização**: transforma a árvore numa sequência, permitindo consultas em subárvore, consultas em caminho e eliminação de recursão em algumas DPs.

## Parênteses

Ao **entrar** num vértice pela primeira vez escreva `(`; ao **sair**, `)`. Ex.: `( ( ( ) ( ) ) ( ) )`.

Propriedades:
- A sequência é sempre **regular** (balanceada).
- Se `u` está na subárvore de `v`, os parênteses de `u` estão **dentro** dos de `v`.

**Prova**: numa árvore há um único caminho entre dois vértices — como uma sala com uma só porta. Para entrar em `u` é preciso passar por `v`, e para sair de `u` também.

## tin / tout

Exemplo da aula (posições 0..9): `tin[1]=0, tout[1]=9`; `tin[3]=1, tout[3]=6`; `tin[4]=2, tout[4]=3`; `tin[5]=4, tout[5]=5`; `tin[2]=7, tout[2]=8`.

- **`u` está na subárvore de `v`** ⇔ `tin[v] ≤ tin[u]` e `tout[u] ≤ tout[v]`.
- `u` é ancestral de `v` ⇔ `tin[u] ≤ tin[v] && tout[v] ≤ tout[u]` (útil também para LCA).

## Convenção prática (uma posição por vértice)

`tin[v]` = ordem de entrada (1..n); `tout[v]` = **maior `tin` da subárvore**. Então:

- A subárvore de `v` ocupa exatamente as posições **`[tin[v], tout[v]]`**, contíguas.
- O vértice `v` "mora" na posição `tin[v]`; `tamanho da subárvore = tout[v] - tin[v] + 1`.

Exemplo da aula: subárvore de 3 = posições 2 a 4 → soma = 5 + 2 + 1 = 8.

## Problemas → estrutura

| Pergunta | Vira | Estrutura |
|---|---|---|
| Trocar valor de `s`; soma da subárvore de `s` | ponto em `tin[s]`; soma `[tin, tout]` | BIT/segtree |
| Trocar valor de `s`; soma do caminho raiz→`s` | o valor de `v` vale para a subárvore de `v`: range add `[tin, tout]`; consulta ponto `tin[s]` | BIT de diferenças |
| Somar `x` na subárvore (tudo offline) | diferenças `d[tin] += x`, `d[tout+1] -= x` | vetor |
| Inverter lâmpadas da subárvore; contar acesas | inverter/contar intervalo | lazy XOR |
| Subárvore com valores ≤ k, k-ésimo… | intervalo | merge sort tree / wavelet / offline |

Por que o caminho raiz→s funciona: `val[2]` só aparece nos caminhos de 2 e dos seus descendentes = a subárvore de 2.

## Implementação sem recursão

Pilha de pares `(v, pai)`; ao desempilhar `v > 0`: `tin[v] = ++timer`, empilha `(-v, pai)` (marca de saída) e os filhos; ao desempilhar `-v`: `tout[v] = timer`. (Árvore em linha com n = 2·10⁵ estoura recursão em muitos juízes.)

## Variações de Euler tour

- **2n carimbos** (entrada e saída separadas) — usado para "caminho = prefixo" com `+val` na entrada e `-val` na saída.
- **Tour de 2n−1 vértices** (anota o vértice toda vez que passa) — LCA por RMQ: LCA(u, v) = vértice de menor profundidade entre as primeiras ocorrências.
- A sequência de parênteses também é a **assinatura** usada no isomorfismo de árvores (ver Hashing).
