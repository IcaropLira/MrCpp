---
title: Segment Tree Beats — chmin e soma
summary: Atualização a[i] = min(a[i], x) em intervalo e consulta de soma.
status: done
complexity: O(log n) amortizado por operação
tags: segtree, beats, range chmin
---

## Quando usar

Quando há `range chmin` (ou seja, limitar todos os valores do intervalo a no máximo x) junto com consultas de soma. Uma lazy comum não consegue resumir a atualização apenas com a soma.

## Ideia

Guarde soma, maior valor, segundo maior valor distinto e quantidade de ocorrências do maior. Se x >= segundo maior, só o maior precisa mudar; caso contrário, desça para os filhos.

## Código

```cpp
struct SegTreeBeats {
    struct Node {
        long long sum = 0;
        long long mx1 = LLONG_MIN, mx2 = LLONG_MIN;
        int cnt = 0;
    };

    int n;
    vector<Node> st;

    SegTreeBeats(const vector<long long>& a) : n((int)a.size()), st(4 * n) {
        build(1, 0, n - 1, a);
    }

    void pull(int p) {
        auto &x = st[p], &l = st[p * 2], &r = st[p * 2 + 1];
        x.sum = l.sum + r.sum;
        x.mx1 = max(l.mx1, r.mx1);
        x.cnt = (l.mx1 == x.mx1 ? l.cnt : 0) +
                (r.mx1 == x.mx1 ? r.cnt : 0);
        x.mx2 = max(l.mx1 == x.mx1 ? l.mx2 : l.mx1,
                    r.mx1 == x.mx1 ? r.mx2 : r.mx1);
    }

    void build(int p, int l, int r, const vector<long long>& a) {
        if (l == r) {
            st[p] = {a[l], a[l], LLONG_MIN, 1};
            return;
        }
        int m = (l + r) / 2;
        build(p * 2, l, m, a);
        build(p * 2 + 1, m + 1, r, a);
        pull(p);
    }

    void apply_chmin(int p, long long x) {
        if (x >= st[p].mx1) return;
        st[p].sum += (x - st[p].mx1) * st[p].cnt;
        st[p].mx1 = x;
    }

    void push(int p) {
        apply_chmin(p * 2, st[p].mx1);
        apply_chmin(p * 2 + 1, st[p].mx1);
    }

    void chmin(int a, int b, long long x, int p, int l, int r) {
        if (r < a || b < l || st[p].mx1 <= x) return;
        if (a <= l && r <= b && st[p].mx2 < x) {
            apply_chmin(p, x);
            return;
        }
        if (l == r) return;
        push(p);
        int m = (l + r) / 2;
        chmin(a, b, x, p * 2, l, m);
        chmin(a, b, x, p * 2 + 1, m + 1, r);
        pull(p);
    }

    long long query_sum(int a, int b, int p, int l, int r) {
        if (r < a || b < l) return 0;
        if (a <= l && r <= b) return st[p].sum;
        push(p);
        int m = (l + r) / 2;
        return query_sum(a, b, p * 2, l, m) +
               query_sum(a, b, p * 2 + 1, m + 1, r);
    }

    void chmin(int l, int r, long long x) {
        if (l <= r) chmin(l, r, x, 1, 0, n - 1);
    }

    long long sum(int l, int r) {
        return l <= r ? query_sum(l, r, 1, 0, n - 1) : 0;
    }
};
```

- Intervalos inclusivos e índices 0-based.
- Requer vetor não vazio; valores e somas devem caber em `long long`.
- Esta ficha implementa somente `range chmin + range sum). Para `chmax`, adição e outras operações, a estrutura precisa de metadados e regras adicionais.
- A complexidade é amortizada; não interprete como garantia simples de O(log n) para toda generalização de Beats.
