---
title: Min Queue
summary: Fila FIFO com consulta de mínimo em O(1) amortizado usando duas pilhas.
status: done
complexity: O(1) amortizado por operação
tags: fila, minimum queue, monotonic queue
---

## Quando usar

Quando elementos entram e saem em ordem FIFO e precisamos consultar o mínimo atual, por exemplo em janelas deslizantes.

## Código

~~~cpp
struct MinQueue {
    using T = long long;
    stack<pair<T,T>> in, out;

    bool empty() const { return in.empty() && out.empty(); }

    void push(T x) {
        T mn = in.empty() ? x : min(x, in.top().second);
        in.push({x, mn});
    }

    void transfer() {
        if (!out.empty()) return;
        while (!in.empty()) {
            T x = in.top().first;
            in.pop();
            T mn = out.empty() ? x : min(x, out.top().second);
            out.push({x, mn});
        }
    }

    void pop() {
        transfer();
        assert(!out.empty());
        out.pop();
    }

    T get_min() const {
        assert(!empty());
        if (in.empty()) return out.top().second;
        if (out.empty()) return in.top().second;
        return min(in.top().second, out.top().second);
    }
};
~~~

## Cuidados

- pop remove o elemento mais antigo.
- Cada elemento é transferido no máximo uma vez, portanto O(1) amortizado por operação.
- A estrutura não é uma deque: não permite remover o elemento mais novo.
- Para máximo, troque min por max; para gcd, use a operação associativa correspondente.
