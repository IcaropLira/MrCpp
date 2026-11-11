---
title: Segment Tree de XOR
summary: Consultas de XOR, atualizações pontuais e prefix XOR.
status: done
complexity: O(n) construção; O(log n) por operação
tags: segtree, xor, bitwise, consultas
---

## Quando a sacada é XOR

XOR é associativo e tem elemento neutro zero. Isso faz dele uma operação perfeita para uma segment tree: combine os filhos com `^` e retorne `0` nos intervalos vazios.

Além disso, `x ^ x = 0`. Se o problema só pede XOR de intervalos e o vetor não muda, prefix XOR resolve em (O(1)). Se há atualização pontual, use segment tree ou BIT de XOR.

## Código — atualização pontual e consulta inclusiva

```cpp
const int N = 2e5 + 5;
int n, a[N], seg[4*N];

void build(int x, int l, int r) {
    if (l == r) { seg[x] = a[l]; return; }
    int m = (l + r) / 2;
    build(2*x, l, m);
    build(2*x+1, m+1, r);
    seg[x] = seg[2*x] ^ seg[2*x+1];
}

void update(int i, int v, int x = 1, int l = 0, int r = n-1) {
    if (l == r) { seg[x] = v; return; }
    int m = (l + r) / 2;
    if (i <= m) update(i, v, 2*x, l, m);
    else update(i, v, 2*x+1, m+1, r);
    seg[x] = seg[2*x] ^ seg[2*x+1];
}

int query(int a, int b, int x = 1, int l = 0, int r = n-1) {
    if (b < l || r < a) return 0;
    if (a <= l && r <= b) return seg[x];
    int m = (l + r) / 2;
    return query(a, b, 2*x, l, m) ^ query(a, b, 2*x+1, m+1, r);
}
```

## Prefix XOR: quando não precisa de árvore

Defina `pref[0] = 0` e `pref[i+1] = pref[i] ^ a[i]`. Então o XOR de `[l,r]` é `pref[r+1] ^ pref[l]`. Isso é (O(1)) por consulta, mas qualquer alteração no vetor exige reconstruir os prefixos.

## BIT de XOR

Uma Fenwick também funciona porque XOR é associativo e cada valor é seu próprio inverso. Atualização pontual por diferença XOR:

`delta = antigo ^ novo`, depois aplique `bit[i] ^= delta` nos índices Fenwick. O XOR de `[l,r]` é `prefix(r) ^ prefix(l-1)`.

## Variações

- Segment tree de máximo XOR não é a mesma coisa que XOR de intervalo: para maximizar `x ^ y` entre valores, normalmente use trie binária.
- Lazy XOR em intervalo com consulta XOR precisa considerar se o comprimento do segmento é par ou ímpar; veja **Lazy XOR**.
- Para contar bits em intervalo com atualizações, mantenha uma árvore por bit ou vetor de contagens por nó, conforme os limites.
- Para subárvores, combine Euler Tour (flattening) com esta segment tree: a subárvore vira `[tin[v], tout[v]]`.

## Erros comuns

- Esquecer que o intervalo do código é inclusivo.
- Retornar `-1` no caso fora do intervalo; o neutro do XOR é `0`.
- Confundir a consulta XOR de um intervalo com o problema de encontrar o par que maximiza XOR.
