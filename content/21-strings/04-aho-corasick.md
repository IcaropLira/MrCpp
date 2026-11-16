---
title: Aho-Corasick
summary: Busca várias palavras simultaneamente usando uma trie com links de falha.
status: done
complexity: O(Σ|p| + |texto| + ocorrências) para alfabeto fixo
tags: strings, trie, aho corasick
---

## Quando usar

Procurar muitas palavras em um mesmo texto. A trie compartilha prefixos e os links de falha permitem continuar a busca após uma incompatibilidade.

## Código

~~~cpp
struct AhoCorasick {
    static const int K = 26;
    struct Node {
        int next[K], link = 0;
        vector<int> out;
        Node() { fill(next, next + K, -1); }
    };

    vector<Node> t;

    AhoCorasick() { t.emplace_back(); }

    void add(const string& s, int id) {
        int u = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (t[u].next[c] == -1) {
                t[u].next[c] = t.size();
                t.emplace_back();
            }
            u = t[u].next[c];
        }
        t[u].out.push_back(id);
    }

    void build() {
        queue<int> q;
        for (int c = 0; c < K; c++) {
            int v = t[0].next[c];
            if (v == -1) t[0].next[c] = 0;
            else q.push(v);
        }

        while (!q.empty()) {
            int u = q.front(); q.pop();
            int f = t[u].link;
            for (int id : t[f].out) t[u].out.push_back(id);

            for (int c = 0; c < K; c++) {
                int v = t[u].next[c];
                if (v == -1) t[u].next[c] = t[f].next[c];
                else {
                    t[v].link = t[f].next[c];
                    q.push(v);
                }
            }
        }
    }

    vector<pair<int,int>> search(const string& s) const {
        vector<pair<int,int>> ans; // {fim exclusivo, id do padrão}
        int u = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            int c = s[i] - 'a';
            u = t[u].next[c];
            for (int id : t[u].out) ans.push_back({i+1, id});
        }
        return ans;
    }
};

// Padrões e texto devem conter apenas 'a'..'z'.
// Armazene também o tamanho de cada padrão para recuperar o início.
~~~
