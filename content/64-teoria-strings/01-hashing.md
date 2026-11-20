---
title: String hashing — teoria
summary: Da soma ao polinômio, hash de prefixos, hash de trecho em O(1), aritmética modular, probabilidade de colisão e hash duplo.
status: done
complexity: O(n) pré · O(1) por trecho
tags: hash, polinomial, rabin-karp, colisão, módulo, teoria
---

## Problema motivador

String `s` (n ≤ 10⁵) e q ≤ 10⁵ perguntas `(i, j, k)`: os trechos `s[i..i+k-1]` e `s[j..j+k-1]` são iguais? Comparar letra a letra (dois ponteiros) custa até O(k) → **O(n·q) = 10¹⁰**.

**Ideia**: trocar cada trecho por um **número** e comparar dois números em vez de k letras.

## Tentativa 1: soma das letras (A→1, B→2, R→3)

`BAR = 2 + 1 + 3 = 6` (prefix sum dá O(1)). Dois problemas:
1. Soma é **comutativa**: `BAR` e `RAB` empatam.
2. **Colisões** frequentes: `AR` e `BB` somam 4.

## Tentativa 2: polinômio

Num polinômio a **ordem dos coeficientes importa**: `3·10² + 2·10 + 5 = 325` ≠ `352` ≠ `235`. Escolha uma base `B` (aleatória e **maior que o alfabeto**; na aula, B = 10 para visualizar):

`hash(s) = s[0]·B^(n-1) + s[1]·B^(n-2) + … + s[n-1]·B⁰`

`BAR = 213`, `RAB = 312`, `AR = 13`, `BB = 22` — resolvido.

## Hash de prefixos (como prefix sum)

```
H[0] = 0
H[i] = H[i-1]·B + s[i-1]          (BARBARA: 2, 21, 213, 2132, 21321, 213213, 2132131)
```

## Hash de um trecho [l, r] (1-indexado)

`H[r] - H[l-1]` **não funciona**: `H[l-1]` foi multiplicado pela base `r - l + 1` vezes a mais. Logo:

**`hash(l, r) = H[r] - H[l-1]·B^(r-l+1)`**

(0-indexado meio aberto `[l, r)`: `H[r] - H[l]·B^(r-l)`.)

Exemplo: `hash(1,3) = 213 - 0 = 213`; `hash(4,6) = 213213 - 213·1000 = 213` → iguais (SIM). `hash(2,4) = 2132 - 2·1000 = 132` ≠ 213 → NÃO.

## Aritmética modular

Uma string de 30 letras já não cabe em 64 bits. Faça tudo **mod M** primo grande (ex.: 10⁹+7):

- Probabilidade de dois hashes diferentes colidirem ≈ **1/M**.
- Comparando `h` hashes entre si: ≈ **h²/2M** (paradoxo do aniversário) → com `h ≈ √M` a colisão é **alta**. Com M = 10⁹+7 e h ≈ 10⁴–10⁵, colisão quase certa.
- **Hash duplo**: dois primos M1, M2 ~10⁹ (ex.: 10⁹+7 e 10⁹+9); compare os dois hashes. Colisão provável só com `h ≈ 10⁹`.
- Alternativa: um módulo `2⁶¹ - 1` com multiplicação em `__int128`.
- Subtração: some `M` antes de tirar o resto (em C++ `%` de negativo é negativo).
- Pré-compute `P[i] = B^i mod M`.

## Aplicações

| Problema | Ideia |
|---|---|
| Trechos iguais | `hash(i, i+k) == hash(j, j+k)` |
| String matching (Rabin–Karp) | hash de cada janela de tamanho m contra o do padrão; O(n + m) |
| Maior palíndromo | hash da string e da reversa; trecho `[l, r)` é palíndromo ⇔ hash igual ao trecho espelhado `[n-r, n-l)` da reversa. O melhor tamanho cresce no máximo 2 por posição → O(n) (ou busca binária por centro, O(n log n)) |
| Bordas | prefixo de tamanho L == sufixo de tamanho L |
| LCP de dois sufixos | busca binária no tamanho com hash: O(log n) |
| Comparar lexicograficamente dois trechos | LCP por busca binária + comparar o próximo caractere |
| Substrings distintas de tamanho k | inserir hashes num set (cuidado com colisões: hash duplo) |
| Período | `s[0..n-p) == s[p..n)` |

## Implementações de referência

C++: github.com/brunomaletta (Biblioteca UFMG) · github.com/lucasbrenner · Python: PyRival. Leituras: CP-Algorithms (String Hashing), blog do dmkozyrev ("Rolling hash and 8 interesting problems"), USACO Guide (Hashing).
