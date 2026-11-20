---
title: LCA e binary lifting (aula)
summary: Struct LCA com k-ésimo ancestral, distância (com pesos) e k-ésimo vértice do caminho; 5 problemas.
status: done
complexity: pré O(n log n) · consulta O(log n)
tags: lca, binary lifting, ancestral, distância, aula
---

## Struct

```cpp
// LCA por binary lifting (raiz 1). Pré: O(n log n). Consulta: O(log n).
struct LCA {
    int n, LOG;
    vector<vector<int>> up;     // up[j][v]
    vector<int> dep;
    vector<long long> dist;     // soma de pesos até a raiz (se houver pesos)
    LCA(const vector<vector<pair<int,int>>> &adj, int root = 1) : n(adj.size() - 1) {
        LOG = 1; while ((1 << LOG) <= n) LOG++;
        up.assign(LOG, vector<int>(n + 1, 0)); dep.assign(n + 1, 0); dist.assign(n + 1, 0);
        vector<int> ordem = {root}; vector<bool> vis(n + 1, false); vis[root] = true;
        for (int i = 0; i < (int)ordem.size(); i++) {       // BFS: pai antes do filho
            int v = ordem[i];
            for (auto [u, w] : adj[v]) if (!vis[u]) {
                vis[u] = true; up[0][u] = v; dep[u] = dep[v] + 1; dist[u] = dist[v] + w; ordem.push_back(u);
            }
        }
        up[0][root] = root;                                  // raiz aponta para si mesma
        for (int j = 1; j < LOG; j++) for (int v = 1; v <= n; v++) up[j][v] = up[j - 1][up[j - 1][v]];
    }
    int kth(int v, int k) {                                  // k-ésimo ancestral (para na raiz)
        for (int j = 0; j < LOG; j++) if (k >> j & 1) v = up[j][v];
        return v;
    }
    int lca(int a, int b) {
        if (dep[a] < dep[b]) swap(a, b);
        a = kth(a, dep[a] - dep[b]);                          // 1) nivela
        if (a == b) return a;                                 // b era ancestral de a
        for (int j = LOG - 1; j >= 0; j--)                    // 2) sobe enquanto os ancestrais diferem
            if (up[j][a] != up[j][b]) a = up[j][a], b = up[j][b];
        return up[0][a];
    }
    int arestas(int a, int b) { return dep[a] + dep[b] - 2 * dep[lca(a, b)]; }
    long long peso(int a, int b) { return dist[a] + dist[b] - 2 * dist[lca(a, b)]; }
    int kth_on_path(int a, int b, int k) {                    // k-ésimo vértice (1-indexado) de a até b
        int L = lca(a, b), sa = dep[a] - dep[L], tot = sa + dep[b] - dep[L] + 1;
        return k <= sa + 1 ? kth(a, k - 1) : kth(b, tot - k);
    }
};
```

- `up[j][v] = up[j−1][ up[j−1][v] ]` (saltar `2^j` = saltar `2^(j−1)` duas vezes).
- LCA: nivela as profundidades com `kth`; se ficou igual, achou; senão sobe os dois enquanto os ancestrais `2^j` **diferem**; a resposta é o pai.

### Company Queries I (CSES 1687) — k-ésimo ancestral

Juiz: <https://cses.fi/problemset/task/1687>  
Complexidade: `O((n + q) log n)`

Sentinela 0 acima da raiz → imprime −1. Escreva `k` em binário (13 = 8 + 4 + 1).

```cpp
// CSES 1687 - Company Queries I: k-ésimo ancestral com binary lifting
// up[j][v] = ancestral 2^j de v;  up[j][v] = up[j-1][ up[j-1][v] ]
#include <bits/stdc++.h>
using namespace std;
const int LOG = 18;                        // 2^18 > 2e5

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    vector<array<int, LOG>> up(n + 1);
    up[0].fill(0); up[1].fill(0);          // 0 = "acima da raiz" (sentinela)
    for (int v = 2; v <= n; v++) cin >> up[v][0];
    for (int j = 1; j < LOG; j++)
        for (int v = 1; v <= n; v++) up[v][j] = up[up[v][j - 1]][j - 1];  // j por fora: a ordem dos v não importa
    while (q--) {
        int x, k; cin >> x >> k;
        for (int j = 0; j < LOG && x; j++) if (k >> j & 1) x = up[x][j]; // 13 = 8+4+1
        cout << (x ? x : -1) << '\n';
    }
}
```

Exemplo testado — entrada:

```text
5 3
1 1 3 3
4 1
4 2
4 3
```

saída:

```text
3
1
-1
```


### Company Queries II (CSES 1688)

Juiz: <https://cses.fi/problemset/task/1688>  
Complexidade: `O((n + q) log n)`

LCA direto.

```cpp
// CSES 1688 - Company Queries II: menor chefe comum = LCA
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct LCA (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    vector<vector<pair<int,int>>> adj(n + 1);
    for (int v = 2; v <= n; v++) { int p; cin >> p; adj[p].push_back({v, 1}); adj[v].push_back({p, 1}); }
    LCA L(adj);
    while (q--) { int a, b; cin >> a >> b; cout << L.lca(a, b) << '\n'; }
}
```

Exemplo testado — entrada:

```text
5 3
1 1 3 3
4 5
2 5
1 4
```

saída:

```text
3
1
1
```


### Distance Queries (CSES 1135)

Juiz: <https://cses.fi/problemset/task/1135>  
Complexidade: `O((n + q) log n)`

`dep[a] + dep[b] − 2·dep[lca]`.

```cpp
// CSES 1135 - Distance Queries: dist(a,b) = dep[a] + dep[b] - 2*dep[lca]
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct LCA (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    vector<vector<pair<int,int>>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back({b, 1}); adj[b].push_back({a, 1}); }
    LCA L(adj);
    while (q--) { int a, b; cin >> a >> b; cout << L.arestas(a, b) << '\n'; }
}
```

Exemplo testado — entrada:

```text
5 3
1 2
1 3
3 4
3 5
1 3
2 5
1 4
```

saída:

```text
1
3
2
```


### QTREE2 (SPOJ)

Juiz: <https://www.spoj.com/problems/QTREE2/>  
Complexidade: `O(N log N) por caso`

Pesos: `dist[a] + dist[b] − 2·dist[lca]`. KTH: se `k ≤ subida + 1` sobe de `a`; senão sobe `total − k` de `b`.

```cpp
// SPOJ QTREE2: DIST a b (com pesos) e KTH a b k (k-ésimo vértice do caminho)
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct LCA (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n; cin >> n;
        vector<vector<pair<int,int>>> adj(n + 1);
        for (int i = 0; i < n - 1; i++) { int a, b, c; cin >> a >> b >> c; adj[a].push_back({b, c}); adj[b].push_back({a, c}); }
        LCA L(adj);
        string cmd;
        while (cin >> cmd && cmd != "DONE") {
            int a, b; cin >> a >> b;
            if (cmd == "DIST") cout << L.peso(a, b) << '\n';
            else { int k; cin >> k; cout << L.kth_on_path(a, b, k) << '\n'; }
        }
        cout << '\n';
    }
}
```

Exemplo testado — entrada:

```text
1

6
1 2 1
2 4 1
2 5 2
1 3 1
3 6 2
DIST 4 6
KTH 4 6 4
DONE
```

saída:

```text
5
3
```


### Counting Paths (CSES 1136) — diferença em árvore

Juiz: <https://cses.fi/problemset/task/1136>  
Complexidade: `O((n + m) log n)`

`+1` em a e b, `−1` no lca e no pai do lca; depois soma as subárvores (filhos antes dos pais).

```cpp
// CSES 1136 - Counting Paths: diferença em árvore
// caminho a-b: +1 em a, +1 em b, -1 no lca, -1 no pai do lca; depois soma das subárvores
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct LCA (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, m; cin >> n >> m;
    vector<vector<pair<int,int>>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back({b, 1}); adj[b].push_back({a, 1}); }
    LCA L(adj);
    vector<long long> marca(n + 1, 0);
    while (m--) {
        int a, b; cin >> a >> b;
        int l = L.lca(a, b);
        marca[a]++; marca[b]++; marca[l]--;
        if (l != 1) marca[L.up[0][l]]--;                    // pai do lca (a raiz não tem)
    }
    // ordena por profundidade decrescente: filhos antes dos pais
    vector<int> ord(n); iota(ord.begin(), ord.end(), 1);
    sort(ord.begin(), ord.end(), [&](int x, int y) { return L.dep[x] > L.dep[y]; });
    for (int v : ord) if (v != 1) marca[L.up[0][v]] += marca[v];
    for (int v = 1; v <= n; v++) cout << marca[v] << " \n"[v == n];
}
```

Exemplo testado — entrada:

```text
5 3
1 2
1 3
3 4
3 5
1 3
2 5
1 4
```

saída:

```text
3 1 3 1 1
```


## Mínimo/máximo no caminho

Mesma tabela, guardando junto o agregado do salto: `mn[j][v] = min(mn[j−1][v], mn[j−1][ up[j−1][v] ])`, com `mn[0][v]` = peso da aresta `(v, pai)`. Na subida do LCA, acumule `mn` de cada salto dado.
