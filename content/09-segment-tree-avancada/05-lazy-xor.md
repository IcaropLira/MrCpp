---
title: Lazy XOR — inverter intervalo e consultar XOR
summary: Atualização XOR em intervalo e consulta XOR em O(log n).
status: done
complexity: O(log n) por operação
tags: segtree, lazy propagation, xor, bitwise
---

## A sacada

A operação XOR é sua própria inversa: (x \oplus v \oplus v = x). Portanto, duas atualizações iguais se cancelam e a tag lazy pode ser acumulada com XOR.

Mas há um detalhe essencial: ao aplicar (v) a todos os elementos de um segmento, o XOR do segmento só muda se o tamanho do segmento for ímpar.

`xor(a[i] ^ v)` repetido `len` vezes resulta em:

- `seg[x] ^= v`, se `len` é ímpar;
- o XOR do nó permanece igual, se `len` é par.

A tag sempre recebe `lazy[x] ^= v`.

## Código — range XOR / range XOR

Convenção de intervalo inclusivo `[l,r]`, índices zero-based.

```cpp
struct LazyXor {
    int n;
    vector<int> seg, lazy;

    LazyXor(int n) : n(n), seg(4*n), lazy(4*n) {}

    void apply(int x, int l, int r, int v) {
        if ((r - l + 1) & 1) seg[x] ^= v;
        lazy[x] ^= v;
    }

    void push(int x, int l, int r) {
        if (!lazy[x] || l == r) return;
        int m = (l + r) / 2;
        apply(2*x, l, m, lazy[x]);
        apply(2*x+1, m+1, r, lazy[x]);
        lazy[x] = 0;
    }

    void build(const vector<int>& a, int x, int l, int r) {
        if (l == r) { seg[x] = a[l]; return; }
        int m = (l + r) / 2;
        build(a, 2*x, l, m);
        build(a, 2*x+1, m+1, r);
        seg[x] = seg[2*x] ^ seg[2*x+1];
    }

    void update(int a, int b, int v, int x, int l, int r) {
        if (b < l || r < a) return;
        if (a <= l && r <= b) { apply(x, l, r, v); return; }
        push(x, l, r);
        int m = (l + r) / 2;
        update(a, b, v, 2*x, l, m);
        update(a, b, v, 2*x+1, m+1, r);
        seg[x] = seg[2*x] ^ seg[2*x+1];
    }

    int query(int a, int b, int x, int l, int r) {
        if (b < l || r < a) return 0;
        if (a <= l && r <= b) return seg[x];
        push(x, l, r);
        int m = (l + r) / 2;
        return query(a, b, 2*x, l, m) ^ query(a, b, 2*x+1, m+1, r);
    }

    void update(int l, int r, int v) { update(l, r, v, 1, 0, n-1); }
    int query(int l, int r) { return query(l, r, 1, 0, n-1); }
};
```

Inicialize com `LazyXor st(n); st.build(a, 1, 0, n-1);`. Se `n=0` for permitido, trate antes de construir.

## Variações que caem bastante

- **Inverter um bit em um intervalo:** atualize com `v = 1 << bit`.
- **Inverter vários bits:** use uma máscara `v`.
- **Atualização em intervalo + XOR do intervalo:** exatamente a estrutura acima.
- **Atualização pontual + XOR em intervalo:** uma segment tree comum já resolve.
- **XOR de prefixo:** prefix XOR, sem árvore, quando não há atualizações.
- **Atualização XOR em intervalo + consulta de soma:** não use esta mesma agregação; mantenha contagens de bits por nó ou uma estrutura específica.

## Erros comuns

1. Esquecer a paridade do tamanho do segmento ao atualizar o valor agregado.
2. Usar `lazy += v`; a composição correta é `lazy ^= v`.
3. Retornar zero como identidade da operação XOR (aqui está correto; para soma também é zero, mas a operação é outra).
4. Misturar intervalo inclusivo com semiaberto.
5. Usar `1 << bit` quando o bit pode alcançar 31 ou mais; use `1LL << bit` e tipos de 64 bits.
