---
title: ordered_set (pb_ds)
summary: find_by_order (k-ésimo) e order_of_key (quantos < x) em O(log n), com multiconjunto via pares.
status: done
complexity: O(log n)
tags: pb_ds, ordered set, order statistics, k-ésimo
---

```cpp
// ordered_set (pb_ds): set com k-ésimo elemento e "quantos < x" em O(log n). GCC apenas.
// Multiconjunto: guarde pares (valor, id único) ou use less_equal (quebra erase/find — evite).
#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>
using namespace std;
using namespace __gnu_pbds;
template <class T> using ordered_set = tree<T, null_type, less<T>, rb_tree_tag, tree_order_statistics_node_update>;

int main() {
    int q; cin >> q;
    ordered_set<pair<int,int>> s;          // (valor, id) -> aceita repetidos
    map<int, vector<int>> ids;             // para apagar uma cópia
    int nid = 0;
    while (q--) {
        char t; int x; cin >> t >> x;
        if (t == '+') { s.insert({x, nid}); ids[x].push_back(nid++); }
        else if (t == '-') { if (!ids[x].empty()) { s.erase({x, ids[x].back()}); ids[x].pop_back(); } }
        else if (t == 'k') { auto it = s.find_by_order(x); cout << (it == s.end() ? -1 : it->first) << '\n'; } // x-ésimo (0-idx)
        else cout << s.order_of_key({x, -1}) << '\n';                                                        // quantos < x
    }
}
```

Exemplo testado — entrada:

```text
8
+ 5
+ 1
+ 5
+ 3
k 2
c 5
- 5
k 2
```

saída:

```text
5
2
5
```
