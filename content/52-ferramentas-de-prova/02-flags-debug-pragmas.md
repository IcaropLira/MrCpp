---
title: Compilação, debug e pragmas
summary: Flags que acham bugs (sanitizers, -D_GLIBCXX_DEBUG), macro de debug, pragmas e cuidados.
status: done
complexity: —
tags: compilação, sanitizer, debug, pragma, flags
---

## Flags

```bash
# desenvolvimento: acha overflow, índice fora, uso de memória liberada
g++ -std=c++17 -O2 -Wall -Wextra -Wshadow -Wconversion -fsanitize=address,undefined -D_GLIBCXX_DEBUG -g sol.cpp -o sol
# como o juiz (rápido)
g++ -std=c++17 -O2 sol.cpp -o sol
# tempo e memória
/usr/bin/time -v ./sol < in.txt
```

- `-D_GLIBCXX_DEBUG`: `vector[]` fora do limite vira erro com mensagem (deixa lento — só para testar).
- `-fsanitize=undefined`: overflow de `int` com sinal, shift inválido.
- `ulimit -s unlimited` (Linux) para testar recursão profunda localmente — **o juiz pode não ter**.

## Macro de debug

```cpp
#ifdef LOCAL
#define dbg(...) cerr << "[" << #__VA_ARGS__ << "]: ", dbg_out(__VA_ARGS__)
template <class... T> void dbg_out(T... x) { ((cerr << x << ' '), ...); cerr << endl; }
#else
#define dbg(...)
#endif
// compile com -DLOCAL; no juiz some sozinho
```

## Pragmas (use com cautela)

```cpp
#pragma GCC optimize("O3,unroll-loops")
#pragma GCC target("avx2,bmi,bmi2,popcnt,lzcnt")   // pode dar RE se a máquina do juiz não suportar
```

## Built-ins de bits

| Função | O que faz |
|---|---|
| `__builtin_popcount(x)` / `ll` | nº de bits 1 |
| `__builtin_clz(x)` | zeros à esquerda (x > 0); `31 − clz` = ⌊log₂ x⌋ |
| `__builtin_ctz(x)` | zeros à direita (x > 0) = índice do LSB |
| `__lg(x)` | ⌊log₂ x⌋ |
| `x & -x` | LSB |
| `x & (x − 1)` | apaga o LSB; `== 0` ⇔ potência de 2 |
| `for (s = m; s; s = (s − 1) & m)` | submáscaras de m |

## Aleatoriedade

```cpp
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
long long r = uniform_int_distribution<long long>(l, r_)(rng);
shuffle(v.begin(), v.end(), rng);   // nunca rand() (RAND_MAX pode ser 32767)
```
