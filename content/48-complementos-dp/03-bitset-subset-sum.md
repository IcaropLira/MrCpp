---
title: Subset sum com bitset
summary: Somas atingíveis com b |= b << x em O(n·S/64), com agrupamento binário de valores repetidos.
status: done
complexity: O(n · S / 64)
tags: bitset, subset sum, mochila booleana
---

## Ideia

`b[s] = 1` se a soma `s` é atingível. Cada item: `b |= b << x`. Com `Σa = S`, só existem `O(√S)` valores distintos; `c` cópias de `v` viram itens `v·1, v·2, v·4, …, resto` (O(log c) itens).

```cpp
// Subset sum com bitset: quais somas são atingíveis? O(n * S / 64)
// Truque extra: se Σa ≤ S, só há O(√S) valores distintos -> agrupe repetidos em potências de 2
#include <bits/stdc++.h>
using namespace std;
const int S = 100001;

int main() {
    int n; cin >> n;
    map<int,int> cnt;
    for (int i = 0; i < n; i++) { int x; cin >> x; cnt[x]++; }
    bitset<S> b; b[0] = 1;
    for (auto [v, c] : cnt) {
        // decomposição binária: c cópias de v viram itens v*1, v*2, v*4, ..., resto
        for (int k = 1; c > 0; k <<= 1) { int t = min(k, c); b |= b << (v * t); c -= t; }
    }
    vector<int> r;
    for (int s = 1; s < S; s++) if (b[s]) r.push_back(s);
    cout << r.size() << '\n';
    for (size_t i = 0; i < r.size(); i++) cout << r[i] << " \n"[i + 1 == r.size()];
}
```

Exemplo testado — entrada:

```text
4
4 2 5 2
```

saída:

```text
9
2 4 5 6 7 8 9 11 13
```
