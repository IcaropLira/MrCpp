---
title: Lazy Propagation (aula)
summary: Soma em intervalo + soma de intervalo, push antes de descer.
status: done
complexity: O(log n) por operação
tags: lazy, segtree, range update, aula
---

## Ideia

`lz[v]` guarda uma atualização **pendente** para todo o intervalo de `v`. O `push` aplica a pendência no próprio nó (`seg += lz * tamanho`) e a repassa aos filhos. Update e query usam os mesmos 3 casos da segtree; no caso "totalmente contido" o update só marca o lazy.

## Código

```cpp
// Lazy Propagation: soma v em [l, r] e soma de [l, r]
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const int N = 1e5 + 5;
ll seg[4 * N], lz[4 * N], a[N];

void build(int v, int l, int r) {
    lz[v] = 0;
    if (l == r) { seg[v] = a[l]; return; }
    int m = (l + r) / 2;
    build(2 * v, l, m); build(2 * v + 1, m + 1, r);
    seg[v] = seg[2 * v] + seg[2 * v + 1];
}

// aplica a pendência no próprio nó e passa para os filhos
void push(int v, int l, int r) {
    if (!lz[v]) return;
    seg[v] += lz[v] * (r - l + 1);          // valor_novo = antigo + lazy * tamanho
    if (l != r) { lz[2 * v] += lz[v]; lz[2 * v + 1] += lz[v]; }
    lz[v] = 0;                              // desmarca
}

void update(int v, int l, int r, int ql, int qr, ll x) {
    push(v, l, r);
    if (qr < l || r < ql) return;           // caso 1: disjunto
    if (ql <= l && r <= qr) {               // caso 2: contido -> marca o lazy
        lz[v] += x; push(v, l, r); return;
    }
    int m = (l + r) / 2;                    // caso 3: quebra
    update(2 * v, l, m, ql, qr, x);
    update(2 * v + 1, m + 1, r, ql, qr, x);
    seg[v] = seg[2 * v] + seg[2 * v + 1];
}

ll query(int v, int l, int r, int ql, int qr) {
    push(v, l, r);
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return seg[v];
    int m = (l + r) / 2;
    return query(2 * v, l, m, ql, qr) + query(2 * v + 1, m + 1, r, ql, qr);
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> a[i];
    build(1, 1, n);
    while (q--) {
        int t; cin >> t;
        if (t == 1) { int l, r; ll v; cin >> l >> r >> v; update(1, 1, n, l, r, v); }
        else { int l, r; cin >> l >> r; cout << query(1, 1, n, l, r) << '\n'; }
    }
}
```

Exemplo testado — entrada:

```text
8 3
1 2 3 4 5 6 7 8
2 1 4
1 1 5 4
2 1 4
```

saída:

```text
10
26
```

## Variações (troque `push` e o merge)

| Atualização em [l, r] | Consulta | No nó contido | Compor pendências |
|---|---|---|---|
| soma `x` | soma | `seg += x·len` | `lz += x` |
| soma `x` | mín/máx | `seg += x` | `lz += x` |
| atribuir `x` | soma | `seg = x·len` | sobrescreve (use flag "tem atribuição") |
| atribuir `x` | mín/máx | `seg = x` | sobrescreve |
| inverter bits (0/1) | contar 1s | `seg = len − seg` | `lz ^= 1` |
| xor `x` em todos | soma | por bit: `cnt_b = len − cnt_b` se bit b de x | `lz ^= x` |

Veja também a lazy de inversão em *Aulas: Árvores → Euler Tour (Danil)* e a lazy de máximo em *Aulas: DP → Intervals*.
