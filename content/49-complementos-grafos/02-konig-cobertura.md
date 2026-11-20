---
title: König: cobertura mínima de vértices e conjunto independente máximo
summary: Em bipartidos, |cobertura mínima| = |emparelhamento máximo|; construção pelos caminhos alternantes.
status: done
complexity: O(V · E) (Kuhn) ou O(E √V)
tags: könig, cobertura de vértices, conjunto independente, bipartido, matching
---

## Fatos

- Bipartido: **cobertura mínima de vértices = emparelhamento máximo** (König).
- **Conjunto independente máximo = V − emparelhamento** (complemento da cobertura).
- **Cobertura mínima por arestas** (sem vértice isolado) = `V − emparelhamento`.
- Em grafo geral esses problemas são NP-difíceis (exceto matching: Blossom).

```cpp
// König: em grafo BIPARTIDO, cobertura mínima de vértices = emparelhamento máximo.
// Construção: rode o matching; a partir dos vértices LIVRES da esquerda, ande por caminhos alternantes
// (esq -> dir por aresta fora do matching, dir -> esq pela aresta do matching). Seja Z o visitado.
// Cobertura = (Esquerda \ Z) ∪ (Direita ∩ Z).  Conjunto independente máximo = complemento.
#include <bits/stdc++.h>
using namespace std;

int nl, nr;
vector<vector<int>> g;           // g[u] = vizinhos à direita de u (esquerda 0..nl-1, direita 0..nr-1)
vector<int> mL, mR, vis;
bool kuhn(int u, int it) {       // caminho aumentante (Kuhn, O(V·E)); troque por Hopcroft-Karp se precisar
    for (int v : g[u]) if (vis[v] != it) {
        vis[v] = it;
        if (mR[v] < 0 || kuhn(mR[v], it)) { mL[u] = v; mR[v] = u; return true; }
    }
    return false;
}

int main() {
    int m; cin >> nl >> nr >> m;
    g.assign(nl, {});
    for (int i = 0; i < m; i++) { int u, v; cin >> u >> v; g[u].push_back(v); }
    mL.assign(nl, -1); mR.assign(nr, -1); vis.assign(nr, -1);
    int match = 0;
    for (int u = 0; u < nl; u++) match += kuhn(u, u);
    vector<bool> zL(nl, false), zR(nr, false);
    queue<int> q;
    for (int u = 0; u < nl; u++) if (mL[u] < 0) { zL[u] = true; q.push(u); }
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : g[u]) if (!zR[v] && mL[u] != v) {
            zR[v] = true;
            if (mR[v] >= 0 && !zL[mR[v]]) { zL[mR[v]] = true; q.push(mR[v]); }
        }
    }
    vector<string> cover;
    for (int u = 0; u < nl; u++) if (!zL[u]) cover.push_back("L" + to_string(u));
    for (int v = 0; v < nr; v++) if (zR[v]) cover.push_back("R" + to_string(v));
    cout << match << ' ' << cover.size() << '\n';
    for (size_t i = 0; i < cover.size(); i++) cout << cover[i] << " \n"[i + 1 == cover.size()];
}
```

Exemplo testado — entrada:

```text
3 3 4
0 0
0 1
1 0
2 0
```

saída:

```text
2 2
L0 R0
```

> Verificação: 300 bipartidos aleatórios: a cobertura cobre todas as arestas e tem o tamanho mínimo da força bruta.
