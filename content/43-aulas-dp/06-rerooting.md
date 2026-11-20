---
title: Rerooting DP (aula)
summary: Soma das distâncias, maior distância e AtCoder DP V (Subtree) para todas as raízes.
status: done
complexity: O(n)
tags: rerooting, dp em árvore, tree distances, aula
---

## Ideia

1ª passada (sobe): resposta da subárvore com raiz fixa. 2ª passada (desce): o que vem "de cima" (`up`). Ao trocar a raiz de `v` para o filho `c`, só a aresta `(v, c)` muda de dono.

### Tree Distances II (CSES 1133) — soma das distâncias

Juiz: <https://cses.fi/problemset/task/1133>  
Complexidade: `O(n)`

Contribuição da aresta = tamanho da subárvore abaixo. `ans[c] = ans[v] + n − 2·sub[c]`.

```cpp
// CSES 1133 - Tree Distances II: soma das distâncias de cada nó (rerooting)
// ans[raiz] = soma de sub[v] para v != raiz  (contribuição de cada aresta)
// ans[filho] = ans[pai] + n - 2*sub[filho]
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    vector<int> pai(n + 1, 0), ordem = {1};
    for (int i = 0; i < (int)ordem.size(); i++) {
        int v = ordem[i];
        for (int u : adj[v]) if (u != pai[v]) { pai[u] = v; ordem.push_back(u); }
    }
    vector<ll> sub(n + 1, 1), ans(n + 1, 0);
    for (int i = n - 1; i > 0; i--) sub[pai[ordem[i]]] += sub[ordem[i]];
    for (int v = 2; v <= n; v++) ans[1] += sub[v];
    for (int i = 1; i < n; i++) { int v = ordem[i]; ans[v] = ans[pai[v]] + n - 2 * sub[v]; }
    for (int v = 1; v <= n; v++) cout << ans[v] << " \n"[v == n];
}
```

Exemplo testado — entrada:

```text
5
1 2
1 3
3 4
3 5
```

saída:

```text
6 9 5 8 8
```


### Tree Distances I (CSES 1132) — maior distância

Juiz: <https://cses.fi/problemset/task/1132>  
Complexidade: `O(n)`

Guarda as duas maiores descidas `d1`, `d2` e por qual filho veio `d1`.

```cpp
// CSES 1132 - Tree Distances I: maior distância de cada nó (rerooting com d1, d2)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    vector<int> pai(n + 1, 0), ordem = {1};
    for (int i = 0; i < (int)ordem.size(); i++) {
        int v = ordem[i];
        for (int u : adj[v]) if (u != pai[v]) { pai[u] = v; ordem.push_back(u); }
    }
    vector<int> d1(n + 1, 0), d2(n + 1, 0), via(n + 1, 0), up(n + 1, 0);
    for (int i = n - 1; i > 0; i--) {                 // 1ª passada: sobe (filhos antes do pai)
        int v = ordem[i], p = pai[v], x = d1[v] + 1;
        if (x > d1[p]) { d2[p] = d1[p]; d1[p] = x; via[p] = v; }
        else if (x > d2[p]) d2[p] = x;
    }
    for (int i = 1; i < n; i++) {                     // 2ª passada: desce
        int v = ordem[i], p = pai[v];
        int irmao = (via[p] == v ? d2[p] : d1[p]);   // melhor descida de p que não usa v
        up[v] = 1 + max(up[p], irmao);
    }
    for (int v = 1; v <= n; v++) cout << max(d1[v], up[v]) << " \n"[v == n];
}
```

Exemplo testado — entrada:

```text
5
1 2
1 3
3 4
3 5
```

saída:

```text
2 3 2 3 3
```


### Subtree (AtCoder DP V)

Juiz: <https://atcoder.jp/contests/dp/tasks/dp_v>  
Complexidade: `O(n)`

`M` não é primo: sem inverso → produtos de prefixo e sufixo dos irmãos.

```cpp
// AtCoder DP V - Subtree: para cada v, pinturas com pretos conexos e v preto (mod M, M não primo)
// down[v] = prod(down[c] + 1); up[c] = up[v] * prod_{irmãos}(down + 1) + 1 (prefixo/sufixo, sem divisão)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; ll M; cin >> n >> M;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    vector<int> pai(n + 1, 0), ordem = {1};
    for (int i = 0; i < (int)ordem.size(); i++) {
        int v = ordem[i];
        for (int u : adj[v]) if (u != pai[v]) { pai[u] = v; ordem.push_back(u); }
    }
    vector<ll> down(n + 1, 1), up(n + 1, 1);
    for (int i = n - 1; i > 0; i--) { int v = ordem[i]; down[pai[v]] = down[pai[v]] * (down[v] + 1) % M; }
    for (int i = 0; i < n; i++) {
        int v = ordem[i];
        vector<int> f;
        for (int u : adj[v]) if (u != pai[v]) f.push_back(u);
        int k = f.size();
        vector<ll> pre(k + 1, 1);
        for (int j = 0; j < k; j++) pre[j + 1] = pre[j] * (down[f[j]] + 1) % M;
        ll suf = 1;
        for (int j = k - 1; j >= 0; j--) {
            up[f[j]] = (up[v] * pre[j] % M * suf + 1) % M;
            suf = suf * (down[f[j]] + 1) % M;
        }
    }
    for (int v = 1; v <= n; v++) cout << down[v] * up[v] % M << '\n';
}
```

Exemplo testado — entrada:

```text
3 100
1 2
2 3
```

saída:

```text
3
4
3
```
