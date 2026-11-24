---
title: Cobertura de vértices e conjunto dominante em árvore
summary: Vertex cover (2 estados) e dominating set (3 estados) com pesos nos vértices.
status: done
complexity: O(n)
tags: vertex cover, conjunto dominante, dp em árvore, 3 estados
---

## Estados

**Cobertura de vértices** (toda aresta com ponta escolhida):
- `vc[v][1] = c[v] + Σ min(vc[u][0], vc[u][1])`; `vc[v][0] = Σ vc[u][1]` (se v fora, todo filho dentro).

**Conjunto dominante** (todo vértice escolhido ou vizinho de escolhido) — o estado diz **quem domina v**:
- `0`: v escolhido → `c[v] + Σ min(ds[u][0], ds[u][1], ds[u][2])` (v já domina todos os filhos).
- `1`: v fora, dominado por algum filho → cada filho em `0` ou `1`, com **pelo menos um** em `0`. Some `min(ds[u][0], ds[u][1])`; se nenhum filho escolheu `0` por conta própria, pague o menor `ds[u][0] − ds[u][1]`. Folha: impossível.
- `2`: v fora e **ainda não dominado** (o pai terá que entrar) → cada filho em `0` ou `1`: `Σ min(ds[u][0], ds[u][1])`.
- Resposta: `min(ds[raiz][0], ds[raiz][1])` (a raiz não tem pai para salvá-la).

Variações: conjunto independente de peso máximo (2 estados), "cobrir a distância ≤ 2" (mais estados), guardas em arestas.

## Código (imprime cobertura mínima e dominante mínimo)

```cpp
// Árvore: (1) cobertura mínima de VÉRTICES (toda aresta tem ponta escolhida)
//         (2) conjunto DOMINANTE mínimo (todo vértice escolhido ou vizinho de escolhido)
// Pesos nos vértices (custo c[v]); para versão sem peso, c[v] = 1.
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll INF = LLONG_MAX / 4;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<ll> c(n + 1); for (int i = 1; i <= n; i++) cin >> c[i];
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; g[a].push_back(b); g[b].push_back(a); }
    vector<int> par(n + 1, 0), ord = {1};
    for (int i = 0; i < (int)ord.size(); i++) { int v = ord[i]; for (int u : g[v]) if (u != par[v]) { par[u] = v; ord.push_back(u); } }
    // (1) vc[v][1] = v no conjunto; vc[v][0] = v fora -> todos os filhos dentro
    vector<array<ll,2>> vc(n + 1);
    // (2) ds[v][0] = v no conjunto
    //     ds[v][1] = v fora, dominado por algum filho
    //     ds[v][2] = v fora, ainda NÃO dominado (o pai terá que estar no conjunto)
    vector<array<ll,3>> ds(n + 1);
    for (int i = n - 1; i >= 0; i--) {
        int v = ord[i];
        vc[v] = {0, c[v]};
        ll in = c[v], sem = 0, extra = INF; bool algum = false;
        for (int u : g[v]) if (u != par[v]) {
            vc[v][0] += vc[u][1];
            vc[v][1] += min(vc[u][0], vc[u][1]);
            in += min({ds[u][0], ds[u][1], ds[u][2]});          // u já está dominado por v
            ll melhor = min(ds[u][0], ds[u][1]);                 // u fora do alcance de v: precisa se resolver
            sem += melhor;
            if (ds[u][0] <= ds[u][1]) algum = true;              // já usa um filho no conjunto
            else extra = min(extra, ds[u][0] - ds[u][1]);         // custo de forçar um filho no conjunto
        }
        ds[v][0] = in;
        ds[v][2] = sem;                                           // nenhum filho precisa estar no conjunto
        bool temFilho = false; for (int u : g[v]) if (u != par[v]) temFilho = true;
        ds[v][1] = !temFilho ? INF : (algum ? sem : sem + extra);
    }
    cout << min(vc[1][0], vc[1][1]) << ' ' << min(ds[1][0], ds[1][1]) << '\n';
}
```

Exemplo testado — entrada:

```text
5
1 1 1 1 1
1 2
1 3
3 4
3 5
```

saída:

```text
2 2
```

> Verificação: 400 árvores aleatórias com pesos contra todos os subconjuntos.
