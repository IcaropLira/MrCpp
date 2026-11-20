---
title: Geometria disfarçada, dicas de prova e para ir além
summary: Quando o enunciado parece geometria mas vira grafo/DP/estrutura; tópicos avançados; papel quadriculado; listas e referências.
status: done
complexity: —
tags: geometria, modelagem, referências, kactl, teoria
---

## Geometria disfarçada

Em muitos problemas a conta geométrica é a parte fácil: o trabalho está na **modelagem**. O enunciado parece geometria e vira grafo, DP, ordenação ou estrutura de dados.

| Enunciado | Vira |
|---|---|
| Círculos que se tocam | cada círculo = vértice; tocar = aresta → DSU ou BFS |
| Distância de Manhattan | `s = x + y`, `d = x - y` → só máximos e mínimos |
| Pontos em retângulos | varredura por x + BIT/segtree para contar em y |
| Retângulo/segmento "visível" | eventos ordenados (sweep line) |
| Polígono B dentro de A convexo | testar só os vértices de B (A convexo) |

**Pergunta-chave: qual estrutura conhecida aparece depois de trocar o desenho por números?**

## Para ir além

| Tópico | Ideia |
|---|---|
| Interseção de segmentos | quatro orient + caso colinear (CSES 2190) |
| Pontos inteiros no polígono | teorema de Pick com area2 (CSES 2193) |
| Par de pontos mais próximo | divisão e conquista ou varredura (CSES 2194) |
| Ordenação por ângulo polar | comparar com o produto vetorial, sem atan2 |
| Corte de polígono por uma reta | manter o lado esquerdo da reta |
| Menor círculo que cobre n pontos | algoritmo de Welzl, O(n) esperado |
| Manhattan ↔ Chebyshev | a troca `s = x + y`, `d = x - y` em geral |
| Diâmetro do conjunto | fecho + rotating calipers |

## Dicas de prova

- **Papel quadriculado**: com coordenadas inteiras, cada ponto cai num cruzamento da grade. Desenhe o caso antes de codar.
- Os casos de borda aparecem no papel: pontos **colineares**, vértice na **altura do raio**, polígono **horário**.
- Confira `orient` e área à mão no exemplo.
- **Confira o notebook antes da prova**: geometria é onde um sinal trocado custa caro.

## Notebook: KACTL

Notebook da KTH; a seção de geometria traz, prontos e testados: ponto e vetor, lado de uma reta, interseção de segmentos, área de polígono, ponto em polígono, fecho convexo, diâmetro do fecho e menor círculo envolvente.

## Problemas para treinar

- Geometria: CF 1949 I · Gym 106178 L · Gym 102307 E · Gym 103185 I · CSES seção Geometry (Polygon Area etc.) · Gym 101845 D · ABC 286 H · AtCoder Tags: Geometry.
- Geometria plana (treino de fórmulas): lista da Unicamp (ime.unicamp.br) · Art of Problem Solving (Alcumus).

## Referências

- *Competitive Programming 3* (Steven e Felix Halim), cap. 7 — (Computational) Geometry.
- *Geometria Analítica* (Steinbruch e Winterle) — vetores, retas e cônicas.
- Handbook de geometria (Victor Lecomte) · USACO Guide (Platinum: geometria) · blog Manhattan ↔ Chebyshev (Wandoka, Codeforces) · Torneo Argentino de Programación · aula de geometria do curso da UFMG (YouTube) · aula de convex hull (YouTube) · VisuAlgo (ponto em polígono) · MathWorld: Geometry.
