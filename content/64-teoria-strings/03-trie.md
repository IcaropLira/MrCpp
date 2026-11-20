---
title: Trie — teoria
summary: Árvore de prefixos: inserção, busca, contagem de prefixos, memória, trie de bits para máximo xor.
status: done
complexity: O(|s|) por operação · O(Σ|s| · alfabeto) memória
tags: trie, prefixo, xor, bit trie, teoria
---

## Problema motivador (Ada, a Joaninha)

Lista de palavras e consultas: quantas palavras têm a consulta como **prefixo**? Ex.: lista `aba, abaa, abdcaba`; `c` → 0, `ab` → 3, `aba` → 2.

Solução com dicionário: guardar a contagem de **todo prefixo** como string (`A=3, AB=3, ABA=2, ABAA=1, ABD=1, …`). Funciona, mas é **lenta e gasta muita memória** (cada prefixo é uma string nova: O(L²) por palavra).

## Trie

Representa as strings como uma árvore: cada aresta é uma letra; cada nó é um prefixo.

- **Inserir**: a partir da raiz, para cada letra: se não existe o caminho, **crie**; se existe, **siga**. No fim, **marque** a palavra como terminada.
- **Buscar** palavra: existe um caminho com todas as letras e o último nó está marcado.
- **Contar prefixos**: guarde `cnt[v]` = quantas palavras passam por `v`; a resposta é `cnt` do nó da consulta (0 se o caminho não existe).

Cada operação custa **O(|s|)**.

## Memória

- Nós ≤ `Σ|palavras| + 1`. Cada nó com `int filho[26]` = 104 bytes → 10⁶ nós ≈ 100 MB. Aloque sob demanda.
- Alfabeto grande/variável: `map<char,int>` ou `unordered_map` por nó (mais lento, menos memória).
- Phone List: dígitos → alfabeto 10.

## Detectar prefixo entre palavras (Phone List)

Ao inserir `s`: conflito se **passar por um nó marcado** (um número anterior é prefixo de `s`) ou se **terminar num nó que já existia** (s é prefixo de um anterior / repetido).

## Trie de bits (xor)

Números como strings de bits, **do mais significativo ao menos** (30 bits para valores até 10⁹).

- **Maior `x ^ y`** com `y` na trie: em cada bit, tente ir pelo bit **oposto** (liga aquele bit do xor; `1000 > 0111`, então o bit alto manda); se não existir, vá pelo igual. O(30).
- **Maior xor de subarray** (CSES 1655): `xor(l..r) = p[r] ^ p[l-1]`. Bruta O(N³) → com prefixo xor O(N²) → fixando `r` e buscando o melhor `p[l-1]` na trie, **O(N·30)**. Insira `p[0] = 0` antes. Exemplo `5 1 5 9`: prefixos 0, 5, 4, 1, 8 → melhor `8 ^ 5 = 13` (= 1 ^ 5 ^ 9).
- **Maior xor de par**: insira um por um e consulte antes de inserir (The 67th XOR Problem).
- Variações: contar pares com `x ^ y < k` (descendo com contadores), k-ésimo menor xor, trie persistente para consultas em intervalo.

## Trie × hash × ordenação

| Pergunta | Melhor |
|---|---|
| prefixos de um conjunto, contagens por prefixo | trie |
| igualdade de trechos de uma mesma string | hash |
| menor/maior lexicográfico, LCP entre muitas strings | ordenação / suffix array |
| xor máximo | trie de bits |
| vários padrões ao mesmo tempo num texto | Aho-Corasick (trie + falhas) |
