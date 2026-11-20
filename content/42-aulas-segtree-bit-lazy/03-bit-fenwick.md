---
title: BIT / Fenwick (aula)
summary: Prefixos dinâmicos com LSB, Super Computer e contagem de inversões com compressão.
status: done
complexity: O(log n) por operação
tags: bit, fenwick, inversões, compressão de coordenadas, aula
---

## Ideia

O índice `i` guarda o intervalo `[i − LSB(i) + 1, i]`, com `LSB(i) = i & -i`.

- Prefixo: enquanto `i > 0`, soma `bit[i]` e faz `i -= LSB(i)` (tira o menor bit).
- Update: enquanto `i <= n`, soma em `bit[i]` e faz `i += LSB(i)` (próximo intervalo que contém `i`).
- `soma(l, r) = pref(r) − pref(l − 1)`. **1-indexada.**

### Problema: Super Computer

`F i` inverte o bit `i`; `C l r` conta 1s em `[l, r]` → prefix sum dinâmica.

```cpp
// Super Computer: F i inverte o bit i; C l r conta 1s em [l, r]  -> BIT
#include <bits/stdc++.h>
using namespace std;

struct BIT {
    int n; vector<long long> t;
    BIT(int n) : n(n), t(n + 1, 0) {}
    void add(int i, long long v) { for (; i <= n; i += i & -i) t[i] += v; }   // i += LSB(i)
    long long pref(int i) { long long s = 0; for (; i > 0; i -= i & -i) s += t[i]; return s; } // i -= LSB(i)
    long long query(int l, int r) { return pref(r) - pref(l - 1); }
};

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k; cin >> n >> k;
    BIT bit(n);
    vector<int> b(n + 1, 0);
    while (k--) {
        char op; cin >> op;
        if (op == 'F') { int i; cin >> i; bit.add(i, b[i] ? -1 : 1); b[i] ^= 1; }
        else { int l, r; cin >> l >> r; cout << bit.query(l, r) << '\n'; }
    }
}
```

Exemplo testado — entrada:

```text
6 7
F 3
C 2 5
F 3
F 4
F 5
C 2 5
C 1 4
```

saída:

```text
1
2
1
```

### Problema: Inversion Count (com compressão de coordenadas)

Contribuição de cada `i` = quantos valores **maiores** já apareceram à esquerda = (inseridos) − (inseridos ≤ A[i]). Com `A[i]` até 10⁹, comprima: valor → índice no vetor ordenado sem repetidos (busca binária).

```cpp
// Para cada i: quantos j < i com A[j] > A[i]  (compressão + BIT de frequência)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    // compressão de coordenadas: valor -> posição no vetor ordenado (1-indexado)
    vector<long long> vals = a;
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = vals.size();
    vector<int> bit(m + 1, 0);
    auto add = [&](int i) { for (; i <= m; i += i & -i) bit[i]++; };
    auto pref = [&](int i) { int s = 0; for (; i > 0; i -= i & -i) s += bit[i]; return s; };
    long long total = 0;
    for (int i = 0; i < n; i++) {
        int p = lower_bound(vals.begin(), vals.end(), a[i]) - vals.begin() + 1;
        int maiores = i - pref(p);          // já inseridos - (<= A[i])
        cout << maiores << " \n"[i == n - 1];
        total += maiores;
        add(p);
    }
    cout << total << '\n';                  // total de inversões
}
```

Exemplo testado — entrada:

```text
5
5 3 4 1 2
```

saída:

```text
0 1 1 3 3
8
```

## Build em O(n)

```cpp
// a 1-indexado; constrói sem n updates
for (int i = 1; i <= n; i++) {
    bit[i] += a[i];
    int j = i + (i & -i);
    if (j <= n) bit[j] += bit[i];
}
```
