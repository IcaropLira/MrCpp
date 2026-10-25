---
title: Propagação preguiçosa (lazy)
summary: Soma em intervalo com adição em intervalo.
status: done
complexity: O(log n)
tags: segtree, lazy
---

## Ideia

Adições pendentes ficam no nó e só descem quando a consulta precisa dos filhos.

## Código

```cpp
struct Lazy {
    int n; vector<ll> s, z;
    Lazy(int n) : n(n), s(4 * n), z(4 * n) {}
    void push(int x, int l, int r) {
        if (!z[x]) return;
        int m = (l + r) / 2;
        s[2*x] += z[x] * (m - l + 1), z[2*x] += z[x];
        s[2*x+1] += z[x] * (r - m), z[2*x+1] += z[x];
        z[x] = 0;
    }
    void add(int a, int b, ll v, int x = 1, int l = 0, int r = -1) {
        if (r < 0) r = n - 1;
        if (b < l || r < a) return;
        if (a <= l && r <= b) { s[x] += v * (r - l + 1), z[x] += v; return; }
        push(x, l, r);
        int m = (l + r) / 2;
        add(a, b, v, 2*x, l, m), add(a, b, v, 2*x+1, m+1, r);
        s[x] = s[2*x] + s[2*x+1];
    }
    ll sum(int a, int b, int x = 1, int l = 0, int r = -1) {
        if (r < 0) r = n - 1;
        if (b < l || r < a) return 0;
        if (a <= l && r <= b) return s[x];
        push(x, l, r);
        int m = (l + r) / 2;
        return sum(a, b, 2*x, l, m) + sum(a, b, 2*x+1, m+1, r);
    }
};
```

## Uso

`Lazy t(n); t.add(l, r, v); t.sum(l, r);`
