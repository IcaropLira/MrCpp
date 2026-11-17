---
title: Fração racional
summary: Struct de fração sempre normalizada por gcd, com comparação exata via __int128.
status: done
complexity: O(log) por operação (gcd)
tags: fração, racional, gcd, int128
---

## Ideia

Mantém `n/d` com `d > 0` e `gcd(|n|, d) = 1`, então a igualdade é comparar os dois campos. As contas intermediárias são feitas em `__int128` e só depois reduzidas, de modo que a comparação por produto cruzado nunca estoura para numeradores e denominadores em `long long`.

## Código

```cpp
typedef __int128 i128;

i128 gcd128(i128 a, i128 b) { while (b) { i128 t = a % b; a = b; b = t; } return a; }

struct Frac {
    ll n = 0, d = 1;
    Frac() {}
    Frac(i128 a, i128 b = 1) { // b != 0
        if (b < 0) a = -a, b = -b;
        i128 g = gcd128(a < 0 ? -a : a, b);
        n = (ll)(a / g); d = (ll)(b / g);
    }
    friend Frac operator+(Frac a, Frac b) { return Frac((i128)a.n * b.d + (i128)b.n * a.d, (i128)a.d * b.d); }
    friend Frac operator-(Frac a, Frac b) { return Frac((i128)a.n * b.d - (i128)b.n * a.d, (i128)a.d * b.d); }
    friend Frac operator*(Frac a, Frac b) { return Frac((i128)a.n * b.n, (i128)a.d * b.d); }
    friend Frac operator/(Frac a, Frac b) { return Frac((i128)a.n * b.d, (i128)a.d * b.n); } // b.n != 0
    friend bool operator==(Frac a, Frac b) { return a.n == b.n && a.d == b.d; }
    friend bool operator!=(Frac a, Frac b) { return !(a == b); }
    friend bool operator<(Frac a, Frac b) { return (i128)a.n * b.d < (i128)b.n * a.d; }
    friend bool operator>(Frac a, Frac b) { return b < a; }
    friend bool operator<=(Frac a, Frac b) { return !(b < a); }
    friend bool operator>=(Frac a, Frac b) { return !(a < b); }
    friend ostream& operator<<(ostream& o, Frac a) { return o << a.n << "/" << a.d; }
};
```

## Uso

```cpp
Frac a(1, 3), b(-2, 6);
cout << (a == -b ? "oposto" : "diferente") << " " << a + b << " " << a * b << "\n";
```

## Complexidade e cuidados

- Operadores em `O(log)` pelo gcd; a comparação é `O(1)` e exata.
- O resultado reduzido precisa caber em `long long`; somas repetidas com denominadores coprimos crescem rápido.
- Denominador zero não é validado; divisão por fração nula é indefinida.
- Não há `operator-` unário; use `Frac(0) - a`.
- Para ordenar ou comparar inclinações de vetores, prefira comparar produtos cruzados direto.
