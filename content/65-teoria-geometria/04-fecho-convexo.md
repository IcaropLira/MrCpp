---
title: Fecho convexo (Andrew / monotone chain)
summary: Definição, utilidade, "só curvas à esquerda", algoritmo de Andrew passo a passo, colineares e casos degenerados.
status: done
complexity: O(n log n)
tags: convex hull, fecho convexo, andrew, monotone chain, teoria
---

## Definição

Fecho convexo = o **menor polígono convexo que cobre todos os pontos** (imagem: elástico solto em volta de pregos — encosta só nos pontos de fora). n ≤ 2·10⁵, |x|, |y| ≤ 10⁹.

## Para que serve

- Caminho mais curto contornando um obstáculo passa pelos **cantos do fecho**.
- **Par de pontos mais distante**: as duas pontas são sempre vértices do fecho (rotating calipers).
- O fecho guarda só a borda: o miolo nunca é resposta para "mais longe" ou "contorno".
- Base de: menor retângulo/largura, CHT em DP, interseção de semiplanos.

## Só curvas à esquerda

Percorrendo a borda no sentido anti-horário, toda curva é à esquerda. Uma **curva à direita denuncia um ponto do miolo** (ex.: `orient(2, 4, 6) = -4 < 0` → o 4 não está no fecho).

## Algoritmo de Andrew

1. Ordene por `x` (empate: menor `y`); remova repetidos.
2. **Parte de baixo**: varra da esquerda para a direita com uma pilha; antes de empilhar `p`, **tire o topo enquanto (penúltimo, topo, p) não vira à esquerda** (`orient ≤ 0`).
3. **Parte de cima**: a mesma varredura, da direita para a esquerda.
4. Fecho = baixo + cima, **sem repetir as pontas** (tire o último de cada).

Ordenar custa O(n log n); cada ponto entra e sai da pilha no máximo uma vez → varredura O(n).

Exemplo da aula (7 pontos (0,2) (1,0) (2,4) (3,1) (4,4) (5,0) (6,2), numerados 1..7): baixo = 1 2 6 7, cima = 7 5 3 1 → fecho **1 2 6 7 5 3** anti-horário; o 4 fica de fora.

## Colineares e degenerados

- `orient ≤ 0` no while → **descarta** pontos no meio dos lados.
- `orient < 0` → **mantém** (CSES 2195 pede). Mas se **todos** forem colineares, as duas metades ficam iguais e pontos se repetem (`1 2 3 2`): trate à parte (o enunciado do CSES garante área positiva).
- `n ≤ 2` (após remover repetidos): o fecho são os próprios pontos.

## Outros algoritmos

- **Graham scan**: ordena por ângulo em torno do ponto mais baixo (ordenação angular por cross, sem `atan2`).
- **Gift wrapping (Jarvis)**: O(n·h), bom se o fecho tem poucos pontos.
- Fecho **dinâmico** (inserções): set de metades superior/inferior.
