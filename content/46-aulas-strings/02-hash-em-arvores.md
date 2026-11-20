---
title: Hash em árvores: isomorfismo (aula)
summary: Forma canônica com filhos ordenados: ids sem colisão (AHU) ou hash polinomial de parênteses.
status: done
complexity: O(n log n)
tags: isomorfismo, hash, árvore, ahu, aula
---

## Ideia

Linearização com `(` na entrada e `)` na saída depende da ordem de visita. Construa **bottom-up**, ordene os filhos pela sua representação e concatene: `( filho₁ filho₂ … )`. Mesma estrutura ⇔ mesma representação.

### Tree Isomorphism I (CSES 1700) — ids canônicos (sem colisão)

Juiz: <https://cses.fi/problemset/task/1700>  
Complexidade: `O(n log n)`

O `map` precisa ser o mesmo para as duas árvores.

```cpp
// CSES 1700 - Tree Isomorphism I (enraizadas em 1)
// Forma canônica: filhos ordenados -> mesma estrutura <=> mesmo identificador.
// Versão sem colisão: map<vector<int>, int> dá um id a cada multiconjunto ordenado de ids dos filhos (AHU).
// (o hash polinomial de parênteses da aula também funciona; ver o tópico de teoria)
#include <bits/stdc++.h>
using namespace std;

map<vector<int>, int> ids;                     // compartilhado entre as duas árvores!
int canon(int n, const vector<vector<int>> &adj) {
    vector<int> pai(n + 1, 0), ordem = {1}, id(n + 1);
    for (int i = 0; i < (int)ordem.size(); i++) { int v = ordem[i]; for (int u : adj[v]) if (u != pai[v]) { pai[u] = v; ordem.push_back(u); } }
    for (int i = n - 1; i >= 0; i--) {
        int v = ordem[i];
        vector<int> f;
        for (int u : adj[v]) if (u != pai[v]) f.push_back(id[u]);
        sort(f.begin(), f.end());              // ordem padrão: a ordem de visita deixa de importar
        auto it = ids.find(f);
        id[v] = (it == ids.end() ? ids[f] = ids.size() : it->second);
    }
    return id[1];
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n; cin >> n;
        auto ler = [&]() { vector<vector<int>> adj(n + 1); for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); } return adj; };
        auto A = ler(), B = ler();
        cout << (canon(n, A) == canon(n, B) ? "YES" : "NO") << '\n';
    }
}
```

Exemplo testado — entrada:

```text
2
3
1 2
2 3
1 2
1 3
3
1 2
2 3
1 3
3 2
```

saída:

```text
NO
YES
```


### Tree Isomorphism I — hash polinomial de parênteses (versão da aula)

Juiz: <https://cses.fi/problemset/task/1700>  
Complexidade: `O(n log n)`

`(`=1, `)`=2; concatenar `X·Y`: `H(X)·B^|Y| + H(Y)`. Mod 2⁶¹−1 com base aleatória.

```cpp
// Mesmo problema, com o HASH DE PARÊNTESES da aula ("(" = 1, ")" = 2), filhos ordenados pelo hash
// H(concat(X, Y)) = H(X) * B^|Y| + H(Y);  depois "(" na frente: + 1*B^siz;  ")" no fim: *B + 2
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
const ll M = (1LL << 61) - 1;                  // mod Mersenne 2^61-1: colisão ~ n²/2^61
ll mulmod(ll a, ll b) { __int128 r = (__int128)a * b; r = (r & M) + (r >> 61); if (r >= M) r -= M; return (ll)r; }
ll B;

ll hash_arvore(int n, const vector<vector<int>> &adj) {
    vector<ll> P(2 * n + 2, 1);
    for (int i = 1; i <= 2 * n + 1; i++) P[i] = mulmod(P[i - 1], B);
    vector<int> pai(n + 1, 0), ordem = {1};
    for (int i = 0; i < (int)ordem.size(); i++) { int v = ordem[i]; for (int u : adj[v]) if (u != pai[v]) { pai[u] = v; ordem.push_back(u); } }
    vector<ll> H(n + 1, 0); vector<int> siz(n + 1, 0);
    for (int i = n - 1; i >= 0; i--) {
        int v = ordem[i];
        vector<pair<ll,int>> f;
        for (int u : adj[v]) if (u != pai[v]) f.push_back({H[u], siz[u]});
        sort(f.begin(), f.end());              // ordem padrão pelo hash
        for (auto [hu, su] : f) { H[v] = (mulmod(H[v], P[su]) + hu) % M; siz[v] += su; }
        H[v] = (H[v] + P[siz[v]]) % M;         // "(" na frente
        H[v] = (mulmod(H[v], B) + 2) % M;      // ")" no fim
        siz[v] += 2;
    }
    return H[1];
}

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    B = mt19937_64(chrono::steady_clock::now().time_since_epoch().count())() % (M - 1000) + 256;
    int t; cin >> t;
    while (t--) {
        int n; cin >> n;
        auto ler = [&]() { vector<vector<int>> adj(n + 1); for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); } return adj; };
        auto A = ler(), Bt = ler();
        cout << (hash_arvore(n, A) == hash_arvore(n, Bt) ? "YES" : "NO") << '\n';
    }
}
```

Exemplo testado — entrada:

```text
2
3
1 2
2 3
1 2
1 3
3
1 2
2 3
1 3
3 2
```

saída:

```text
NO
YES
```
