---
title: Aho-Corasick
summary: Autômato que procura vários padrões ao mesmo tempo em O(|texto| + total de padrões + ocorrências).
status: done
complexity: O(Σ|padrões| · alfabeto + |texto|)
tags: strings, aho-corasick, trie, múltiplos padrões
---

## Ideia

Monte uma trie com todos os padrões. Para cada nó, o *link de falha* aponta para o maior sufixo próprio dele que também é prefixo de algum padrão. Calculando por BFS, completa-se o autômato (transições que faltam herdam as do link). Ao percorrer o texto, cada posição está em um nó; todos os padrões que terminam ali são o próprio nó e os nós da cadeia de links. Para contar ocorrências de cada padrão, conte visitas por nó e propague para os links em ordem inversa da BFS.

## Código

```cpp
struct AhoCorasick {
    static const int A = 26;
    vector<array<int, A>> nx;
    vector<int> link, ordem, fim;  // fim[i] = nó em que o padrão i termina
    AhoCorasick() { novo(); }
    int novo() { nx.push_back({}); nx.back().fill(-1); link.push_back(0); return nx.size() - 1; }

    void add(const string& s) {  // letras minúsculas
        int v = 0;
        for (char ch : s) {
            int c = ch - 'a';
            if (nx[v][c] < 0) { int u = novo(); nx[v][c] = u; }
            v = nx[v][c];
        }
        fim.push_back(v);
    }
    void constroi() {
        queue<int> q;
        for (int c = 0; c < A; c++) {
            if (nx[0][c] < 0) nx[0][c] = 0;
            else q.push(nx[0][c]);
        }
        while (!q.empty()) {
            int v = q.front(); q.pop();
            ordem.push_back(v);
            for (int c = 0; c < A; c++) {
                int u = nx[v][c];
                if (u < 0) nx[v][c] = nx[link[v]][c];
                else { link[u] = nx[link[v]][c]; q.push(u); }
            }
        }
    }
    // ocorrências (com sobreposição) de cada padrão no texto
    vector<ll> conta(const string& t) {
        vector<ll> visitas(nx.size(), 0);
        int v = 0;
        for (char ch : t) v = nx[v][ch - 'a'], visitas[v]++;
        for (int i = (int)ordem.size() - 1; i >= 0; i--) visitas[link[ordem[i]]] += visitas[ordem[i]];
        vector<ll> r(fim.size());
        for (size_t i = 0; i < fim.size(); i++) r[i] = visitas[fim[i]];
        return r;
    }
};
```

## Complexidade e cuidados

- Chame `constroi()` depois de adicionar todos os padrões e antes de `conta`.
- Padrões repetidos terminam no mesmo nó e recebem a mesma contagem. Padrão vazio não é suportado.
- Memória `O(nós · 26)` inteiros; para alfabeto grande use `map` ou ordene os filhos.
- Para só saber *se* algum padrão aparece, marque `terminal[v] |= terminal[link[v]]` na BFS.
