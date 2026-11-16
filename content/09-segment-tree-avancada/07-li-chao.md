---
title: Li Chao Tree
summary: Mantém o mínimo de um conjunto de retas e consulta em x.
status: done
complexity: O(log C) por inserção e consulta
tags: cht, li chao, dp otimizada
---

## Quando usar

DP otimizada por retas, por exemplo quando cada estado adiciona uma função linear e uma consulta pede o menor valor em um x. Use a Li Chao quando as inclinações chegam em qualquer ordem; a CHT deque exige monotonicidade.

## Código

```cpp
struct Line {
    long long m = 0, b = LLONG_MAX;
    long long eval(long long x) const { return m * x + b; }
};

struct LiChao {
    vector<long long> xs;
    vector<Line> tree;
    vector<char> has;

    explicit LiChao(vector<long long> coords) : xs(move(coords)) {
        sort(xs.begin(), xs.end());
        xs.erase(unique(xs.begin(), xs.end()), xs.end());
        tree.resize(4 * xs.size());
        has.assign(4 * xs.size(), false);
    }

    void add(Line nw, int p, int l, int r) {
        if (!has[p]) {
            tree[p] = nw;
            has[p] = true;
            return;
        }

        int mid = (l + r) / 2;
        bool left = nw.eval(xs[l]) < tree[p].eval(xs[l]);
        bool middle = nw.eval(xs[mid]) < tree[p].eval(xs[mid]);

        if (middle) swap(nw, tree[p]);
        if (l == r) return;

        if (left != middle) add(nw, p * 2, l, mid);
        else add(nw, p * 2 + 1, mid + 1, r);
    }

    void add(long long m, long long b) {
        if (!xs.empty()) add({m, b}, 1, 0, (int)xs.size() - 1);
    }

    long long query(int x, int p, int l, int r) const {
        long long ans = has[p] ? tree[p].eval(xs[x]) : LLONG_MAX;
        if (l == r) return ans;
        int mid = (l + r) / 2;
        if (x <= mid) return min(ans, query(x, p * 2, l, mid));
        return min(ans, query(x, p * 2 + 1, mid + 1, r));
    }

    long long query(long long x) const {
        int id = lower_bound(xs.begin(), xs.end(), x) - xs.begin();
        assert(id < (int)xs.size() && xs[id] == x);
        return query(id, 1, 0, (int)xs.size() - 1);
    }
};
```

- A coordenada consultada precisa ter sido incluída no vetor passado ao construtor.
- A implementação calcula mínimo; para máximo, inverta a comparação ou os sinais.
- Produtos `m*x` e somas precisam caber em `long long`.
- Para domínio inteiro contínuo conhecido, troque a compressão por um intervalo fixo e adapte a busca.
