---
title: Hash em árvores e isomorfismo — teoria
summary: Linearização por parênteses, forma canônica bottom-up com filhos ordenados, hash polinomial da concatenação e ids AHU.
status: done
complexity: O(n log n)
tags: isomorfismo, árvore, hash, forma canônica, ahu, teoria
---

## Problema (CSES 1700)

Duas árvores enraizadas em 1 com n nós: são **isomórficas** (dá para desenhar iguais)? Existe um mapeamento dos nós tal que as subárvores correspondentes têm a mesma estrutura; como são enraizadas, **raiz mapeia em raiz**.

## Representação única de uma subárvore

Linearização do Euler tour: `(` ao entrar, `)` ao sair. Se dois nós geram a **mesma sequência**, suas subárvores são estruturalmente idênticas.

**Problema**: a ordem de visita dos filhos muda a sequência (`( ( ( ) ) ( ) )` vs `( ( ) ( ( ) ) )`).

## Forma canônica (bottom-up)

1. Calcule a sequência dos filhos antes da do pai.
2. **Ordene os filhos** pela sua sequência (ordem lexicográfica — qualquer ordem fixa serve).
3. Sequência do nó = `(` + concatenação dos filhos ordenados + `)`. Folha = `()`.

Árvores isomórficas ⇔ mesma sequência na raiz. Mas ordenar strings custa `O(N·L·log N)` e L pode ser O(N) → **O(N² log N)**: lento.

## Hash da sequência

Mapeie `(` → 1 e `)` → 2 e use hash polinomial. A construção é uma **concatenação**:

```
H(X · Y) = H(X) · B^|Y| + H(Y)
```

Para o nó `v`, com `siz[v]` = tamanho da sequência já montada:
- Para cada filho `c` (ordenados pelo hash): `H[v] = H[v]·B^siz[c] + H[c]`; `siz[v] += siz[c]`.
- `(` na frente: `H[v] += 1·B^siz[v]`.
- `)` no fim: `H[v] = H[v]·B + 2`; `siz[v] += 2`.

Exemplo da aula (B = 10): folhas `H = 12`; raiz com dois filhos-folha: `12 → 1212 → 11212 → 112122`.

Ordenar por hash (números) basta para ter a **mesma ordem para estruturas iguais** → `O(N log N)`. Use hash duplo/módulo grande.

## Sem colisão: ids canônicos (AHU)

Dê a cada **multiconjunto ordenado de ids dos filhos** um id inteiro via `map<vector<int>, int>` **compartilhado entre as duas árvores**. Folha = id do vetor vazio. Isomórficas ⇔ mesmo id da raiz. O(n log n), determinístico.

## Árvores não enraizadas

Ache o(s) **centro(s)** (1 ou 2, removendo folhas em camadas); compare enraizando no centro (com 2 centros, teste as combinações ou enraíze na aresta central).
