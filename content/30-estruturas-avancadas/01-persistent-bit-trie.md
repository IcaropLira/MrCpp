---
title: Persistent Binary Trie
summary: Trie binária persistente para máximo XOR em um intervalo de prefixos.
status: done
complexity: O(B) por inserção e consulta; O(nB) memória
tags: trie, xor, persistência, bitwise
---

## Quando usar

Quando precisamos maximizar x XOR a[i] em um intervalo [l,r], ou comparar versões de um conjunto de valores sem copiar toda a estrutura.

## Ideia

Cada raiz representa um prefixo do vetor. Ao inserir um valor, copiamos apenas os nós do caminho correspondente aos seus bits. Para consultar [l,r], subtraímos as contagens da raiz anterior das contagens da raiz atual e escolhemos gulosa e independentemente o bit oposto ao de x sempre que houver algum valor disponível.

## Código

Valores uint32_t, bits 31..0. A consulta recebe índices 1-based no vetor original.

~~~cpp
struct PersistentXorTrie {
    struct Node {
        int ch[2] = {0, 0};
        int cnt = 0;
    };

    vector<Node> t = {Node()};
    vector<int> root;

    int insert(int old, uint32_t x, int bit = 31) {
        int cur = t.size();
        t.push_back(t[old]);
        t[cur].cnt++;
        if (bit < 0) return cur;

        int b = (x >> bit) & 1U;
        int oldChild = t[old].ch[b];
        int child = insert(oldChild, x, bit - 1);
        t[cur].ch[b] = child;
        return cur;
    }

    void build(const vector<uint32_t>& a) {
        root.assign(a.size() + 1, 0);
        for (int i = 0; i < (int)a.size(); i++)
            root[i + 1] = insert(root[i], a[i]);
    }

    uint32_t max_xor(int l, int r, uint32_t x) const {
        // l e r são 1-based e inclusivos.
        int u = root[r], v = root[l - 1];
        uint32_t ans = 0;
        for (int bit = 31; bit >= 0; bit--) {
            int b = (x >> bit) & 1U;
            int want = b ^ 1;
            int a = t[u].ch[want], c = t[v].ch[want];
            if (t[a].cnt - t[c].cnt > 0) {
                ans |= (1U << bit);
                u = a; v = c;
            } else {
                u = t[u].ch[b];
                v = t[v].ch[b];
            }
        }
        return ans;
    }
};
~~~

## Cuidados

- O retorno é o valor máximo de XOR, não o elemento do vetor que o produz.
- O código pressupõe l <= r e intervalo válido.
- Cada inserção cria B+1 nós; reserve aproximadamente 1+n*33 nós para 32 bits.
- Para valores signed ou domínio menor, ajuste a representação e a quantidade de bits.
