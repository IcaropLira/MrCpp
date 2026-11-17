---
title: Inteiro modular (Mint)
summary: Struct que encapsula aritmética módulo MOD com operadores, potência e inverso.
status: done
complexity: O(1) por operação; pow e inv em O(log e)
tags: modular, struct, aritmética
---

## Ideia

Guarda o valor sempre normalizado em `[0, MOD)`. Soma e subtração usam ajuste condicional; a multiplicação promove para `long long`. O inverso vem do pequeno teorema de Fermat, então `MOD` precisa ser primo para `inv` e `/`.

## Código

```cpp
const int MOD = 998244353;

struct Mint {
    int v;
    Mint(ll x = 0) { x %= MOD; if (x < 0) x += MOD; v = (int)x; }
    Mint& operator+=(Mint o) { v += o.v; if (v >= MOD) v -= MOD; return *this; }
    Mint& operator-=(Mint o) { v -= o.v; if (v < 0) v += MOD; return *this; }
    Mint& operator*=(Mint o) { v = (int)((ll)v * o.v % MOD); return *this; }
    Mint pow(ll e) const {
        Mint r(1), b = *this;
        for (; e > 0; e >>= 1, b *= b) if (e & 1) r *= b;
        return r;
    }
    Mint inv() const { return pow(MOD - 2); }
    Mint& operator/=(Mint o) { return *this *= o.inv(); }
    Mint operator-() const { return Mint(-(ll)v); }
    friend Mint operator+(Mint a, Mint b) { return a += b; }
    friend Mint operator-(Mint a, Mint b) { return a -= b; }
    friend Mint operator*(Mint a, Mint b) { return a *= b; }
    friend Mint operator/(Mint a, Mint b) { return a /= b; }
    friend bool operator==(Mint a, Mint b) { return a.v == b.v; }
    friend bool operator!=(Mint a, Mint b) { return a.v != b.v; }
    friend bool operator<(Mint a, Mint b) { return a.v < b.v; }
    friend ostream& operator<<(ostream& o, Mint a) { return o << a.v; }
    friend istream& operator>>(istream& i, Mint& a) { ll x; i >> x; a = Mint(x); return i; }
};
```

## Uso

```cpp
Mint a = 5, b = a.pow(10) / 3;
cout << a * b + 1 << "\n";
vector<Mint> f(n + 1, 1);
for (int i = 1; i <= n; i++) f[i] = f[i - 1] * i;
```

## Complexidade e cuidados

- `MOD` deve ser primo para `inv` e `/`; para `MOD` composto use Euclides estendido.
- `MOD` até ~2^30 (soma de dois valores cabe em `int`); para módulos até 1e18 troque por `__int128`.
- `inv()` de zero devolve 0 sem erro; `pow(0)` devolve 1.
- O construtor aceita negativos e valores grandes (`Mint(-1) == MOD - 1`).
- A comparação `<` ordena pelo representante, não tem significado algébrico.
