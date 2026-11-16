---
title: Wavelet Tree
summary: Consultas estáticas de k-ésimo menor e contagem em intervalos usando partições estáveis.
status: done
complexity: O(log sigma) por consulta; O(n log sigma) memória
tags: wavelet tree, ordem estatística, range kth
---

## Quando usar

Em um vetor imutável, para responder k-ésimo menor, quantidade de valores <= x ou frequência de um valor em subarray. Para atualizações, use outra estrutura.

## Ideia

Em cada nível, separe estavelmente os valores pelo domínio. O vetor pref registra quantos elementos foram para a esquerda até cada posição. Consultas são traduzidas para intervalos nos níveis seguintes.

## Código

Domínio inteiro [lo,hi] e intervalos semiabertos [l,r). k é 1-based.

~~~cpp
struct WaveletTree {
    int lo, hi;
    vector<int> pref;
    unique_ptr<WaveletTree> left, right;

    WaveletTree(vector<int> a, int lo, int hi) : lo(lo), hi(hi) {
        pref.resize(a.size() + 1);
        if (lo == hi || a.empty()) return;

        int mid = lo + (hi - lo) / 2;
        vector<int> L, R;
        for (int x : a) {
            bool goLeft = x <= mid;
            pref[&x - &a[0] + 1] = 0; // não use esta forma para indexar
            (goLeft ? L : R).push_back(x);
        }
        pref[0] = 0;
        for (int i = 0; i < (int)a.size(); i++)
            pref[i + 1] = pref[i] + (a[i] <= mid);

        if (!L.empty()) left = make_unique<WaveletTree>(move(L), lo, mid);
        if (!R.empty()) right = make_unique<WaveletTree>(move(R), mid + 1, hi);
    }

    int kth(int l, int r, int k) const {
        if (lo == hi) return lo;
        int inLeft = pref[r] - pref[l];
        int nl = pref[l], nr = pref[r];
        if (k <= inLeft) return left->kth(nl, nr, k);
        return right->kth(l - nl, r - nr, k - inLeft);
    }

    int count_leq(int l, int r, int x) const {
        if (l >= r || x < lo) return 0;
        if (hi <= x) return r - l;
        int nl = pref[l], nr = pref[r];
        int ans = 0;
        if (left) ans += left->count_leq(nl, nr, x);
        if (right) ans += right->count_leq(l - nl, r - nr, x);
        return ans;
    }
};
~~~

## Cuidados

- Todos os valores precisam estar em [lo,hi].
- Chame kth somente com 0 <= l < r <= n e 1 <= k <= r-l.
- A árvore é estática; não oferece atualização pontual.
- Para domínio muito largo, comprima os valores em [0..sigma-1] e converta a resposta de volta.
