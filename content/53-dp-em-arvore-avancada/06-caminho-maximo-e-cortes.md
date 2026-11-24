---
title: Caminho de soma máxima e cortes em árvore
summary: Maior soma de caminho com pesos negativos (duas maiores descidas) e Cut em all (componentes pares).
status: done
complexity: O(n)
tags: caminho máximo, diâmetro com pesos, cortes, componentes pares, dp em árvore
---

## Ideias

- **Caminho máximo** (vértices com pesos, podem ser negativos): todo caminho tem um vértice mais alto `v`; ele usa as **duas maiores descidas positivas** dos filhos. Com pesos nas arestas e todos ≥ 0, é o diâmetro.
- **Cortar arestas para componentes de tamanho par** (CF 982C): se `n` é ímpar é impossível; senão corte toda aresta `(v, pai)` com `sz[v]` par — guloso ótimo, pois cada corte assim é independente.
- Generalização: "componentes com tamanho múltiplo de k" ⇒ conte vértices com `sz[v] % k == 0`; possível ⇔ esse nº (incluindo a raiz) é `n/k`.

### Caminho máximo + Cut 'em all (CF 982C)

Juiz: <https://codeforces.com/problemset/problem/982/C>  
Complexidade: `O(n)`

Imprime a maior soma de caminho e o máximo de cortes (−1 se n ímpar).

```cpp
// (a) Caminho de soma máxima (pesos nos vértices, podem ser negativos; caminho com ≥ 1 vértice)
//     desce[v] = w[v] + max(0, maior desce dos filhos);  resposta = max_v w[v] + duas maiores descidas positivas
// (b) Cut 'em all (CF 982C): máximo de arestas removíveis para todas as componentes terem tamanho PAR
//     (−1 se n ímpar). Corta a aresta (v, pai) sempre que sz[v] é par.
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<ll> w(n + 1); for (int i = 1; i <= n; i++) cin >> w[i];
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; g[a].push_back(b); g[b].push_back(a); }
    vector<int> par(n + 1, 0), ord = {1};
    for (int i = 0; i < (int)ord.size(); i++) { int v = ord[i]; for (int u : g[v]) if (u != par[v]) { par[u] = v; ord.push_back(u); } }
    vector<ll> desce(n + 1); vector<int> sz(n + 1, 1);
    ll best = LLONG_MIN; int cortes = 0;
    for (int i = n - 1; i >= 0; i--) {
        int v = ord[i]; ll m1 = 0, m2 = 0;                       // duas maiores descidas positivas
        for (int u : g[v]) if (u != par[v]) {
            sz[v] += sz[u];
            ll x = max(0LL, desce[u]);
            if (x > m1) { m2 = m1; m1 = x; } else if (x > m2) m2 = x;
        }
        desce[v] = w[v] + m1;
        best = max(best, w[v] + m1 + m2);
        if (v != 1 && sz[v] % 2 == 0) cortes++;
    }
    cout << best << ' ' << (n % 2 ? -1 : cortes) << '\n';
}
```

Exemplo testado — entrada:

```text
6
2 -5 3 1 4 -1
1 2
1 3
3 4
3 5
5 6
```

saída:

```text
9 2
```


> Verificação: 400 árvores aleatórias contra todos os caminhos e todos os subconjuntos de cortes.
