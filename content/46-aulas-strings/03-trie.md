---
title: Trie e trie de bits (aula)
summary: Contagem de prefixos (ADAINDEX), Phone List, Maximum Xor Subarray e The 67th XOR Problem.
status: done
complexity: O(Σ|s|) · O(n · 30)
tags: trie, prefixo, xor, bit trie, aula
---

### Ada and Indexing (SPOJ ADAINDEX)

Juiz: <https://www.spoj.com/problems/ADAINDEX/>  
Complexidade: `O(Σ|palavras| + Σ|consultas|)`

`cnt[v]` = palavras que passam por `v` = palavras com aquele prefixo.

```cpp
// SPOJ ADAINDEX: quantas palavras têm a consulta como prefixo -> trie com contador por nó
#include <bits/stdc++.h>
using namespace std;

struct Trie {
    vector<array<int, 26>> nxt;   // nxt[v][c]: filho de v pela letra c (0 = não existe)
    vector<int> cnt;              // cnt[v]: palavras que passam por v (= têm esse prefixo)
    vector<int> fim;              // fim[v]: palavras que terminam em v
    Trie() { novo(); }
    int novo() { nxt.push_back({}); cnt.push_back(0); fim.push_back(0); return nxt.size() - 1; }
    void insert(const string &s) {
        int v = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (!nxt[v][c]) { int u = novo(); nxt[v][c] = u; }   // cuidado: novo() realoca nxt
            v = nxt[v][c];
            cnt[v]++;
        }
        fim[v]++;
    }
    int prefixos(const string &s) {
        int v = 0;
        for (char ch : s) { v = nxt[v][ch - 'a']; if (!v) return 0; }
        return cnt[v];
    }
};

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n, q; cin >> n >> q;
    Trie t;
    string s;
    for (int i = 0; i < n; i++) { cin >> s; t.insert(s); }
    while (q--) { cin >> s; cout << t.prefixos(s) << '\n'; }
}
```

Exemplo testado — entrada:

```text
12 6
bulldog
dog
dogged
doggedly
doggerel
dogma
dogmatic
dogmatism
dogs
catastroph
catastroph
doctor
cat
dog
dogg
do
doctrinography
dogge
```

saída:

```text
2
8
3
9
0
3
```


### Phone List (SPOJ PHONELST)

Juiz: <https://www.spoj.com/problems/PHONELST/>  
Complexidade: `O(n · 10) por caso`

Conflito: passar por um fim de palavra, ou terminar num nó já existente.

```cpp
// SPOJ PHONELST: lista consistente <=> nenhum número é prefixo de outro
// conflito ao inserir s: passa por um nó que é fim de palavra, OU termina num nó que já tem filhos/fim
#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n; cin >> n;
        vector<array<int, 10>> nxt(1); vector<bool> fim(1, false);
        nxt[0].fill(0);
        bool ok = true;
        for (int i = 0; i < n; i++) {
            string s; cin >> s;
            if (!ok) continue;                         // ainda precisa ler o resto
            int v = 0; bool criou = false;
            for (char ch : s) {
                if (fim[v]) { ok = false; break; }     // um número anterior é prefixo de s
                int c = ch - '0';
                if (!nxt[v][c]) { nxt[v][c] = nxt.size(); nxt.push_back({}); nxt.back().fill(0); fim.push_back(false); criou = true; }
                v = nxt[v][c];
            }
            if (ok && (!criou || fim[v])) ok = false;  // s é prefixo de um anterior (ou repetido)
            fim[v] = true;
        }
        cout << (ok ? "YES" : "NO") << '\n';
    }
}
```

Exemplo testado — entrada:

```text
2
3
911
97625999
91125426
5
113
12340
123440
12345
98346
```

saída:

```text
NO
YES
```


## Trie de bits

```cpp
// Trie binária (bit mais significativo primeiro): max(x ^ y) para y já inserido, em O(B)
struct XorTrie {
    static const int B = 30;                       // valores < 2^30
    vector<array<int, 2>> nx;
    XorTrie() { nx.push_back({0, 0}); }
    void insert(int x) {
        int v = 0;
        for (int i = B - 1; i >= 0; i--) {
            int b = x >> i & 1;
            if (!nx[v][b]) { nx[v][b] = nx.size(); nx.push_back({0, 0}); }
            v = nx[v][b];
        }
    }
    int best(int x) {                              // supõe trie não vazia
        int v = 0, r = 0;
        for (int i = B - 1; i >= 0; i--) {
            int b = x >> i & 1;
            if (nx[v][b ^ 1]) { r |= 1 << i; v = nx[v][b ^ 1]; }   // bit oposto: liga o bit i do xor
            else v = nx[v][b];
        }
        return r;
    }
};
```

### Maximum Xor Subarray (CSES 1655)

Juiz: <https://cses.fi/problemset/task/1655>  
Complexidade: `O(n · 30)`

`xor(l..r) = p[r] ^ p[l−1]`; insira `p[0] = 0` antes.

```cpp
// CSES 1655 - Maximum Xor Subarray: xor(l..r) = p[r] ^ p[l-1]; para cada r, melhor p anterior na trie
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct XorTrie (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    XorTrie t; t.insert(0);                        // prefixo vazio p[0] = 0
    int p = 0, r = 0;
    for (int i = 0; i < n; i++) { int x; cin >> x; p ^= x; r = max(r, t.best(p)); t.insert(p); }
    cout << r << '\n';
}
```

Exemplo testado — entrada:

```text
4
5 1 5 9
```

saída:

```text
13
```


### The 67th XOR Problem (CF 2218E)

Juiz: <https://codeforces.com/problemset/problem/2218/E>  
Complexidade: `O(n · 30)`

O que sobra é o xor de dois elementos → maior `a[i] ^ a[j]`.

```cpp
// CF 2218E - The 67th XOR Problem: a resposta é o maior a[i] ^ a[j] (i != j)
#include <bits/stdc++.h>
using namespace std;
// >>> cole aqui: struct XorTrie (bloco no início deste tópico)

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n; cin >> n;
        XorTrie tr; int r = 0;
        for (int i = 0; i < n; i++) { int x; cin >> x; if (i) r = max(r, tr.best(x)); tr.insert(x); }
        cout << r << '\n';
    }
}
```

Exemplo testado — entrada:

```text
3
2
67 67
3
1 2 3
10
67 667 167 867 267 467 367 567 767 967
```

saída:

```text
0
3
1012
```
