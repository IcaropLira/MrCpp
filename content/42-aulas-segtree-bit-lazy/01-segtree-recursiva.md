---
title: Segment Tree recursiva (aula)
summary: Build, update pontual e query em intervalo com os 3 casos (disjunto, contido, parcial).
status: done
complexity: build O(n) · update O(log n) · query O(log n)
tags: segtree, segment tree, soma, merge, aula
---

## Ideia

Cada nó guarda o `merge` do seu intervalo; o nó `v` tem filhos `2v` e `2v+1` (enumeração que dispensa lista de adjacência). Troque `merge_` e `NEUTRO` para mínimo, máximo, gcd, xor, and, or… qualquer operação **associativa**.

## Código

```cpp
// Segment Tree recursiva (nó 1 = raiz, filhos 2v e 2v+1), soma + update pontual
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const int N = 2e5 + 5;
ll seg[4 * N];          // 4N basta para qualquer n
ll a[N];

ll merge_(ll x, ll y) { return x + y; } // qualquer operação associativa
const ll NEUTRO = 0;

void build(int v, int l, int r) {
    if (l == r) { seg[v] = a[l]; return; }  // folha [l, l]
    int m = (l + r) / 2;
    build(2 * v, l, m);
    build(2 * v + 1, m + 1, r);
    seg[v] = merge_(seg[2 * v], seg[2 * v + 1]);
}

void update(int v, int l, int r, int pos, ll val) {
    if (l == r) { seg[v] = val; return; }
    int m = (l + r) / 2;
    if (pos <= m) update(2 * v, l, m, pos, val);       // pos está à esquerda
    else update(2 * v + 1, m + 1, r, pos, val);        // ou à direita
    seg[v] = merge_(seg[2 * v], seg[2 * v + 1]);         // sempre atualiza o pai
}

ll query(int v, int l, int r, int ql, int qr) {
    if (qr < l || r < ql) return NEUTRO;                // totalmente disjunto
    if (ql <= l && r <= qr) return seg[v];              // totalmente contido
    int m = (l + r) / 2;                                // parte dentro, parte fora
    return merge_(query(2 * v, l, m, ql, qr), query(2 * v + 1, m + 1, r, ql, qr));
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> a[i];
    build(1, 1, n);
    while (q--) {
        int t, x, y; cin >> t >> x >> y;
        if (t == 1) update(1, 1, n, x, y);
        else cout << query(1, 1, n, x, y) << '\n';
    }
}
```

Exemplo testado — entrada:

```text
8 4
3 2 4 5 1 1 5 3
2 1 4
2 5 6
1 3 1
2 1 4
```

saída:

```text
14
2
11
```

## Cuidados

- Vetor de tamanho `4n` (a árvore não é completa quando `n` não é potência de 2).
- O `NEUTRO` precisa ser elemento neutro da operação: soma 0, produto 1, mínimo `+INF`, máximo `-INF`, gcd 0, xor 0, and `~0`, or 0.
- Atualização "somar x" em vez de "trocar por x": na folha faça `seg[v] += val`.
