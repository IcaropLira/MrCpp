---
title: Reconhecendo o problema pelo enunciado
summary: Palavras-chave e limites do enunciado que entregam a técnica — tabela "se aparecer X, pense em Y".
status: done
complexity: —
tags: reconhecimento, palavras-chave, estratégia, prova, teoria
---

## Se aparecer…, pense em…

| No enunciado | Pense em |
|---|---|
| "mínimo do máximo", "máximo do mínimo", "menor X tal que dá" | busca binária na resposta |
| "quantas maneiras… módulo 10⁹+7" | DP de contagem, combinatória, inclusão-exclusão |
| n ≤ 20 | bitmask (2ⁿ), n ≤ 40 meet in the middle |
| n ≤ 500 | O(n³): Floyd, DP de intervalos |
| n ≤ 5000 | O(n²) DP |
| n, q ≤ 2·10⁵ com intervalos | prefixo, BIT, segtree, sparse table, Mo (offline) |
| "subarray com soma/xor …" | prefixos + map/trie; dois ponteiros (não negativos) |
| "subsequência crescente" | LIS (O(n log n)), segtree por valor |
| "árvore" + "subárvore" | Euler tour, DP em árvore, small to large |
| "árvore" + "caminho entre u e v" | LCA, binary lifting, HLD |
| "todos os pares de vértices" numa árvore | contribuição de aresta, centroid |
| "para cada vértice como raiz" | rerooting |
| "remover uma aresta/vértice e o grafo desconecta" | pontes, articulações, bridge/block-cut tree |
| "tarefas com pré-requisitos" | ordenação topológica, DP em DAG |
| "menor caminho" com peso | Dijkstra (≥ 0), Bellman-Ford (negativo), 0-1 BFS |
| "menor caminho" + "pode usar k vezes um poder" | grafo de estados (camadas) |
| "conectar tudo com custo mínimo" | MST |
| "grupos/amizade/união" | DSU |
| "emparelhar", "atribuir", "cada um no máximo um" | matching / fluxo / Hungarian |
| "escolha verdadeiro/falso com restrições de 2 variáveis" | 2-SAT |
| "string" + "igual", "período", "palíndromo" | hash, KMP/Z, Manacher |
| "muitos padrões no texto" | Aho–Corasick |
| "prefixo" + "dicionário" ou "xor máximo" | trie |
| "substrings distintas", "k-ésima substring" | suffix array / automaton |
| "pontos", "polígono", "convexo" | produto vetorial, fecho, Pick |
| "distância de Manhattan" | rotação 45° (x + y, x − y) |
| "jogo, os dois jogam bem" | posições P/N, Grundy, Nim, minimax |
| "esperança", "probabilidade" | linearidade, indicadores, DP de esperança |
| "gcd/lcm/divisores de muitos números" | crivo, contagem por múltiplos, Möbius |
| "n até 10¹⁸" com recorrência | exponenciação de matriz, fórmula fechada |
| "k-ésimo menor" | busca binária + contagem, ordered_set, wavelet |
| "intervalos se sobrepõem" | ordenar por início/fim, varredura com eventos |
| "consultas e atualizações misturadas, pode ler tudo antes" | offline: ordenar, CDQ, divisão no tempo |
| "interativo" | busca binária/ternária; flush após cada pergunta |
| "permutação" | ciclos, inversões (BIT), ordem |
| "grade com obstáculos" | BFS, DP em grade, multifonte |

## Estratégia na prova (time)

1. Leia **todos** os enunciados nos primeiros minutos; ordene pela dificuldade percebida e pelo placar.
2. Antes de codar: escreva a ideia e a complexidade; confira com os limites.
3. Faça o exemplo à mão; pense nos casos de borda (n = 1, tudo igual, máximo).
4. WA: releia o enunciado, gere casos pequenos com brute force (stress test).
5. TLE: constante (I/O, map → vector, recursão), ou a complexidade está errada.
6. Travou 20–30 min sem progresso? Troque de problema ou de pessoa.
