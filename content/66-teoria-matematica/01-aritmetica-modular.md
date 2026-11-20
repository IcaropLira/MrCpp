---
title: Aritmética modular
summary: Propriedades do mod, inverso (Fermat/Euclides estendido), exponenciação rápida, divisão modular, fatoriais e armadilhas.
status: done
complexity: O(log MOD) por inverso/potência
tags: módulo, inverso modular, fermat, exponenciação, teoria
---

## Propriedades

- `(a + b) mod m = ((a mod m) + (b mod m)) mod m`; idem `-` e `·`.
- **Divisão não distribui**: `a / b mod m = a · b⁻¹ mod m`, com `b⁻¹` existindo ⇔ `gcd(b, m) = 1`.
- Em C++, `a % m` com `a < 0` é negativo → `((a % m) + m) % m`.
- `a · b` com `a, b < 10⁹+7` cabe em `long long`; com `m ~ 10¹⁸` use `__int128`.

## Inverso modular

- **Fermat** (m primo): `a⁻¹ ≡ a^(m-2) (mod m)`.
- **Euler** (gcd(a, m) = 1): `a^φ(m) ≡ 1` → `a⁻¹ = a^(φ(m)-1)`.
- **Euclides estendido**: acha `x, y` com `ax + my = gcd(a, m)`; se gcd = 1, `x mod m` é o inverso. Funciona com m não primo.
- Inversos de 1..n em O(n): `inv[i] = -(m/i) · inv[m mod i] mod m`.
- Fatoriais inversos: `ifat[n] = fat[n]⁻¹`, `ifat[i-1] = ifat[i] · i`.

## Exponenciação rápida

`aᵇ`: se `b` par, `(a^(b/2))²`; se ímpar, `a · a^(b-1)`. O(log b). Também para matrizes (recorrências lineares) e para multiplicação "a·b mod m" com somas.

**Redução de expoente**: `aᵇ mod m` com `b` enorme e `gcd(a, m) = 1`: `a^(b mod φ(m))`. Com m primo: `a^(b mod (m-1))` (cuidado com `a ≡ 0`).

## Módulos comuns

- `10⁹ + 7` e `10⁹ + 9`: primos (hash duplo).
- `998 244 353 = 119·2²³ + 1`: primo com raiz 3 → NTT.
- `2⁶¹ - 1`: primo de Mersenne (hash com `__int128`).

## Teorema Chinês do Resto (CRT)

`x ≡ aᵢ (mod mᵢ)` com `mᵢ` coprimos dois a dois tem solução única mod `M = Π mᵢ`: `x = Σ aᵢ · Mᵢ · (Mᵢ⁻¹ mod mᵢ)`, `Mᵢ = M/mᵢ`. Não coprimos: combine dois a dois com Euclides estendido (existe ⇔ `a₁ ≡ a₂ mod gcd(m₁, m₂)`).

## Equação diofantina `ax + by = c`

Tem solução ⇔ `gcd(a, b) | c`. Uma solução: `(x₀·c/g, y₀·c/g)`; todas: `x = x₀' + k·b/g`, `y = y₀' - k·a/g`.

## Contas úteis

- Número de múltiplos de `d` em `[1, n]`: `⌊n/d⌋`; em `[l, r]`: `⌊r/d⌋ - ⌊(l-1)/d⌋`.
- `⌈a/b⌉ = (a + b - 1) / b` (a, b > 0).
- Valores distintos de `⌊n/i⌋`: no máximo `2√n` (division trick).
