---
title: Small to Large — teoria
summary: Despejar sempre o conjunto menor no maior; prova do O(n log n), versão em árvore e cuidados.
status: done
complexity: O(n log n) movimentos
tags: small to large, dsu on tree, merge, prova, teoria
---

## Problema motivador

N caixas, cada uma com uma bola de cor `Cᵢ`. Consulta `(a, b)`: mover todas as bolas de `a` para `b` e dizer quantas cores distintas há em `b`. Ingênuo: mover tudo → se todas as bolas estiverem numa caixa, cada operação é O(N) → **O(N·Q)**.

## A ideia

Antes de esvaziar `a`, **se `a` tem mais elementos que `b`, troque as caixas** (troca de ponteiros/`swap` em O(1)). Só o conjunto menor se move.

## Prova

Uma bola só sai da caixa `A` quando `|A| ≤ |B|`, e cai em `A ∪ B` com `|A| + |B| ≥ 2|A|`. Depois de `k` mudanças, a caixa da bola tem ≥ `2ᵏ` bolas, e nunca passa de `N` ⇒ `k ≤ log₂ N`.
Total: `N` bolas × `log₂ N` mudanças = **O(N log N)** cópias (× log se o contêiner for `set`/`map`).
Medição da aula (N = 2·10⁵, pior caso): ingênuo > 30 s; small to large 0,4 s.

Obs.: no código, `size()` do `set` conta cores **distintas**; mover a menor custa ≤ min(bolas de a, bolas de b), mesmo limite.

## Em árvores

- Se a cor `C` está na subárvore de `v`, está nas subárvores de todos os ancestrais de `v` ⇒ **cores de `v` = união das cores dos filhos + a sua**.
- Processe filhos antes do pai; o vértice **herda o maior conjunto entre os filhos** (swap) e insere os outros nele.
- Ao trocar contêineres, troque também os agregados associados (maior frequência, soma das dominantes…).
- Para contar pares (caminhos de tamanho k), **conte antes de juntar** cada filho.

## Variações

- DSU com união por tamanho é small to large.
- "Sack"/DSU on tree com Euler tour: mantém um único array global de frequências; equivalente em complexidade.
- `unordered_map` acelera, mas cuidado com anti-hash.
