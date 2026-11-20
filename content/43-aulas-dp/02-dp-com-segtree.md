---
title: DP acelerada por Segment Tree / BIT
summary: Flowers, Smooth Subsequence, LIS, contagem de crescentes, Pillars e Subsequences: a estrutura é indexada pelo VALOR.
status: done
complexity: O(n log n)
tags: dp, segtree, bit, lis, compressão, aula
---

## Padrão

Quando `dp[i] = f(melhor dp[j] com j < i e valor[j] numa faixa)`, percorra `i` em ordem e mantenha uma segtree/BIT **indexada pelo valor** (comprimido, se preciso). Consultar a faixa e depois inserir `dp[i]` na posição do valor de `i`.

### Flowers (AtCoder DP Q)

Juiz: <https://atcoder.jp/contests/dp/tasks/dp_q>  
Complexidade: `O(n log n)`

Posição = altura; consulta máximo em `[0, h−1]`.

```cpp
// AtCoder DP Q - Flowers: dp[i] = a[i] + max dp com altura < h[i]
// segtree de máximo indexada pela ALTURA (posição = valor)
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct SegMax {                       // iterativa, ponto + máximo em [l, r]
    int n; vector<ll> t;
    SegMax(int n_) : n(n_), t(2 * n_, 0) {}
    void upd(int p, ll v) {
        p += n; t[p] = max(t[p], v);
        for (p >>= 1; p; p >>= 1) t[p] = max(t[2 * p], t[2 * p + 1]);
    }
    ll query(int l, int r) {          // [l, r]; vazio -> 0
        ll res = 0;
        for (l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {
            if (l & 1) res = max(res, t[l++]);
            if (r & 1) res = max(res, t[--r]);
        }
        return res;
    }
};

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<int> h(n); vector<ll> a(n);
    for (auto &x : h) cin >> x;
    for (auto &x : a) cin >> x;
    SegMax st(n + 1);
    for (int i = 0; i < n; i++) st.upd(h[i], st.query(0, h[i] - 1) + a[i]);
    cout << st.query(0, n) << '\n';
}
```

Exemplo testado — entrada:

```text
4
3 1 4 2
10 20 30 40
```

saída:

```text
60
```


### Smooth Subsequence (ABC339 E)

Juiz: <https://atcoder.jp/contests/abc339/tasks/abc339_e>  
Complexidade: `O(n log V)`

Posição = valor; consulta `[x−D, x+D]`.

```cpp
// ABC339 E - Smooth Subsequence: dp[x] = 1 + max dp em valores [x-D, x+D]
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, d; cin >> n >> d;
    vector<int> a(n); for (auto &x : a) cin >> x;
    int V = *max_element(a.begin(), a.end()) + 1;
    vector<int> t(2 * V, 0);                               // segtree iterativa de máximo
    auto upd = [&](int p, int v) { for (p += V, t[p] = max(t[p], v); p >>= 1;) t[p] = max(t[2 * p], t[2 * p + 1]); };
    auto qry = [&](int l, int r) { int res = 0; for (l += V, r += V + 1; l < r; l >>= 1, r >>= 1) { if (l & 1) res = max(res, t[l++]); if (r & 1) res = max(res, t[--r]); } return res; };
    int ans = 0;
    for (int x : a) {
        int best = qry(max(0, x - d), min(V - 1, x + d)) + 1;
        upd(x, best); ans = max(ans, best);
    }
    cout << ans << '\n';
}
```

Exemplo testado — entrada:

```text
4 2
3 5 1 2
```

saída:

```text
3
```


### Increasing Subsequence (CSES 1145)

Juiz: <https://cses.fi/problemset/task/1145>  
Complexidade: `O(n log n)`

Compressão + máximo de prefixo em `[1, p−1]` (estritamente menores).

```cpp
// CSES 1145 - LIS com compressão + BIT de máximo (estritamente crescente)
// (alternativa clássica: lower_bound em O(n log n), ver tópico LIS)
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<int> x(n); for (auto &v : x) cin >> v;
    vector<int> vals(x); sort(vals.begin(), vals.end()); vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = vals.size();
    vector<int> bit(m + 1, 0);                             // BIT de máximo de prefixo (só aumenta)
    auto upd = [&](int i, int v) { for (; i <= m; i += i & -i) bit[i] = max(bit[i], v); };
    auto pref = [&](int i) { int r = 0; for (; i > 0; i -= i & -i) r = max(r, bit[i]); return r; };
    int ans = 0;
    for (int v : x) {
        int p = lower_bound(vals.begin(), vals.end(), v) - vals.begin() + 1;
        int dp = pref(p - 1) + 1;                          // valores estritamente menores
        upd(p, dp); ans = max(ans, dp);
    }
    cout << ans << '\n';
}
```

Exemplo testado — entrada:

```text
8
7 3 5 3 6 2 9 8
```

saída:

```text
4
```


### Increasing Subsequence II (CSES 1748)

Juiz: <https://cses.fi/problemset/task/1748>  
Complexidade: `O(n log n)`

`dp = 1 + soma` dos menores; resposta = soma de todos os `dp`.

```cpp
// CSES 1748 - Increasing Subsequence II: conta subsequências estritamente crescentes
// dp[i] = 1 + soma dp[j] com x[j] < x[i]  -> BIT de soma indexada pelo valor comprimido
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1e9 + 7;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<int> x(n); for (auto &v : x) cin >> v;
    vector<int> vals(x); sort(vals.begin(), vals.end()); vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = vals.size();
    vector<long long> bit(m + 1, 0);
    auto add = [&](int i, long long v) { for (; i <= m; i += i & -i) bit[i] = (bit[i] + v) % MOD; };
    auto pref = [&](int i) { long long r = 0; for (; i > 0; i -= i & -i) r = (r + bit[i]) % MOD; return r; };
    long long total = 0;
    for (int v : x) {
        int p = lower_bound(vals.begin(), vals.end(), v) - vals.begin() + 1;
        long long dp = (1 + pref(p - 1)) % MOD;            // 1 = só ele
        add(p, dp); total = (total + dp) % MOD;
    }
    cout << total << '\n';
}
```

Exemplo testado — entrada:

```text
3
2 1 3
```

saída:

```text
5
```


### Pillars (CF 474E)

Juiz: <https://codeforces.com/problemset/problem/474/E>  
Complexidade: `O(n log n)`

Guarda o par `(dp, índice)` para reconstruir; consulta as duas faixas `≤ h−d` e `≥ h+d`.

```cpp
// CF 474E - Pillars: salto i->j (i<j) se |h[i]-h[j]| >= d; maior sequência + reconstrução
// segtree de (dp, índice) por altura comprimida; consulta em [0, r1] e [l2, m-1]
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
using P = pair<int,int>;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; ll d; cin >> n >> d;
    vector<ll> h(n); for (auto &x : h) cin >> x;
    vector<ll> vals(h); sort(vals.begin(), vals.end()); vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = vals.size();
    vector<P> t(2 * m, {0, -1});
    auto upd = [&](int p, P v) { for (p += m, t[p] = max(t[p], v); p >>= 1;) t[p] = max(t[2 * p], t[2 * p + 1]); };
    auto qry = [&](int l, int r) { P res = {0, -1}; if (l > r) return res;
        for (l += m, r += m + 1; l < r; l >>= 1, r >>= 1) { if (l & 1) res = max(res, t[l++]); if (r & 1) res = max(res, t[--r]); } return res; };
    vector<int> dp(n), pai(n);
    for (int i = 0; i < n; i++) {
        int r1 = upper_bound(vals.begin(), vals.end(), h[i] - d) - vals.begin() - 1; // último <= h-d
        int l2 = lower_bound(vals.begin(), vals.end(), h[i] + d) - vals.begin();     // primeiro >= h+d
        P best = max(qry(0, r1), qry(l2, m - 1));
        dp[i] = best.first + 1; pai[i] = best.second;
        upd(lower_bound(vals.begin(), vals.end(), h[i]) - vals.begin(), {dp[i], i});
    }
    int i = max_element(dp.begin(), dp.end()) - dp.begin();
    vector<int> seq;
    for (; i != -1; i = pai[i]) seq.push_back(i + 1);
    reverse(seq.begin(), seq.end());
    cout << seq.size() << '\n';
    for (size_t k = 0; k < seq.size(); k++) cout << seq[k] << " \n"[k + 1 == seq.size()];
}
```

Exemplo testado — entrada:

```text
5 2
1 3 6 7 4
```

saída:

```text
4
1 2 4 5
```


### Subsequences (CF 597C)

Juiz: <https://codeforces.com/problemset/problem/597/C>  
Complexidade: `O(n · k · log n)`

Uma BIT por tamanho `c`: `f[c][x] += soma f[c−1][< x]`. Resposta até 8·10¹⁸: `long long`.

```cpp
// CF 597C - Subsequences: subsequências crescentes com k+1 elementos
// f[c][x] = nº de crescentes de tamanho c terminando no valor x; uma BIT por tamanho
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    int n, k; cin >> n >> k;
    int K = k + 1;
    vector<vector<ll>> bit(K + 1, vector<ll>(n + 1, 0));
    auto add = [&](int c, int i, ll v) { for (; i <= n; i += i & -i) bit[c][i] += v; };
    auto pref = [&](int c, int i) { ll r = 0; for (; i > 0; i -= i & -i) r += bit[c][i]; return r; };
    for (int i = 0; i < n; i++) {
        int x; cin >> x;
        add(1, x, 1);
        for (int c = 2; c <= K; c++) add(c, x, pref(c - 1, x - 1));
    }
    cout << pref(K, n) << '\n';
}
```

Exemplo testado — entrada:

```text
5 2
1
2
3
5
4
```

saída:

```text
7
```
