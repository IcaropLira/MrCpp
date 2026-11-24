---
title: Contagens na árvore
summary: Subárvores conexas, soma de todas as distâncias e pares a distância K (CF 161D).
status: done
complexity: O(n) · O(n·K)
tags: contagem, subárvores conexas, soma de distâncias, distância k, dp em árvore
---

## Fórmulas

- Conjuntos conexos que têm `v` como **vértice mais alto**: `f[v] = Π (f[c] + 1)` (cada filho: não entra, ou entra com um conjunto conexo seu). Total = `Σ f[v]`.
- **Soma de todas as distâncias** = `Σ_arestas sz · (n − sz)` (cada aresta é cruzada por todos os pares separados por ela).
- **Pares a distância K**: `cnt[v][d]` = vértices da subárvore a profundidade relativa `d`; ao juntar o filho, conte `cnt[u][d] · cnt[v][K−1−d]` **antes** de juntar. O(n·K). Para K grande: small to large ou centroid.
- Bônus: nº de pares `{a, b}` cujo caminho passa por `v` (inclusive como ponta) = `C(n, 2) − Σ C(sᵢ, 2)`, onde `sᵢ` são os tamanhos das componentes ao remover `v` (os filhos e `n − sz[v]`).

### Distance in Tree (CF 161D) + subárvores + soma das distâncias

Juiz: <https://codeforces.com/problemset/problem/161/D>  
Complexidade: `O(n·K)`

Uma passada pós-ordem calcula as três coisas.

```cpp
// Três contagens clássicas numa árvore:
//  (a) nº de subconjuntos CONEXOS (subárvores) de vértices  -> f[v] = Π (f[c] + 1); total = Σ f[v]   (mod 1e9+7)
//  (b) soma das distâncias entre TODOS os pares           -> Σ_arestas sz · (n − sz)
//  (c) nº de pares a distância exatamente K (CF 161D)     -> cnt[v][d], merge O(n·K)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll MOD = 1e9 + 7;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, K; cin >> n >> K;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; g[a].push_back(b); g[b].push_back(a); }
    vector<int> par(n + 1, 0), ord = {1};
    for (int i = 0; i < (int)ord.size(); i++) { int v = ord[i]; for (int u : g[v]) if (u != par[v]) { par[u] = v; ord.push_back(u); } }
    vector<ll> f(n + 1, 1), sz(n + 1, 1);
    vector<vector<ll>> cnt(n + 1, vector<ll>(K + 1, 0));
    ll conexos = 0, somaDist = 0, pares = 0;
    for (int i = n - 1; i >= 0; i--) {
        int v = ord[i];
        cnt[v][0] = 1;
        for (int u : g[v]) if (u != par[v]) {
            f[v] = f[v] * (f[u] + 1) % MOD;
            sz[v] += sz[u];
            somaDist += sz[u] * (n - sz[u]);
            for (int d = 0; d < K; d++) pares += cnt[u][d] * cnt[v][K - 1 - d];   // conta antes de juntar
            for (int d = 0; d < K; d++) cnt[v][d + 1] += cnt[u][d];
        }
        conexos = (conexos + f[v]) % MOD;
    }
    cout << conexos << ' ' << somaDist << ' ' << pares << '\n';
}
```

Exemplo testado — entrada:

```text
5 2
1 2
2 3
3 4
2 5
```

saída:

```text
17 18 4
```


> Verificação: 400 árvores aleatórias contra enumeração de subconjuntos e BFS.
