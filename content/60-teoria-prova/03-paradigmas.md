---
title: Paradigmas e macetes de resolução
summary: O roteiro das aulas (motivador → ingênuo → gargalo → estrutura) e o catálogo de truques que transformam O(n²) em O(n log n).
status: done
complexity: —
tags: paradigmas, macetes, técnicas, modelagem, teoria
---

## O roteiro de toda aula (use na prova)

1. **Problema motivador**: entenda o que é pedido com o exemplo.
2. **Solução ingênua**: escreva a força bruta (mesmo que lenta) — ela vira o brute force de teste.
3. **Qual o problema dessa solução?** Ache o gargalo: qual pergunta está sendo respondida repetidas vezes?
4. **Troque o gargalo por uma estrutura**: prefixo, segtree, BIT, trie, hash, LCA, deque…
5. Confira a complexidade nova contra os limites.

## Catálogo de transformações

| Gargalo | Troca por | Aula |
|---|---|---|
| Soma de intervalo sem update | prefix sum | Segtree, DP |
| Soma de intervalo com update pontual | BIT / segtree | BIT, Segtree |
| Update em intervalo + consulta | lazy propagation (ou BIT de diferenças) | Lazy |
| Somar em intervalo offline, ler tudo no fim | vetor de diferenças | Euler Tour (Ki) |
| Consulta numa **subárvore** | Euler tour → intervalo `[tin, tout]` | Euler Tour |
| Consulta num **caminho** raiz→v | Euler tour + range update em `[tin, tout]` + ponto | Euler Tour (Path Queries) |
| Caminho entre dois vértices | LCA (`dist = d[a] + d[b] - 2 d[lca]`) | LCA |
| Contar caminhos que passam por cada vértice | diferença em árvore (`+1 a, +1 b, -1 lca, -1 pai(lca)`) | LCA |
| Subir k níveis | binary lifting | LCA |
| Comparar strings/trechos | hash (O(1) por trecho) | Hashing |
| Comparar estruturas de árvore | forma canônica / hash de árvore | Hashing |
| Prefixos de um conjunto de palavras | trie | Trie |
| Maior xor de par / subarray | trie de bits + prefixo xor | Trie |
| Juntar conjuntos repetidamente | small to large | Small to Large |
| DP com transição sobre faixa de **valores** | segtree/BIT indexada pelo valor (comprimido) | DP |
| DP com mínimo numa janela deslizante | deque monotônica | DP (Rudolf) |
| DP em todas as raízes | rerooting | DP em árvore |
| DP em grafo dirigido acíclico | ordem topológica | Topológica |
| Contar caminhos mínimos | Dijkstra + DAG de arestas ótimas | Topológica |
| Grafo com O(n²) arestas "todos com todos do grupo" | vértice auxiliar por grupo | Vértices Auxiliares |
| Peso no vértice | dividir em `v_in → v_out` | Vértices Auxiliares |
| Restrição "usou no máximo K vezes" / "tem um cupom" | grafo de estados (camadas) | Vértices Auxiliares |
| Aresta crítica para conectividade | pontes (tin/low) | Pontes |
| Distância de Manhattan máxima | `s = x + y`, `d = x - y` | Geometria |
| Teste de lado / ângulo / área | produto vetorial / escalar com inteiros | Geometria |
| Muitas consultas "ponto no convexo" | busca binária no leque | Geometria |
| Valores grandes (10⁹) mas só importa a ordem | compressão de coordenadas | BIT |

## Macetes gerais

- **Técnica da contribuição**: em vez de somar por resposta, some quanto cada elemento/aresta contribui (inversões: quantos maiores à esquerda; soma de distâncias: cada aresta contribui `sub · (n - sub)`).
- **Fixe um lado**: fixe `r` e pergunte qual o melhor `l` (subarray de xor máximo; dois ponteiros).
- **Pense ao contrário**: inverter arestas (Endless Walk), processar consultas de trás para frente, contar o complemento.
- **Offline**: se as consultas podem ser reordenadas, ordene-as (por fim do intervalo, por valor…).
- **Ordem de processamento importa**: em DP, garanta que os estados usados já estão prontos (filhos antes do pai; ordem topológica; valores menores antes).
- **Pull vs push**: `dp[i] = Σ dp[anteriores]` (puxa) ou `dp[to] += dp[v]` (empurra). Em DAG, empurrar na ordem topológica é natural.
- **Busca binária na resposta**: se "dá para fazer com X?" é monótono em X.
- **Igualdade de multiconjunto/estrutura**: ordene ou use forma canônica antes de comparar (isomorfismo).
- **Evite float**: compare quadrados (`d²` contra `r²`), use `orient` em vez de inclinação.
- **Desenhe** (papel quadriculado para geometria; árvore pequena para DP em árvore).

## Modelagem: "qual estrutura aparece depois de trocar o desenho por números?"

- Círculos que se tocam → vértices + arestas → DSU/BFS.
- Pessoas com gostos em comum → vértices auxiliares por gosto.
- Tarefas com pré-requisito → DAG → topológica.
- "Andar para sempre" → alcançar ciclo.
- Remover uma aresta para separar → pontes.
- Pontos em retângulos → varredura em x + BIT em y.
