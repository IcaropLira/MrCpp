---
title: Merge sort tree
summary: Segtree com vetores ordenados: quantos ≤ k em [l, r] em O(log² n).
status: done
complexity: O(n log n) pré · O(log² n) consulta
tags: merge sort tree, segtree, contagem, k-ésimo
---

## Ideia

Cada nó guarda seu intervalo ordenado (é exatamente o merge sort). Consulta: decompõe `[l, r]` em O(log n) nós e faz `upper_bound` em cada. Para k-ésimo menor em intervalo: busca binária no valor por cima (O(log³ n)) — ou wavelet tree / segtree persistente (O(log n)).

```cpp
// Merge sort tree: cada nó da segtree guarda seu intervalo ORDENADO.
// Quantos a[i] <= k em [l, r]: O(log² n) por consulta; memória O(n log n). Estático.
#include <bits/stdc++.h>
using namespace std;

int n; vector<vector<int>> t; vector<int> a;
void build(int v, int l, int r) {
    if (l == r) { t[v] = {a[l]}; return; }
    int m = (l + r) / 2;
    build(2 * v, l, m); build(2 * v + 1, m + 1, r);
    merge(t[2 * v].begin(), t[2 * v].end(), t[2 * v + 1].begin(), t[2 * v + 1].end(), back_inserter(t[v]));
}
int query(int v, int l, int r, int ql, int qr, int k) {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return upper_bound(t[v].begin(), t[v].end(), k) - t[v].begin();
    int m = (l + r) / 2;
    return query(2 * v, l, m, ql, qr, k) + query(2 * v + 1, m + 1, r, ql, qr, k);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int q; cin >> n >> q; a.resize(n); for (auto &x : a) cin >> x;
    t.assign(4 * n, {}); build(1, 0, n - 1);
    while (q--) { int l, r, k; cin >> l >> r >> k; cout << query(1, 0, n - 1, l, r, k) << '\n'; }
}
```

Exemplo testado — entrada:

```text
5 3
3 1 4 1 5
0 4 3
1 3 1
2 4 4
```

saída:

```text
3
2
2
```

> Verificação: 4000 consultas aleatórias contra contagem direta.
