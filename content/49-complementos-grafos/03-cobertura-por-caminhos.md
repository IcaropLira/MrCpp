---
title: Cobertura mínima por caminhos em DAG e Dilworth
summary: Caminhos disjuntos = n − matching; com repetição de vértices = fecho transitivo = maior anticadeia (Dilworth).
status: done
complexity: O(n · m) (Kuhn) + O(n³) fecho
tags: dilworth, path cover, dag, matching, anticadeia
---

## Fatos

- Divida cada vértice em `u_out` (esquerda) e `v_in` (direita); aresta `u → v` vira `u_out — v_in`. Cada aresta do matching "cola" dois caminhos: **caminhos vértice-disjuntos mínimos = n − matching**.
- Se caminhos podem compartilhar vértices, use o **fecho transitivo** antes.
- **Dilworth**: em uma ordem parcial, menor nº de **cadeias** que cobrem tudo = maior **anticadeia** (elementos dois a dois incomparáveis). Dual (Mirsky): maior cadeia = menor nº de anticadeias.
- Ex.: sequência → menor nº de subsequências não decrescentes que a cobrem = maior subsequência estritamente decrescente.

```cpp
// Cobertura mínima por caminhos em DAG
//  - caminhos VÉRTICE-DISJUNTOS: n − (emparelhamento máximo no bipartido "saída u -> entrada v" por aresta u->v)
//  - caminhos que podem repetir vértices (Dilworth: = maior anticadeia): faça o fecho transitivo antes
#include <bits/stdc++.h>
using namespace std;

int n; vector<vector<int>> g; vector<int> mR, vis;
bool kuhn(int u, int it) {
    for (int v : g[u]) if (vis[v] != it) { vis[v] = it; if (mR[v] < 0 || kuhn(mR[v], it)) { mR[v] = u; return true; } }
    return false;
}
int cobre(const vector<vector<int>> &adj) {
    g = adj; mR.assign(n, -1); vis.assign(n, -1);
    int m = 0; for (int u = 0; u < n; u++) m += kuhn(u, u);
    return n - m;
}

int main() {
    int m; cin >> n >> m;
    vector<vector<int>> adj(n);
    vector<vector<bool>> r(n, vector<bool>(n, false));
    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; adj[u].push_back(v); r[u][v] = true; }
    cout << cobre(adj) << '\n';                                   // disjuntos
    for (int k = 0; k < n; k++) for (int i = 0; i < n; i++) if (r[i][k]) for (int j = 0; j < n; j++) if (r[k][j]) r[i][j] = true;
    vector<vector<int>> fecho(n);
    for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) if (r[i][j]) fecho[i].push_back(j);
    cout << cobre(fecho) << '\n';                                 // com repetição = maior anticadeia
}
```

Exemplo testado — entrada:

```text
4 3
0 1
2 1
1 3
```

saída:

```text
2
2
```

> Verificação: 300 DAGs aleatórios contra força bruta (partição e maior anticadeia).
