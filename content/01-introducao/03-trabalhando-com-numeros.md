---
title: Trabalhando com números
summary: Overflow, divisão com negativos, módulo, comparação de reais e impressão de __int128.
status: done
complexity: O(1)
tags: introdução, números, overflow, ponto flutuante
---

## Ideia

Quatro armadilhas respondem pela maioria dos erros "misteriosos": (1) `int` estoura em `2·10^9`, use `long long` (até `9·10^18`) ou `__int128`; (2) a divisão inteira trunca em direção a zero, então `-7 / 2 == -3`, e `%` pode ser negativo; (3) `double` não representa `0,1` exatamente, compare com tolerância; (4) `__int128` não tem `cout`: converta para texto.

## Código

```cpp
// divisão com arredondamento para baixo e para cima, valendo para negativos (b != 0)
ll fdiv(ll a, ll b) { return a / b - ((a % b != 0) && ((a < 0) != (b < 0))); }
ll cdiv(ll a, ll b) { return a / b + ((a % b != 0) && ((a < 0) == (b < 0))); }

// resto em [0, m), m > 0
ll mod(ll a, ll m) { return ((a % m) + m) % m; }

// operações que avisam o overflow em vez de estourar
bool soma_ok(ll a, ll b, ll& r) { return !__builtin_add_overflow(a, b, &r); }
bool mul_ok(ll a, ll b, ll& r) { return !__builtin_mul_overflow(a, b, &r); }

// a * b mod m sem overflow, para m até 9e18
ll mulmod(ll a, ll b, ll m) { return (ll)((__int128)a * b % m); }

string str128(__int128 x) {
    if (x == 0) return "0";
    bool neg = x < 0;
    string s;
    unsigned __int128 u = neg ? -(unsigned __int128)x : x;
    while (u) s += char('0' + (int)(u % 10)), u /= 10;
    if (neg) s += '-';
    reverse(s.begin(), s.end());
    return s;
}

// igualdade de reais com tolerância relativa/absoluta
bool igual(double a, double b, double eps = 1e-9) {
    return fabs(a - b) <= eps * max({1.0, fabs(a), fabs(b)});
}
```

## Complexidade e cuidados

- `abs` e `llabs`: `abs(int)` em um `long long` trunca; use `llabs` ou `std::abs` com o tipo certo.
- Arredondar: `llround(x)` (para o mais próximo) e não `(ll)(x + 0.5)`, que erra em negativos.
- `1 << 40` é overflow de `int`; escreva `1LL << 40`.
- `long long` com `INT_MAX` como infinito: use `LLONG_MAX / 4` quando for somar distâncias para não estourar.
