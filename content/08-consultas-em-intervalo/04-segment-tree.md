---
title: Segment Tree
summary: Segment tree iterativa para qualquer operação associativa.
status: done
complexity: O(log n)
tags: segtree, consultas
---

## Ideia

Árvore em vetor de tamanho `2n`: as folhas ficam em `[n, 2n)`. A consulta sobe pelas bordas combinando só os nós inteiramente dentro do intervalo. Aceita soma, mínimo, máximo, mdc e qualquer operação associativa.

## Código

```cpp
template <class T, class F>
struct SegTree {
    int n; vector<T> t; T id; F f;
    SegTree(int n, T id, F f) : n(n), t(2 * n, id), id(id), f(f) {}
    void set(int i, T v) { for (t[i += n] = v; i > 1; i >>= 1) t[i >> 1] = f(t[i & ~1], t[i | 1]); }
    T query(int l, int r) { // [l, r)
        T a = id, b = id;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if (l & 1) a = f(a, t[l++]);
            if (r & 1) b = f(t[--r], b);
        }
        return f(a, b);
    }
};
```

## Uso

`SegTree seg(n, 0LL, [](ll a, ll b) { return a + b; });` Para mínimo, use `INT_MAX` como elemento neutro.
