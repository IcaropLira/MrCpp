---
title: BIT / Fenwick — teoria
summary: Operação AND, LSB = x & −x, tabela de intervalos guardados, query por remoção de bits, update por soma do LSB, build e variações.
status: done
complexity: O(log n) por operação · memória O(n)
tags: bit, fenwick, lsb, and, prefix sum dinâmica, teoria
---

## Por que BIT se já existe segtree?

- O código da segtree não é tão rápido de codar.
- **Constante alta**: segtree é recursiva e a query desce em até ~4·log N nós.
- BIT = "prefix sum que aceita updates", com laços curtos e constante baixa.

## Operação AND (&)

Bit a bit: o bit da resposta é 1 só se **os dois** bits forem 1.

```
11 = 1011
13 = 1101
---------
 9 = 1001
```

## LSB (bit menos significativo)

- `LSB(x)` = o bit ligado mais à direita. `LSB(8) = LSB(1000) = 1000 = 8`; `LSB(11) = LSB(1011) = 0001 = 1`.
- **`LSB(x) = x & (-x)`** (complemento de dois: `-x = ~x + 1`). Ex.: `00001011 & 11110101 = 00000001`.

## O que cada índice guarda

O índice `i` guarda o intervalo de tamanho `LSB(i)` que **termina** em `i`: `[i - LSB(i) + 1, i]`.

| i | i & −i | intervalo |
|---|---|---|
| 1 | 1 | [1, 1] |
| 2 | 2 | [1, 2] |
| 3 | 1 | [3, 3] |
| 4 | 4 | [1, 4] |
| 5 | 1 | [5, 5] |
| 6 | 2 | [5, 6] |
| 7 | 1 | [7, 7] |
| 8 | 8 | [1, 8] |

## Query de prefixo [1, i]

Quebre `[1, i]` pelos bits de `i`: `[1, 6] = [1, 4] + [5, 6]`. Enquanto `atual ≠ 0`: `resp += BIT[atual]; atual -= LSB(atual)` (remove o menor bit).

Exemplo da aula (a = 5 3 10 1 4 6 8 1, BIT = 5 8 10 19 4 10 8 38): `query(6)`: atual 6 (110) → +BIT[6] = 10; atual 4 (100) → +BIT[4] = 19 → **29**.

`soma(L, R) = pref(R) - pref(L - 1)`.

## Update na posição i

Atualize todos os intervalos que **contêm** `i`: o próximo é sempre `i + LSB(i)`.
`update(5)` mexe em `{5, 6, 8}`: `5 = 0101`, `6 = 0110 = 5 + 1`, `8 = 1000 = 6 + 2`.
Enquanto `atual ≤ n`: `BIT[atual] += x; atual += LSB(atual)`.

Exemplo da aula: `UPDATE(5, 11)` → BIT[5]: 4→15, BIT[6]: 10→21, BIT[8]: 38→49.

## Build

- Simples: `n` updates → O(n log n).
- Linear: `bit[i] += a[i]; j = i + LSB(i); if (j ≤ n) bit[j] += bit[i]` → O(n).

## Variações

| Necessidade | Como |
|---|---|
| Ponto + soma de intervalo | BIT padrão |
| Soma em intervalo + valor de um ponto | BIT sobre diferenças: `add(l, x)`, `add(r+1, -x)`, ponto = `pref(i)` |
| Soma em intervalo + soma de intervalo | duas BITs (1-indexado). `add(l, r, v)`: `B1.add(l, v)`, `B1.add(r+1, -v)`, `B2.add(l, v·(l-1))`, `B2.add(r+1, -v·r)`. `pref(x) = B1(x)·x - B2(x)` |
| Contar elementos ≤ x dinamicamente | BIT de **frequência** indexada pelo valor (comprima!) |
| k-ésimo menor | descida binária na BIT em O(log n) |
| Máximo de prefixo com valores que só **aumentam** | BIT de máximo (não aceita diminuir) |
| 2D | laços aninhados: O(log n · log m) |

## Problemas da aula

- **Super Computer**: `F i` inverte bit, `C l r` conta 1s. Contar 1s em `[1, i]` + prefixo → com updates, BIT.
- **Inversion Count**: para cada `i`, quantos `j < i` com `A[j] > A[i]`. Contribuição de `i` = soma das frequências dos valores **maiores** (intervalo contínuo `[A[i]+1, MAX]` → prefixo dinâmico). Valores até 10⁹ → **compressão de coordenadas**.
