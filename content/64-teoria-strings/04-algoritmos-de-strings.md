---
title: Algoritmos de strings — teoria e fatos
summary: Função prefixo (KMP), Z, Manacher, suffix array + LCP, autômato de sufixos, Aho-Corasick, eertree, periodicidade e Lyndon.
status: done
complexity: O(n) ou O(n log n)
tags: kmp, z, manacher, suffix array, lcp, suffix automaton, aho-corasick, período, teoria
---

## Função prefixo (KMP)

`π[i]` = tamanho da maior **borda** (prefixo = sufixo, próprio) de `s[0..i]`.
- Buscar `p` em `t`: `π` de `p + '#' + t`; ocorrência onde `π = |p|`. O(n + m).
- Todas as bordas de s: `π[n-1], π[π[n-1]-1], …`.
- **Menor período**: `p = n - π[n-1]`; s é potência de um bloco ⇔ `n % p == 0`.
- Contar ocorrências de cada prefixo: acumular `cnt[π[i]]` e propagar `cnt[π[j-1]] += cnt[j]` de trás para frente.
- Autômato KMP: transições para cada letra (útil em DP "string que não contém p").

## Função Z

`z[i]` = maior prefixo comum entre `s` e `s[i..]`. Busca: `z` de `p + '#' + t`. Período `p` ⇔ `i + z[i] == n` com `i = p`. O(n).

## Manacher

Raio do maior palíndromo centrado em cada posição (ímpar e par; ou intercale `#`) em O(n). Nº de substrings palíndromas = Σ raios. Alternativa: hash + busca binária (O(n log n)) — ver aula de hashing.

## Suffix array + LCP

- SA: sufixos ordenados. O(n log n) (dobrando) ou O(n log² n) com sort.
- LCP (Kasai) O(n): `lcp[i]` = prefixo comum entre `SA[i]` e `SA[i+1]`.
- **Substrings distintas** = `n(n+1)/2 - Σ lcp`.
- LCP de dois sufixos quaisquer = mínimo de `lcp` no intervalo (sparse table).
- Maior substring repetida = max lcp; que aparece ≥ k vezes = máximo do mínimo em janelas de k−1.
- Maior substring comum de A e B: SA de `A + '#' + B`, max lcp entre sufixos de lados diferentes.
- Buscar padrão: busca binária no SA, O(m log n).

## Autômato de sufixos (SAM)

Menor DFA que aceita todos os sufixos; ≤ `2n - 1` estados, ≤ `3n - 4` transições; construção online O(n·Σ) ou O(n log Σ).
- `len[v]`, link de sufixo forma uma árvore (árvore de sufixos do reverso).
- Substrings distintas = `Σ (len[v] - len[link[v]])`.
- Nº de ocorrências de cada estado: propague contagens pela árvore de links (ordem por `len` decrescente).
- Maior substring comum: ande com a segunda string no SAM da primeira.
- k-ésima substring lexicográfica: DP de caminhos no DAG.

## Aho–Corasick

Trie dos padrões + links de falha (BFS) = KMP para vários padrões. Busca em O(|texto| + Σ|padrões| + ocorrências). Contagem por padrão: acumule visitas e propague pela árvore de falhas. DP "texto de tamanho n que não contém nenhum padrão" sobre os estados do autômato.

## Eertree (árvore de palíndromos)

Um nó por palíndromo distinto (≤ n + 2 nós); O(n). Conta palíndromos distintos e ocorrências.

## Periodicidade e combinatória de palavras

- **Lema de Fine–Wilf**: se p e q são períodos e `p + q - gcd(p, q) ≤ n`, então `gcd(p, q)` também é período.
- Todos os períodos = `n -` (tamanhos das bordas).
- Rotação lexicograficamente mínima: Booth / Duval em O(n) (ou SA de s+s).
- **Fatoração de Lyndon** (Duval): s = w₁ ≥ w₂ ≥ … com cada wᵢ de Lyndon (estritamente menor que suas rotações). O(n).
- Nº de palíndromos distintos numa string de tamanho n ≤ n.
- Strings de tamanho n sobre k letras: `kⁿ`; colares (rotação): Burnside.

## Qual usar?

| Pergunta | Ferramenta |
|---|---|
| achar um padrão | KMP / Z / hash |
| vários padrões | Aho–Corasick |
| igualdade/LCP de trechos arbitrários | hash (+ busca binária) ou SA + sparse table |
| palíndromos | Manacher (ou eertree para distintos) |
| substrings distintas, k-ésima, ocorrências de todas | SA + LCP ou SAM |
| período / bordas | prefix function |
| prefixos de um dicionário | trie |
