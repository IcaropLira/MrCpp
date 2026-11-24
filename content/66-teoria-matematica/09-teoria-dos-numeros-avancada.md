---
title: Teoria dos números — avançado
summary: Ordem e raiz primitiva, resíduos quadráticos (Legendre/Euler), soma de dois e quatro quadrados, Pell, números perfeitos, funções aritméticas, Stern-Brocot, frações contínuas e fatos para contest.
status: done
complexity: —
tags: raiz primitiva, resíduo quadrático, legendre, pell, soma de quadrados, stern-brocot, teoria
---

## Ordem e raízes primitivas

- **Ordem** de a mod n (gcd = 1): menor k > 0 com `aᵏ ≡ 1`. A ordem **divide** φ(n). Para achá-la: comece com φ(n) e divida por cada primo p de φ(n) enquanto `a^(k/p) ≡ 1`.
- **Raiz primitiva** g: ordem = φ(n). Existe ⇔ n ∈ {1, 2, 4, pᵏ, 2pᵏ}. Teste: g é raiz primitiva mod p ⇔ `g^((p-1)/q) ≠ 1` para todo primo q | p − 1. Menores costumam ser pequenas (tente 2, 3, 5…). Há `φ(φ(n))` raízes primitivas.
- Com raiz primitiva, todo x ≠ 0 é `gᵏ` (**logaritmo discreto**, baby-step giant-step O(√p)). Equações `xᵏ ≡ a` viram lineares nos expoentes.

## Resíduos quadráticos (p primo ímpar)

- a é resíduo quadrático ⇔ existe x com `x² ≡ a (mod p)`. Há `(p - 1)/2` resíduos não nulos.
- **Critério de Euler**: `a^((p-1)/2) ≡ 1` (resíduo) ou `-1` (não resíduo). Símbolo de Legendre `(a/p)`.
- `-1` é resíduo ⇔ `p ≡ 1 (mod 4)`; `2` é resíduo ⇔ `p ≡ ±1 (mod 8)`.
- Reciprocidade quadrática: `(p/q)(q/p) = (-1)^(((p-1)/2)((q-1)/2))`.
- Raiz quadrada mod p: `p ≡ 3 (mod 4)` ⇒ `x = a^((p+1)/4)`; geral: Tonelli–Shanks / Cipolla.

## Somas de quadrados

- **Dois quadrados** (Fermat): n é soma de dois quadrados ⇔ todo primo `p ≡ 3 (mod 4)` aparece com expoente **par**. Primo p ímpar: ⇔ `p ≡ 1 (mod 4)`.
- **Três quadrados** (Legendre): n é soma de três quadrados ⇔ n não é da forma `4ᵃ(8b + 7)`.
- **Quatro quadrados** (Lagrange): todo natural é soma de 4 quadrados.
- Ternas pitagóricas primitivas: `(m² - n², 2mn, m² + n²)`, `m > n > 0`, gcd = 1, paridades diferentes.

## Equações clássicas

- **Pell** `x² - D y² = 1` (D não quadrado): infinitas soluções; a mínima vem da fração contínua de √D; as demais: `(x₁ + y₁√D)ᵏ`.
- Diofantina linear `ax + by = c`: Euclides estendido (ver Aritmética modular). Nº de soluções não negativas: conte o intervalo de k.
- **Frobenius (moedas)**: com a, b coprimos, o maior valor **não** representável como `ax + by` (x, y ≥ 0) é `ab - a - b`; há `(a - 1)(b - 1)/2` valores não representáveis.

## Funções aritméticas e fatos

- **Números perfeitos** pares: `2ᵖ⁻¹(2ᵖ - 1)` com `2ᵖ - 1` primo (Mersenne): 6, 28, 496, 8128, 33 550 336.
- `Σ_{d|n} φ(d) = n`; `Σ_{d|n} μ(d) = [n = 1]`; `Σ_{k ≤ n, gcd(k,n)=1} k = n·φ(n)/2` (n > 1).
- `Σ_{i=1}^{n} gcd(i, n) = Σ_{d|n} d·φ(n/d)`.
- `Σ_{i=1}^{n} Σ_{j=1}^{n} gcd(i, j) = Σ_d φ(d)·⌊n/d⌋²`.
- Nº de pares ordenados (a, b) com `lcm(a, b) = n`: `Π (2eᵢ + 1)`.
- Densidade de pares coprimos: `6/π² ≈ 0,608`.
- Postulado de Bertrand: sempre existe primo entre n e 2n.
- `n⁵ ≡ n (mod 30)`; quadrados mod 4 ∈ {0, 1}; mod 8 ∈ {0, 1, 4}; cubos mod 9 ∈ {0, 1, 8}.
- Último dígito de potências: ciclo de tamanho ≤ 4 (mod 10). Expoente gigante: reduza mod φ(m) (cuidado com gcd ≠ 1: use `e mod φ + φ` se `e ≥ log₂ m`).

## Stern–Brocot e frações

- Toda fração positiva irredutível aparece uma vez na árvore de Stern–Brocot (mediantes `(a+c)/(b+d)`); a busca da fração com menor denominador num intervalo desce por ela (com saltos para ser O(log)).
- **Farey**: frações de denominador ≤ n entre 0 e 1; vizinhas `a/b < c/d` satisfazem `bc - ad = 1`; tamanho `1 + Σ φ(k)`.
- **Frações contínuas**: `[a₀; a₁, a₂, …]`; convergentes são as melhores aproximações racionais.
