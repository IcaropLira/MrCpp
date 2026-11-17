---
title: Suffix automaton generalizado
summary: Autômato de sufixos de várias strings, com contagem de ocorrências totais e substrings distintas do conjunto.
status: done
complexity: O(soma dos tamanhos * sigma)
tags: strings, suffix automaton, múltiplas strings, ocorrências
---

## Ideia

No autômato generalizado, cada string é inserida recomeçando na raiz (`last = 0`). A diferença para o caso de uma string é que a transição `last -> c` pode já existir, pois outra string passou por ali. Nesse caso não se cria estado novo: se `len[q] == len[last] + 1` o estado `q` já serve; senão, clonamos `q` com `len = len[last] + 1` e o clone vira o estado do prefixo atual. Evita-se assim estados vazios que quebrariam a contagem.

Para ocorrências, cada posição final de prefixo (estado devolvido por `extend`) recebe `cnt += 1`, clones nascem com 0, e `finalize` propaga `cnt` ao longo dos links em ordem decrescente de `len`. Então `cnt[v]` é o número total de ocorrências, somadas sobre todas as strings, das substrings do estado `v`.

## Código

~~~cpp
struct GenSAM {
    struct State { int len = 0, link = -1; array<int,2> next; ll cnt = 0; State() { next.fill(-1); } };
    vector<State> st;
    bool ready = false;

    GenSAM() { st.emplace_back(); } // alfabeto {a, b}: ajuste array<int,2> e 'a' para outro

    int extend(int last, int c) {
        if (st[last].next[c] != -1) { // transição já existe (outra string passou aqui)
            int q = st[last].next[c];
            if (st[q].len == st[last].len + 1) return q;
            int cl = st.size();
            st.push_back(st[q]);
            st[cl].len = st[last].len + 1;
            st[cl].cnt = 0;
            st[q].link = cl;
            for (int p = last; p != -1 && st[p].next[c] == q; p = st[p].link) st[p].next[c] = cl;
            return cl;
        }
        int cur = st.size();
        st.emplace_back();
        st[cur].len = st[last].len + 1;
        int p = last;
        while (p != -1 && st[p].next[c] == -1) st[p].next[c] = cur, p = st[p].link;
        if (p == -1) st[cur].link = 0;
        else {
            int q = st[p].next[c];
            if (st[p].len + 1 == st[q].len) st[cur].link = q;
            else {
                int cl = st.size();
                st.push_back(st[q]);
                st[cl].len = st[p].len + 1;
                st[cl].cnt = 0;
                while (p != -1 && st[p].next[c] == q) st[p].next[c] = cl, p = st[p].link;
                st[q].link = st[cur].link = cl;
            }
        }
        return cur;
    }

    void add(const string& s) { // cada string recomeça da raiz
        int last = 0;
        for (char ch : s) {
            last = extend(last, ch - 'a');
            st[last].cnt++; // posição final de um prefixo desta string
        }
        ready = false;
    }

    // propaga cnt: depois, cnt[v] = ocorrências totais (em todas as strings) das substrings de v
    void finalize() {
        vector<int> ord(st.size());
        iota(ord.begin(), ord.end(), 0);
        sort(ord.begin(), ord.end(), [&](int a, int b) { return st[a].len > st[b].len; });
        for (int v : ord) if (st[v].link >= 0) st[st[v].link].cnt += st[v].cnt;
        ready = true; // chame de novo só após zerar/recriar: finalize não é idempotente
    }

    ll occurrences(const string& t) const {
        int v = 0;
        for (char ch : t) {
            v = st[v].next[ch - 'a'];
            if (v == -1) return 0;
        }
        return st[v].cnt;
    }

    ll distinct_substrings() const { // sem a substring vazia
        ll r = 0;
        for (int v = 1; v < (int)st.size(); v++) r += st[v].len - st[st[v].link].len;
        return r;
    }
};
~~~

## Complexidade e cuidados

- Alfabeto `{a, b}` no snippet; para 26 letras troque `array<int,2>` por `array<int,26>`.
- Chame `add` para todas as strings e `finalize` uma única vez; adicionar depois exige reconstruir o `cnt`.
- `occurrences` conta ocorrências sobrepostas e somadas entre strings (não o número de strings distintas que contêm).
- `distinct_substrings` conta substrings distintas do conjunto (sem a vazia).
- Estados: no máximo `2 * (soma dos tamanhos)`; a ordenação por `len` pode virar counting sort.
- String vazia em `add` é permitida e não altera nada.
