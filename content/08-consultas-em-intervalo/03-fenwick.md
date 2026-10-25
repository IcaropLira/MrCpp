---
title: Árvore de Fenwick (BIT)
summary: Soma em intervalo com atualização pontual.
status: done
complexity: O(log n)
tags: bit, fenwick, consultas
---

## Ideia

Cada posição guarda a soma de um bloco cujo tamanho é o bit menos significativo do índice. `i & -i` isola esse bit.

## Código

```cpp
struct BIT {
    int n; vector<ll> t;
    BIT(int n) : n(n), t(n + 1) {}
    void add(int i, ll v) { for (++i; i <= n; i += i & -i) t[i] += v; }
    ll query(int i) { ll s = 0; for (++i; i > 0; i -= i & -i) s += t[i]; return s; } // [0, i]
    ll query(int l, int r) { return query(r) - (l ? query(l - 1) : 0); }
};
```

## Uso

`BIT bit(n); bit.add(i, x); bit.query(l, r);`
