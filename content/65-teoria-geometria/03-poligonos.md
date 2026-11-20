---
title: Polígonos — área e ponto dentro
summary: Convexo × côncavo, área por produto vetorial e fórmula do laço, perímetro, ponto em convexo O(n) e O(log n), ray casting e borda.
status: done
complexity: O(n) · O(log n) por consulta no convexo
tags: polígono, shoelace, área, ray casting, ponto em polígono, convexo, teoria
---

## Convexo × côncavo

Percorrendo no sentido anti-horário, calcule o "selo" de cada vértice = sinal de `orient(p[i-1], p[i], p[i+1])`. **Convexo ⇔ todos os selos são +** (ou todos −, se horário). Um selo − = reentrância (côncavo).

## Área do triângulo

`AB × AC` = área do paralelogramo → triângulo = **metade**. Sem altura e sem raiz.
Ex.: A, AB = (4,1), AC = (1,3): `4·3 - 1·1 = 11` → área 5,5. Sinal de `orient`: anti-horário > 0.

## Área do polígono

- **Leque** a partir de P1: um triângulo por lado. Ex. P1=(1,1), P2=(5,1), P3=(6,4), P4=(2,4): T1 = 12, T2 = 12 → 2·área = 24 → área 12.
- **Fórmula do laço (shoelace)**: o ponto fixo vira a origem:

  **`2·Área = Σ cross(Pᵢ, Pᵢ₊₁)`** (índices circulares). Com sinal, vale também para **côncavo** (o que fica fora se cancela: verde soma, vermelho subtrai).
  Ex.: −4 + 14 + 16 − 2 = 24.
- Área = `|area2| / 2`; `area2 > 0` ⇔ anti-horário (use para descobrir/forçar a orientação).
- Perímetro: soma de `√dist2(Pᵢ, Pᵢ₊₁)`.
- **Pick** (vértices inteiros): `A = I + B/2 - 1`, `I` = pontos inteiros internos, `B` = na borda; `B = Σ gcd(|dx|, |dy|)` das arestas. Logo `I = (2A - B + 2) / 2` (CSES 2193).
- Centroide: `Cx = Σ (xᵢ + xᵢ₊₁)·cross(Pᵢ, Pᵢ₊₁) / (6A)` (idem y, com A com sinal).

## Ponto dentro de polígono **convexo** — O(n)

Polígono anti-horário: `q` está dentro (ou na borda) ⇔ `orient(p[i], p[i+1], q) ≥ 0` para **toda** aresta. Uma aresta com `orient < 0` basta para "fora".
Ex.: r = (7,4): `orient((7,2),(5,5),(7,4)) = -4 < 0` → fora.

## Muitas consultas no convexo — O(log n)

Com n = 10⁵ vértices e 10⁵ pontos, O(n) por ponto = 10¹⁰. **Observação**: as diagonais que saem de `p0` cortam o polígono em fatias (triângulos `p0, p[i], p[i+1]`) que estão **em ordem de ângulo** em volta de `p0` → busca binária.

1. **Filtro**: se `orient(p0, p1, q) < 0` ou `orient(p0, p[n-1], q) > 0`, está fora do leque → fora.
2. `lo = 1, hi = n - 1`; enquanto `hi - lo > 1`: `mid`; se `orient(p0, p[mid], q) ≥ 0`, `q` está depois de `p[mid]` → `lo = mid`; senão `hi = mid`.
3. Fatia `(p0, p[lo], p[lo+1])`: decide com **um** orient na aresta de fora: dentro ⇔ `orient(p[lo], p[lo+1], q) ≥ 0`.

Casos de borda: sobre `p0→p1` ou `p0→p[n-1]` dá orient 0 e passa no filtro (a última conta decide; borda = dentro). `q = p0` vira vértice → dentro. Requisitos: **estritamente convexo e anti-horário** (horário: inverta a lista).

**Estritamente dentro** (borda = fora, ex. CF 166B): troque só as 3 comparações de borda — filtro `≤ 0` / `≥ 0`, teste final `> 0`. A busca binária não muda (ponto sobre uma diagonal interna está estritamente dentro).

## Polígono qualquer (côncavo): ray casting

O teste do convexo **falha**: na reentrância, um ponto de dentro fica à direita de uma aresta.

Lance um raio de `p` para a direita; cada vez que cruza a borda, troca dentro ↔ fora; longe à direita está fora ⇒ **ímpar = dentro**.

Quando uma aresta `a → b` conta:
- Ela cruza a altura de `p` ⇔ **exatamente uma ponta acima** de `p`: `(a.y > p.y) != (b.y > p.y)` (meio aberto: um vértice na altura de `p` não conta duas vezes).
- O cruzamento está **à direita** de `p` ⇔ `(orient(a, b, p) > 0) == (a aresta sobe)`.

**Borda primeiro**: na borda a paridade não tem significado (o raio começa em cima dela; ex. (6,3) na aresta (6,0)→(6,5) daria OUTSIDE). Teste cada aresta: `orient(a,b,p) = 0` **e** `dot(a - p, b - p) ≤ 0` (está na reta e entre as pontas). Só inteiros.

## Visualização

VisuAlgo tem animação de ponto em polígono.
