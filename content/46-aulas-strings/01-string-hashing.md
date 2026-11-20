---
title: String hashing (aula)
summary: Hash duplo com base aleatória; comparação de trechos, matching, maior palíndromo e bordas.
status: done
complexity: O(n) pré · O(1) por trecho
tags: hash, rabin-karp, palíndromo, bordas, aula
---

## Struct

```cpp
// Hash polinomial duplo (mod 1e9+7 e 1e9+9) com base aleatória. hash(l, r) de s[l..r-1] em O(1).
// H[i+1] = H[i]*B + s[i];  hash(l, r) = H[r] - H[l]*B^(r-l)
struct Hash {
    static constexpr long long M1 = 1000000007, M2 = 1000000009;
    static long long B;
    vector<long long> h1, h2, p1, p2;
    Hash(const string &s) {
        int n = s.size();
        h1.assign(n + 1, 0); h2.assign(n + 1, 0); p1.assign(n + 1, 1); p2.assign(n + 1, 1);
        for (int i = 0; i < n; i++) {
            h1[i + 1] = (h1[i] * B + s[i]) % M1; p1[i + 1] = p1[i] * B % M1;
            h2[i + 1] = (h2[i] * B + s[i]) % M2; p2[i + 1] = p2[i] * B % M2;
        }
    }
    pair<long long,long long> get(int l, int r) const {             // [l, r)
        long long a = (h1[r] - h1[l] * p1[r - l]) % M1; if (a < 0) a += M1;
        long long b = (h2[r] - h2[l] * p2[r - l]) % M2; if (b < 0) b += M2;
        return {a, b};
    }
};
long long Hash::B = mt19937_64(chrono::steady_clock::now().time_since_epoch().count())() % 900000000 + 256;
```

### Trechos iguais (BARBARA)

Complexidade: `O(n + q)`

Compara `hash(i, i+k)` com `hash(j, j+k)`.

```cpp
// s[i..i+k-1] == s[j..j+k-1]?  -> compara dois hashes em O(1)
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct Hash (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s; int q; cin >> s >> q;
    Hash h(s);
    while (q--) {
        int i, j, k; cin >> i >> j >> k;
        cout << (h.get(i, i + k) == h.get(j, j + k) ? "SIM" : "NÃO") << '\n';
    }
}
```

Exemplo testado — entrada:

```text
BARBARA
2
0 3 3
0 1 3
```

saída:

```text
SIM
NÃO
```


### String Matching (CSES 1753)

Juiz: <https://cses.fi/problemset/task/1753>  
Complexidade: `O(n + m)`

Cada janela de tamanho `m` contra o hash do padrão.

```cpp
// CSES 1753 - String Matching (Rabin-Karp): conta ocorrências (com sobreposição)
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct Hash (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string t, p; cin >> t >> p;
    int n = t.size(), m = p.size();
    Hash ht(t), hp(p);
    auto alvo = hp.get(0, m);
    int resp = 0;
    for (int i = 0; i + m <= n; i++) resp += (ht.get(i, i + m) == alvo);
    cout << resp << '\n';
}
```

Exemplo testado — entrada:

```text
ababa
aba
```

saída:

```text
2
```


### Longest Palindrome (CSES 1111)

Juiz: <https://cses.fi/problemset/task/1111>  
Complexidade: `O(n)`

Hash da string e da reversa. O melhor tamanho aumenta no máximo 2 por posição.

```cpp
// CSES 1111 - Longest Palindrome com hash: s[l..r) é palíndromo <=> hash(s[l..r)) == hash do trecho no reverso
// Fato: se há palíndromo de tamanho L terminando em r, há um de L-2 terminando em r-1
//       -> o melhor tamanho cresce no máximo 2 por passo: testar só tam+2 e tam+1. O(n).
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct Hash (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s; cin >> s;
    int n = s.size();
    string rs(s.rbegin(), s.rend());
    Hash h(s), hr(rs);
    auto pal = [&](int l, int r) { return h.get(l, r) == hr.get(n - r, n - l); };
    int ini = 0, tam = 1;
    for (int r = 2; r <= n; r++)
        for (int L = min(tam + 2, r); L > tam; L--)
            if (pal(r - L, r)) { ini = r - L; tam = L; break; }
    cout << s.substr(ini, tam) << '\n';
}
```

Exemplo testado — entrada:

```text
banana
```

saída:

```text
anana
```


### Finding Borders (CSES 1732)

Juiz: <https://cses.fi/problemset/task/1732>  
Complexidade: `O(n)`

Prefixo de tamanho L == sufixo de tamanho L.

```cpp
// CSES 1732 - Finding Borders: prefixo de tamanho L == sufixo de tamanho L
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct Hash (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    string s; cin >> s;
    int n = s.size();
    Hash h(s);
    vector<int> r;
    for (int L = 1; L < n; L++) if (h.get(0, L) == h.get(n - L, n)) r.push_back(L);
    for (size_t i = 0; i < r.size(); i++) cout << r[i] << " \n"[i + 1 == r.size()];
    if (r.empty()) cout << '\n';
}
```

Exemplo testado — entrada:

```text
abaaba
```

saída:

```text
1 3
```
