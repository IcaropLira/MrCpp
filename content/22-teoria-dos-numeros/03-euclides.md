---
title: MDC, MMC e Euclides estendido
summary: MDC, MMC e Euclides estendido.
status: done
complexity: O(log n)
tags: mdc, mmc, euclides
---

## Ideia

`gcd` e `lcm` já vêm no `<numeric>`. A versão estendida acha `x` e `y` com `a·x + b·y = gcd`.

## Código

```cpp
ll egcd(ll a, ll b, ll& x, ll& y) { // a*x + b*y = gcd(a, b)
    if (!b) return x = 1, y = 0, a;
    ll g = egcd(b, a % b, y, x);
    y -= a / b * x;
    return g;
}
```

## Uso

`gcd(a, b)` e `lcm(a, b)` do C++17.
