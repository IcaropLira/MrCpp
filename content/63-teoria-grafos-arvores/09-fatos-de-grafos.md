---
title: Fatos e teoremas de grafos
summary: Graus, árvores, bipartidos, Euler e Hamilton, planaridade, coloração, sequências de graus, torneios, contagens e complementos.
status: done
complexity: —
tags: teoremas, euler, hamilton, bipartido, planar, coloração, árvores, grafos, teoria
---

## Básico

- **Handshake**: `Σ grau = 2E` → o nº de vértices de grau ímpar é par.
- Grafo simples com V vértices: no máximo `V(V-1)/2` arestas; com mais de `V - 1` arestas tem ciclo; conexo precisa de ≥ `V - 1`.
- Componentes de uma floresta = `V - E`.

## Árvores (equivalentes, para V vértices)

Conexa e acíclica ⇔ conexa com `V - 1` arestas ⇔ acíclica com `V - 1` arestas ⇔ caminho único entre cada par ⇔ conexa e cada aresta é ponte.
- **Diâmetro**: BFS de qualquer vértice → o mais distante `a`; BFS de `a` → o mais distante `b`; `dist(a, b)` é o diâmetro (só com pesos ≥ 0).
- **Centro** (minimiza a excentricidade): meio do diâmetro; 1 ou 2 vértices. Remover folhas em camadas também acha.
- **Centroide**: remover deixa componentes de tamanho ≤ V/2; sempre existe (1 ou 2).
- Árvore binária cheia com `L` folhas tem `L - 1` nós internos.

## Bipartidos

Bipartido ⇔ **sem ciclo ímpar** ⇔ 2-colorível (BFS/DFS colorindo). Árvores são bipartidas.

## Euler (passar por todas as arestas uma vez)

| Grafo | Circuito euleriano | Caminho euleriano |
|---|---|---|
| não dirigido | conexo (nas arestas) e **todos os graus pares** | conexo e **exatamente 0 ou 2** vértices de grau ímpar (começa num deles) |
| dirigido | conexo e `in = out` em todos | conexo, um vértice com `out - in = 1` (início), um com `in - out = 1` (fim), o resto igual |

Construção: Hierholzer, O(E). Sequência de De Bruijn de ordem n no alfabeto k = circuito euleriano no grafo de (n−1)-uplas; tamanho `kⁿ`.

## Hamilton (passar por todos os vértices uma vez)

NP-difícil em geral → DP em bitmask O(2ⁿ n²) para n ≤ 20. Condições suficientes: **Dirac** (grau ≥ n/2 para todo v, n ≥ 3), **Ore** (`deg u + deg v ≥ n` para todo par não adjacente). Todo **torneio** tem caminho hamiltoniano (inserção ordenada / ordenação por "ganha de").

## Planares

- **Euler**: `V - E + F = 2` (conexo; F conta a face externa); com C componentes: `V - E + F = 1 + C`.
- Simples e planar com V ≥ 3: `E ≤ 3V - 6`; sem triângulos (ex.: bipartido): `E ≤ 2V - 4`. Logo `K5` e `K3,3` não são planares (Kuratowski).
- Todo planar tem vértice de grau ≤ 5; é 4-colorível (e 5-colorível facilmente).

## Coloração

- Número cromático χ ≥ tamanho da maior clique; guloso usa ≤ Δ + 1 cores; **Brooks**: χ ≤ Δ, exceto completo e ciclo ímpar.
- 2-colorir: bipartição. 3-colorir: NP-difícil (bitmask para n pequeno; χ de grafo com n ≤ 20 em O(2ⁿ n) com inclusão-exclusão).
- Coloração de arestas (**Vizing**): Δ ou Δ + 1 cores; bipartido: exatamente Δ (König).

## Sequências de graus

- **Erdős–Gallai**: `d₁ ≥ … ≥ dₙ` é gráfica ⇔ soma par e, para todo k, `Σ_{i≤k} dᵢ ≤ k(k-1) + Σ_{i>k} min(dᵢ, k)`.
- **Havel–Hakimi** (construtivo): ligue o de maior grau aos próximos de maiores graus, repita.
- Árvore com graus dados existe ⇔ todos ≥ 1 e `Σ d = 2(n - 1)`.

## Contagens

- Árvores rotuladas: `n^(n-2)` (Cayley); com graus `dᵢ` fixos: `(n-2)! / Π (dᵢ - 1)!` (Prüfer).
- Árvores geradoras: Kirchhoff (determinante da Laplaciana).
- Grafos rotulados simples: `2^(V(V-1)/2)`.
- Florestas enraizadas rotuladas com n vértices: `(n+1)^(n-1)`.

## Complemento e cliques

- Conjunto independente em G = clique no complemento. Cobertura de vértices = V − independente.
- Clique máxima / independente máximo: NP-difícil → meet in the middle O(2^(n/2)) ou Bron–Kerbosch para n ≤ 40–50.
- Turán: grafo sem `K_(r+1)` tem no máximo `(1 - 1/r) n²/2` arestas (sem triângulo: ≤ n²/4).
