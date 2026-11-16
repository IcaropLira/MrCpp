---
title: Half-Plane Intersection
summary: Interseção de semiplanos por ordenação angular e deque.
status: todo
complexity: O(n log n)
tags: geometria, half-plane, semiplanos, deque
---

## Problema

Cada reta orientada define um semiplano à sua esquerda. Queremos a interseção de todos esses semiplanos, frequentemente para obter um polígono convexo.

## Esquema do algoritmo

1. Ordene as retas pelo ângulo da direção.
2. Para retas paralelas com a mesma direção, mantenha apenas a mais restritiva.
3. Mantenha um deque de retas e interseções consecutivas.
4. Ao inserir uma reta, remova do fim enquanto a última interseção estiver fora do novo semiplano; faça o mesmo no início.
5. Feche o deque removendo extremos incompatíveis.

## Cuidados

- É necessário tratar paralelismo, semiplanos ilimitados, interseções vazias e degeneradas.
- EPS e ordenação angular precisam ser consistentes.
- Uma implementação curta sem esses casos costuma falhar em testes de borda; esta ficha registra o algoritmo e as condições, mas não apresenta snippet de produção.
