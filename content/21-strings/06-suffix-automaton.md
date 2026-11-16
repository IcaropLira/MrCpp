---
title: Suffix Automaton
summary: Autômato mínimo que reconhece todas as substrings de uma string.
status: done
complexity: O(n) estados e transições amortizados com alfabeto fixo; O(n log σ) com map
tags: strings, suffix automaton, substrings
---

## Quando usar

Testar se uma substring existe, contar substrings distintas, contar ocorrências e encontrar propriedades de substrings.

## Código

~~~cpp
struct SuffixAutomaton {
    struct State {
        int len = 0, link = -1;
        map<char,int> next;
    };

    vector<State> st;
    int last;

    SuffixAutomaton(int n = 0) {
        st.reserve(2*n + 1);
        st.push_back({});
        last = 0;
    }

    void add(char ch) {
        int cur = st.size();
        st.push_back({});
        st[cur].len = st[last].len + 1;

        int p = last;
        while (p != -1 && !st[p].next.count(ch)) {
            st[p].next[ch] = cur;
            p = st[p].link;
        }

        if (p == -1) st[cur].link = 0;
        else {
            int q = st[p].next[ch];
            if (st[p].len + 1 == st[q].len) st[cur].link = q;
            else {
                int clone = st.size();
                st.push_back(st[q]);
                st[clone].len = st[p].len + 1;

                while (p != -1 && st[p].next[ch] == q) {
                    st[p].next[ch] = clone;
                    p = st[p].link;
                }
                st[q].link = st[cur].link = clone;
            }
        }
        last = cur;
    }

    bool contains(const string& s) const {
        int u = 0;
        for (char ch : s) {
            auto it = st[u].next.find(ch);
            if (it == st[u].next.end()) return false;
            u = it->second;
        }
        return true;
    }

    long long distinct_substrings() const {
        long long ans = 0;
        for (int v = 1; v < (int)st.size(); v++)
            ans += st[v].len - st[st[v].link].len;
        return ans;
    }
};

// Construa chamando add(ch) para cada caractere da string.
~~~

## Cuidados

- O autômato tem no máximo 2n-1 estados para n > 1.
- O número de substrings distintas é Σ(len[v] - len[link[v]]) para v != raiz.
- Com map, as operações custam O(log σ); com vetor de alfabeto fixo, podem ser O(1).
- A função contains aceita qualquer substring, não apenas sufixos.
