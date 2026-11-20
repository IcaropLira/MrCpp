---
title: Small to Large (aula)
summary: Caixas de bolas, Distinct Colors, Fixed-Length Paths I, Confluence e Lomsat gelral.
status: done
complexity: O(n log n) movimentos (· log com set/map)
tags: small to large, dsu on tree, set, map, aula
---

## Ideia

Antes de despejar a caixa `a` em `b`, se `a` for maior, **troque** as duas (`swap` de contêiner é O(1)). Cada elemento só se move estando na menor caixa, e a caixa dele no mínimo dobra → cada elemento se move `≤ log₂ N` vezes.

### Colored Ball (ABC329 F)

Juiz: <https://atcoder.jp/contests/abc329/tasks/abc329_f>  
Complexidade: `O((N + Q) log² N)`

Um `set` de cores por caixa.

```cpp
// ABC329 F - Colored Ball: mover caixa a para b e contar cores distintas em b
// small to large: sempre despeja o MENOR conjunto no maior (swap é O(1))
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    vector<set<int>> caixa(n + 1);
    for (int i = 1; i <= n; i++) { int c; cin >> c; caixa[i].insert(c); }
    while (q--) {
        int a, b; cin >> a >> b;
        if (caixa[a].size() > caixa[b].size()) swap(caixa[a], caixa[b]);   // O(1)
        for (int c : caixa[a]) caixa[b].insert(c);
        caixa[a].clear();
        cout << caixa[b].size() << '\n';
    }
}
```

Exemplo testado — entrada:

```text
6 5
1 1 1 2 2 3
1 2
6 4
5 1
3 6
4 6
```

saída:

```text
1
2
1
1
3
```


### Distinct Colors (CSES 1139)

Juiz: <https://cses.fi/problemset/task/1139>  
Complexidade: `O(n log² n)`

Cores da subárvore = união dos filhos. O vértice herda o maior conjunto.

```cpp
// CSES 1139 - Distinct Colors: cores distintas na subárvore = união dos filhos (small to large)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<int> cor(n + 1);
    for (int i = 1; i <= n; i++) cin >> cor[i];
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    vector<int> pai(n + 1, 0), ordem = {1};
    for (int i = 0; i < (int)ordem.size(); i++) { int v = ordem[i]; for (int u : adj[v]) if (u != pai[v]) { pai[u] = v; ordem.push_back(u); } }
    vector<set<int>> s(n + 1);
    vector<int> ans(n + 1);
    for (int i = n - 1; i >= 0; i--) {                    // filhos antes do pai
        int v = ordem[i];
        for (int u : adj[v]) if (u != pai[v] && s[u].size() > s[v].size()) swap(s[u], s[v]); // herda o maior
        s[v].insert(cor[v]);
        for (int u : adj[v]) if (u != pai[v]) { for (int c : s[u]) s[v].insert(c); set<int>().swap(s[u]); }
        ans[v] = s[v].size();
    }
    for (int v = 1; v <= n; v++) cout << ans[v] << " \n"[v == n];
}
```

Exemplo testado — entrada:

```text
5
2 3 2 2 1
1 2
1 3
3 4
3 5
```

saída:

```text
3 1 2 1 1
```


### Fixed-Length Paths I (CSES 2080)

Juiz: <https://cses.fi/problemset/task/2080>  
Complexidade: `O(n log² n)`

`cnt[v][prof absoluta]`; conta pares com o filho **antes** de juntar. Alvo = `k + 2·dep[u] − d`.

```cpp
// CSES 2080 - Fixed-Length Paths I: caminhos com exatamente k arestas
// cnt[v][prof] = vértices da subárvore na profundidade absoluta prof (map, small to large)
// par (x, y) com lca u: dep[x] + dep[y] - 2*dep[u] = k  ->  alvo = k + 2*dep[u] - d
// (há solução O(n) com deque/"long path"; esta é a da aula)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, k; cin >> n >> k;
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    vector<int> pai(n + 1, 0), dep(n + 1, 0), ordem = {1};
    for (int i = 0; i < (int)ordem.size(); i++) { int v = ordem[i]; for (int u : adj[v]) if (u != pai[v]) { pai[u] = v; dep[u] = dep[v] + 1; ordem.push_back(u); } }
    vector<map<int, ll>> cnt(n + 1);
    ll total = 0;
    for (int i = n - 1; i >= 0; i--) {
        int u = ordem[i];
        for (int c : adj[u]) if (c != pai[u] && cnt[c].size() > cnt[u].size()) swap(cnt[c], cnt[u]);
        auto pares = [&](int d, ll q) { auto it = cnt[u].find(k + 2 * dep[u] - d); return it == cnt[u].end() ? 0 : q * it->second; };
        total += pares(dep[u], 1);                       // u como ponta
        cnt[u][dep[u]] += 1;
        for (int c : adj[u]) if (c != pai[u]) {
            for (auto [d, q] : cnt[c]) total += pares(d, q);   // conta antes...
            for (auto [d, q] : cnt[c]) cnt[u][d] += q;         // ...depois junta
            map<int, ll>().swap(cnt[c]);
        }
    }
    cout << total << '\n';
}
```

Exemplo testado — entrada:

```text
5 2
1 2
2 3
3 4
3 5
```

saída:

```text
4
```


### Confluence (ABC183 F)

Juiz: <https://atcoder.jp/contests/abc183/tasks/abc183_f>  
Complexidade: `O((N + Q) log² N)`

DSU + `map` turma→quantidade; o menor map é despejado no maior.

```cpp
// ABC183 F - Confluence: DSU por tamanho + map turma->qtd; o menor map é despejado no maior
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    vector<int> pai(n + 1);
    iota(pai.begin(), pai.end(), 0);
    vector<map<int,int>> turma(n + 1);
    for (int i = 1; i <= n; i++) { int c; cin >> c; turma[i][c] = 1; }
    function<int(int)> find = [&](int x) { return pai[x] == x ? x : pai[x] = find(pai[x]); };
    while (q--) {
        int t, x, y; cin >> t >> x >> y;
        if (t == 1) {
            int a = find(x), b = find(y);
            if (a == b) continue;
            if (turma[a].size() > turma[b].size()) swap(a, b);     // a = menor
            for (auto [c, k] : turma[a]) turma[b][c] += k;
            map<int,int>().swap(turma[a]);
            pai[a] = b;
        } else {
            auto &mp = turma[find(x)];
            auto it = mp.find(y);
            cout << (it == mp.end() ? 0 : it->second) << '\n';
        }
    }
}
```

Exemplo testado — entrada:

```text
5 5
1 2 1 2 3
1 1 2
1 3 2
2 1 1
1 1 4
2 4 2
```

saída:

```text
2
2
```


### Lomsat gelral (CF 600E)

Juiz: <https://codeforces.com/contest/600/problem/E>  
Complexidade: `O(n log² n)`

Ao trocar os maps, troque junto `mx` (maior frequência) e `sm` (soma das dominantes).

```cpp
// CF 600E - Lomsat gelral: soma das cores dominantes de cada subárvore
// small to large com map cor->freq, guardando (maior freq, soma das cores com essa freq)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<int> cor(n + 1);
    for (int i = 1; i <= n; i++) cin >> cor[i];
    vector<vector<int>> adj(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; adj[a].push_back(b); adj[b].push_back(a); }
    vector<int> pai(n + 1, 0), ordem = {1};
    for (int i = 0; i < (int)ordem.size(); i++) { int v = ordem[i]; for (int u : adj[v]) if (u != pai[v]) { pai[u] = v; ordem.push_back(u); } }
    vector<map<int,int>> cnt(n + 1);
    vector<int> mx(n + 1, 0);
    vector<ll> sm(n + 1, 0), ans(n + 1);
    auto add = [&](int u, int c, int k) {
        int f = (cnt[u][c] += k);
        if (f > mx[u]) { mx[u] = f; sm[u] = c; }         // nova dominante
        else if (f == mx[u]) sm[u] += c;                 // empate: soma
    };
    for (int i = n - 1; i >= 0; i--) {
        int u = ordem[i];
        for (int c : adj[u]) if (c != pai[u] && cnt[c].size() > cnt[u].size()) {
            swap(cnt[c], cnt[u]); swap(mx[c], mx[u]); swap(sm[c], sm[u]);   // troca o pacote inteiro
        }
        add(u, cor[u], 1);
        for (int c : adj[u]) if (c != pai[u]) { for (auto [cc, k] : cnt[c]) add(u, cc, k); map<int,int>().swap(cnt[c]); }
        ans[u] = sm[u];
    }
    for (int v = 1; v <= n; v++) cout << ans[v] << " \n"[v == n];
}
```

Exemplo testado — entrada:

```text
4
1 2 3 4
1 2
2 3
2 4
```

saída:

```text
10 9 3 4
```
