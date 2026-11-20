---
title: Determinante e teorema de Kirchhoff
summary: Determinante mod p por eliminação de Gauss; nº de árvores geradoras = cofator da Laplaciana.
status: done
complexity: O(n³)
tags: kirchhoff, matrix-tree, determinante, árvores geradoras, gauss
---

## Fatos

- Laplaciana `L = D − A` (D = graus, A = adjacências, multiarestas somam). Nº de árvores geradoras = `det` de L sem a linha e coluna 0.
- Grafo completo `K_n`: `n^(n−2)` (Cayley). Bipartido completo `K_(a,b)`: `a^(b−1)·b^(a−1)`.
- Dirigido (arborescências com raiz r): use `L = D_in − A` e remova a linha/coluna de `r`.
- Troca de linhas inverte o sinal do determinante; determinante = produto dos pivôs.

```cpp
// Determinante mod p (Gauss) e Teorema de Kirchhoff (matrix-tree):
// nº de árvores geradoras = det da Laplaciana L = D − A sem uma linha e coluna. Multiarestas contam.
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll MOD = 1e9 + 7;
ll pw(ll b, ll e) { ll r = 1; b %= MOD; for (; e; e >>= 1, b = b * b % MOD) if (e & 1) r = r * b % MOD; return r; }

ll det(vector<vector<ll>> a) {            // O(n³), MOD primo
    int n = a.size(); ll d = 1;
    for (int c = 0; c < n; c++) {
        int p = c; while (p < n && a[p][c] == 0) p++;
        if (p == n) return 0;
        if (p != c) { swap(a[p], a[c]); d = MOD - d; }   // troca de linha inverte o sinal
        d = d * a[c][c] % MOD;
        ll inv = pw(a[c][c], MOD - 2);
        for (int r = c + 1; r < n; r++) if (a[r][c]) {
            ll f = a[r][c] * inv % MOD;
            for (int k = c; k < n; k++) a[r][k] = ((a[r][k] - f * a[c][k]) % MOD + MOD) % MOD;
        }
    }
    return d % MOD;
}

int main() {
    int n, m; cin >> n >> m;
    vector<vector<ll>> L(n, vector<ll>(n, 0));
    for (int i = 0; i < m; i++) {
        int u, v; cin >> u >> v; if (u == v) continue;   // laço não muda nada
        L[u][u]++; L[v][v]++; L[u][v] = (L[u][v] + MOD - 1) % MOD; L[v][u] = (L[v][u] + MOD - 1) % MOD;
    }
    vector<vector<ll>> M(n - 1, vector<ll>(n - 1));
    for (int i = 1; i < n; i++) for (int j = 1; j < n; j++) M[i - 1][j - 1] = L[i][j];
    cout << (n == 1 ? 1 : det(M)) << '\n';
}
```

Exemplo testado — entrada:

```text
4 6
0 1
0 2
0 3
1 2
1 3
2 3
```

saída:

```text
16
```

> Verificação: 300 multigrafos aleatórios contra a enumeração de subconjuntos de arestas.
