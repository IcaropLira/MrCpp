---
title: Link-Cut Tree
summary: Mantém uma floresta dinâmica com operações de ligar, cortar e consultar caminhos.
status: done
complexity: O(log n) amortizado por operação
tags: arvores, floresta dinamica, splay
---

## Quando usar

Quando a própria árvore muda durante as consultas: ligar dois componentes, remover uma aresta e consultar/agregar valores no caminho entre dois vértices. Não substitui HLD em uma árvore estática; é a opção para topologia dinâmica.

## Código

```cpp
struct LinkCut {
    struct Node {
        int ch[2] = {0, 0}, p = 0;
        long long val = 0, sum = 0;
        bool rev = false;
    };

    vector<Node> t;

    explicit LinkCut(int n) : t(n + 1) {}

    bool is_root(int x) const {
        int p = t[x].p;
        return !p || (t[p].ch[0] != x && t[p].ch[1] != x);
    }

    void pull(int x) {
        t[x].sum = t[x].val + t[t[x].ch[0]].sum + t[t[x].ch[1]].sum;
    }

    void apply_rev(int x) {
        if (!x) return;
        swap(t[x].ch[0], t[x].ch[1]);
        t[x].rev ^= 1;
    }

    void push(int x) {
        if (!t[x].rev) return;
        apply_rev(t[x].ch[0]);
        apply_rev(t[x].ch[1]);
        t[x].rev = false;
    }

    void rotate(int x) {
        int p = t[x].p, g = t[p].p;
        int dx = (t[p].ch[1] == x), b = t[x].ch[dx ^ 1];
        if (!is_root(p)) t[g].ch[t[g].ch[1] == p] = x;
        t[x].p = g;
        t[x].ch[dx ^ 1] = p; t[p].p = x;
        t[p].ch[dx] = b;
        if (b) t[b].p = p;
        pull(p); pull(x);
    }

    void splay(int x) {
        vector<int> st{x};
        for (int y = x; !is_root(y); ) {
            y = t[y].p;
            st.push_back(y);
        }
        for (int i = (int)st.size() - 1; i >= 0; --i) push(st[i]);

        while (!is_root(x)) {
            int p = t[x].p, g = t[p].p;
            if (!is_root(p)) {
                bool zigzig = (t[p].ch[0] == x) == (t[g].ch[0] == p);
                rotate(zigzig ? p : x);
            }
            rotate(x);
        }
    }

    void access(int x) {
        int last = 0;
        for (int y = x; y; y = t[y].p) {
            splay(y);
            t[y].ch[1] = last;
            pull(y);
            last = y;
        }
        splay(x);
    }

    void make_root(int x) {
        access(x);
        apply_rev(x);
    }

    int find_root(int x) {
        access(x);
        while (true) {
            push(x);
            if (!t[x].ch[0]) break;
            x = t[x].ch[0];
        }
        splay(x);
        return x;
    }

    bool connected(int x, int y) {
        return find_root(x) == find_root(y);
    }

    bool link(int x, int y) {
        make_root(x);
        if (find_root(y) == x) return false;
        t[x].p = y;
        return true;
    }

    bool cut(int x, int y) {
        make_root(x);
        access(y);
        if (t[y].ch[0] != x || t[x].ch[1]) return false;
        t[y].ch[0] = 0;
        t[x].p = 0;
        pull(y);
        return true;
    }

    long long path_sum(int x, int y) {
        make_root(x);
        access(y);
        return t[y].sum;
    }

    void set_value(int x, long long v) {
        access(x);
        t[x].val = v;
        pull(x);
    }
};
```

- Vértices numerados de 1 a n; o índice 0 é sentinela com soma zero.
- `link(x,y)` só liga componentes diferentes; `cut(x,y)` remove a aresta direta x-y, não uma aresta arbitrária do caminho.
- `path_sum(x,y)` expõe o caminho e soma os valores dos vértices.
- Para mínimo, máximo, XOR ou outro agregado, substitua `sum` e `pull` pela operação associativa desejada.
- Todas as operações são amortizadas O(log n); a estrutura mantém uma floresta, não um grafo geral.
