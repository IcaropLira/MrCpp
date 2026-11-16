---
title: Eertree — árvore de palíndromos
summary: Mantém todos os palíndromos distintos de uma string em O(n) nós.
status: done
complexity: O(n) esperado com transições hash; O(n sigma) com alfabeto fixo
tags: strings, palindromo, eertree
---

## Quando usar

Para contar palíndromos distintos, obter o maior palíndromo que termina em cada posição ou fazer DP sobre sufixos palindrômicos.

## Ideia

Cada nó representa um palíndromo distinto. Há duas raízes artificiais de comprimentos -1 e 0. Ao adicionar um caractere, siga os links de sufixo até encontrar um palíndromo que possa ser estendido.

## Código

Alfabeto minúsculo. Cada nó guarda len e link de sufixo.

~~~cpp
struct Eertree {
    struct Node {
        int len, link;
        array<int,26> next{};
        Node(int len = 0, int link = 0) : len(len), link(link) {}
    };

    vector<Node> t;
    string s;
    int last;

    Eertree() {
        t.emplace_back(-1, 0);
        t.emplace_back(0, 0);
        last = 1;
    }

    int get_link(int v, int pos) {
        while (pos - 1 - t[v].len < 0 ||
               s[pos - 1 - t[v].len] != s[pos])
            v = t[v].link;
        return v;
    }

    void add(char ch) {
        int c = ch - 'a';
        s.push_back(ch);
        int pos = (int)s.size() - 1;
        int cur = get_link(last, pos);

        if (!t[cur].next[c]) {
            int nw = t.size();
            t.emplace_back(t[cur].len + 2, 0);
            if (t[nw].len == 1) t[nw].link = 1;
            else {
                int p = get_link(t[cur].link, pos);
                t[nw].link = t[p].next[c];
            }
            t[cur].next[c] = nw;
        }
        last = t[cur].next[c];
    }

    int distinct() const { return (int)t.size() - 2; }
};
~~~

## Cuidados

- O código aceita apenas 'a'..'z'; adapte a estrutura para outro alfabeto.
- Cada caractere cria no máximo um novo nó, portanto há no máximo n+2 nós.
- last é o maior sufixo palindrômico da string atual.
- A implementação usa transições fixas e não precisa de hashing.
