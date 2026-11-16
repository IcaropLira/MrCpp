---
title: Implicit Treap
summary: Sequência dinâmica com split/merge, inserção, remoção, reversão e soma em intervalo.
status: done
complexity: O(log n) esperado por operação
tags: treap, implicit treap, sequência, lazy
---

## Quando usar

Quando precisamos editar uma sequência por posição: inserir/remover, inverter subintervalos, consultar agregados e mover blocos. A posição é implícita no tamanho das subárvores.

## Código

~~~cpp
struct ImplicitTreap {
    struct Node {
        int val, sz = 1;
        unsigned pri;
        long long sum;
        bool rev = false;
        Node *l = nullptr, *r = nullptr;
        Node(int v, unsigned p) : val(v), pri(p), sum(v) {}
    };

    using P = Node*;
    mt19937 rng{(unsigned)chrono::steady_clock::now().time_since_epoch().count()};

    int size(P t) { return t ? t->sz : 0; }
    long long sum(P t) { return t ? t->sum : 0; }

    void pull(P t) {
        if (!t) return;
        t->sz = 1 + size(t->l) + size(t->r);
        t->sum = t->val + sum(t->l) + sum(t->r);
    }

    void apply_rev(P t) {
        if (!t) return;
        swap(t->l, t->r);
        t->rev ^= 1;
    }

    void push(P t) {
        if (t && t->rev) {
            apply_rev(t->l);
            apply_rev(t->r);
            t->rev = false;
        }
    }

    void split(P t, int k, P& a, P& b) {
        if (!t) { a = b = nullptr; return; }
        push(t);
        if (size(t->l) >= k) {
            split(t->l, k, a, t->l);
            b = t;
        } else {
            split(t->r, k - size(t->l) - 1, t->r, b);
            a = t;
        }
        pull(t);
    }

    P merge(P a, P b) {
        if (!a || !b) return a ? a : b;
        if (a->pri > b->pri) {
            push(a);
            a->r = merge(a->r, b);
            pull(a);
            return a;
        }
        push(b);
        b->l = merge(a, b->l);
        pull(b);
        return b;
    }

    void insert(P& root, int pos, int value) {
        P a, b;
        split(root, pos, a, b);
        P x = new Node(value, rng());
        root = merge(merge(a, x), b);
    }

    void reverse(P& root, int l, int r) { // [l,r)
        P a, b, c;
        split(root, l, a, b);
        split(b, r - l, b, c);
        apply_rev(b);
        root = merge(a, merge(b, c));
    }

    long long query_sum(P& root, int l, int r) { // [l,r)
        P a, b, c;
        split(root, l, a, b);
        split(b, r - l, b, c);
        long long ans = sum(b);
        root = merge(a, merge(b, c));
        return ans;
    }
};
~~~

## Cuidados

- split(t,k) separa os primeiros k elementos; posições e intervalos são 0-based e semiabertos.
- A prioridade aleatória dá altura O(log n) esperada, não garantida.
- A ficha demonstra soma e reversão; para mínimo, máximo ou hash, atualize pull e a propagação lazy.
- Implemente destruição dos nós ou use arena de memória se a estrutura for recriada muitas vezes.
