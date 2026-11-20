---
title: Teoria dos números
summary: Primos, crivo, fatoração, divisores, gcd/lcm, φ de Euler, Möbius, funções multiplicativas e fatos clássicos.
status: done
complexity: crivo O(n log log n) · fatoração O(√n)
tags: primos, crivo, divisores, gcd, euler, mobius, teoria
---

## GCD / LCM

- `gcd(a, b) = gcd(b, a mod b)`; O(log min(a, b)). `lcm(a, b) = a / gcd(a, b) · b` (divida antes para não estourar).
- `gcd(a, 0) = a`; `gcd` é associativo (serve como merge de segtree/sparse table).
- `gcd(F_m, F_n) = F_gcd(m,n)` (Fibonacci). `gcd(2^a - 1, 2^b - 1) = 2^gcd(a,b) - 1`.
- Bézout: existem x, y com `ax + by = gcd(a, b)`.

## Primos

- Teste por divisão até `√n`: O(√n). Miller–Rabin determinístico para 64 bits com bases {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}.
- **Crivo de Eratóstenes**: O(n log log n). **Crivo linear** guarda o menor fator primo `spf[x]` → fatoração em O(log x).
- π(n) ≈ n / ln n. Primos ≤ 10⁶: 78 498. Gap entre primos consecutivos ≤ 10⁹ é < 300.
- Pollard rho: fatoração de 64 bits em ~O(n^(1/4)).

## Divisores

Se `n = Π pᵢ^eᵢ`:
- Quantidade: `d(n) = Π (eᵢ + 1)`. Máx: 240 (n ≤ 10⁶), 1 344 (n ≤ 10⁹), 103 680 (n ≤ 10¹⁸).
- Soma: `σ(n) = Π (pᵢ^(eᵢ+1) - 1)/(pᵢ - 1)`.
- Produto dos divisores: `n^(d(n)/2)`.
- Enumerar todos os divisores: até `√n`, pares `(d, n/d)`.
- Divisores de todos os números até n: para cada d, os múltiplos → O(n log n).

## Função φ de Euler

`φ(n)` = quantos `1 ≤ k ≤ n` com `gcd(k, n) = 1`. `φ(n) = n · Π (1 - 1/p)`. `φ(p) = p - 1`; `Σ_{d|n} φ(d) = n`. Teorema de Euler: `a^φ(n) ≡ 1 (mod n)` se `gcd(a,n)=1`.
Quantidade de frações irredutíveis `a/b` com `1 ≤ a < b ≤ n`: `Σ_{b=2}^n φ(b)`.

## Möbius

`μ(n) = 0` se tem fator quadrado; senão `(-1)^(nº de primos)`. `Σ_{d|n} μ(d) = [n = 1]`.
Inversão: `g(n) = Σ_{d|n} f(d)` ⇔ `f(n) = Σ_{d|n} μ(d)·g(n/d)`.
Pares coprimos em `[1, n]²`: `Σ_d μ(d)·⌊n/d⌋²`.

## Funções multiplicativas

`f(ab) = f(a)f(b)` se `gcd(a,b) = 1`: φ, μ, d, σ. Calculáveis para todos até n com crivo linear.

## Fatos clássicos

- Pequeno de Fermat: `a^p ≡ a (mod p)`.
- Wilson: `(p-1)! ≡ -1 (mod p)`.
- Lucas: `C(n, k) mod p = Π C(nᵢ, kᵢ) mod p` (dígitos na base p).
- Kummer: a maior potência de p que divide `C(n, k)` = nº de "vai-um" ao somar k e n−k na base p.
- Legendre: expoente de p em `n!` = `Σ ⌊n / pⁱ⌋`.
- Goldbach (verificado para o alcance de contest): todo par > 2 é soma de 2 primos; todo ímpar > 5 é soma de 3 primos.
- Soma dos dígitos ≡ número (mod 9). Divisibilidade por 11: soma alternada.
- Raiz primitiva existe mod `1, 2, 4, pᵏ, 2pᵏ`.
