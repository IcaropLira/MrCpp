---
title: Trie
summary: Árvore de prefixos.
status: done
complexity: O(|s|)
tags: strings, trie
---

## Ideia

Cada nó guarda os filhos por letra; o caminho da raiz até um nó forma um prefixo.

## Código

```cpp
struct Trie {
    vector<array<int, 26>> t{array<int, 26>{}};
    vector<int> cnt{0};
    void add(const string& s) {
        int u = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (!t[u][c]) t[u][c] = t.size(), t.push_back({}), cnt.push_back(0);
            u = t[u][c];
        }
        cnt[u]++;
    }
    bool has(const string& s) {
        int u = 0;
        for (char ch : s) { u = t[u][ch - 'a']; if (!u) return false; }
        return cnt[u];
    }
};
```
