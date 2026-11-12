---
title: Treap
summary: Árvore de busca binária aleatorizada que combina chave ou posição com prioridade aleatória.
status: done
complexity: O(log n) esperado por operação; O(n) no pior caso
tags: treap, árvore balanceada, ordem estatística, sequência
---

## Ideia

Cada nó respeita duas propriedades:

- **BST:** as chaves (ou posições implícitas) respeitam a ordem.
- **Heap:** a prioridade aleatória respeita a ordem de prioridade.

Prioridades independentes tornam a altura esperada O(log n). Não é garantia determinística: no pior caso a árvore pode degenerar para O(n).

## Treap implícita: sequência dinâmica

Na treap implícita, a chave de um nó é sua posição atual, calculada pelo tamanho da subárvore esquerda. Isso permite inserir, apagar, consultar o k-ésimo elemento e inverter um intervalo sem deslocar um vetor inteiro.

O código abaixo usa índices 0-based e split(t,k) separa os k primeiros elementos.

```cpp
mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());

struct Node {
    int val, pr, sz = 1;
    bool rev = false;
    Node *l = nullptr, *r = nullptr;
    Node(int v) : val(v), pr((int)rng()) {}
};

int size(Node* t) { return t ? t->sz : 0; }

void pull(Node* t) {
    if (t) t->sz = 1 + size(t->l) + size(t->r);
}

void push(Node* t) {
    if (!t || !t->rev) return;
    swap(t->l, t->r);
    if (t->l) t->l->rev ^= 1;
    if (t->r) t->r->rev ^= 1;
    t->rev = false;
}

// a recebe os k primeiros; b recebe o restante.
void split(Node* t, int k, Node*& a, Node*& b) {
    if (!t) { a = b = nullptr; return; }
    push(t);
    if (size(t->l) >= k) {
        split(t->l, k, a, t->l);
        b = t;
    } else {
        split(t->r, k-size(t->l)-1, t->r, b);
        a = t;
    }
    pull(t);
}

Node* merge(Node* a, Node* b) {
    if (!a) return b;
    if (!b) return a;
    if (a->pr > b->pr) {
        push(a);
        a->r = merge(a->r, b);
        pull(a);
        return a;
    }
    push(b);
    b->l = merge(a, b->l);
    pull(b);
    return b;
}

void insert(Node*& root, int pos, int value) {
    Node *a, *b;
    split(root, pos, a, b);
    root = merge(merge(a, new Node(value)), b);
}

void erase(Node*& root, int pos) {
    Node *a, *b, *mid, *c;
    split(root, pos, a, b);
    split(b, 1, mid, c);
    delete mid;
    root = merge(a, c);
}

int kth(Node* root, int k) {
    if (!root || k < 0 || k >= size(root)) return -1;
    push(root);
    int left = size(root->l);
    if (k < left) return kth(root->l, k);
    if (k == left) return root->val;
    return kth(root->r, k-left-1);
}

void reverse_range(Node*& root, int l, int r) {
    Node *a, *b, *mid, *c;
    split(root, l, a, b);
    split(b, r-l+1, mid, c);
    if (mid) mid->rev ^= 1;
    root = merge(a, merge(mid, c));
}
```

Operações: inserir na posição pos, apagar a posição pos, consultar kth(pos) e inverter [l,r]. Antes de consultar/apagar, garanta índices válidos. A rotina delete mid libera apenas o nó isolado; a subárvore mid é unitária após o segundo split.

## Treap por chave

Para um conjunto ordenado, use a chave explícita em vez da posição implícita. split por chave separa valores menores/maiores; size permite rank e k-ésimo. Para chaves repetidas, guarde multiplicidade no nó ou use um desempate único.

Com a mesma struct Node e merge já definidos, a versão por chave única usa:

```cpp
void split_key(Node* t, int key, Node*& a, Node*& b) {
    if (!t) { a = b = nullptr; return; }
    push(t);
    if (t->val < key) {
        split_key(t->r, key, t->r, b);
        a = t;
    } else {
        split_key(t->l, key, a, t->l);
        b = t;
    }
    pull(t);
}

bool contains(Node* t, int key) {
    while (t) {
        push(t);
        if (t->val == key) return true;
        t = (key < t->val ? t->l : t->r);
    }
    return false;
}

void insert_key(Node*& root, int key) {
    if (contains(root, key)) return; // conjunto: sem duplicatas
    Node *a, *b;
    split_key(root, key, a, b);
    root = merge(merge(a, new Node(key)), b);
}

Node* erase_key(Node* t, int key) {
    if (!t) return nullptr;
    push(t);
    if (t->val == key) {
        Node* res = merge(t->l, t->r);
        delete t;
        return res;
    }
    if (key < t->val) t->l = erase_key(t->l, key);
    else t->r = erase_key(t->r, key);
    pull(t);
    return t;
}
```

Use uma raiz separada para a treap por chave; não misture operações de reversão de sequência com a ordenação por chave. Para multiset, adicione um contador de ocorrências no nó.

## Complexidade e cuidados

- Altura e operações: O(log n) esperado; O(n) no pior caso.
- Construção por inserções: O(n log n) esperado; com prioridades pré-geradas e construção linear por pilha, O(n).
- A prioridade deve ser aleatória e independente das chaves.
- Não altere val/chave sem remover e reinserir, pois a propriedade BST pode quebrar.
- Em problemas com limite de pilha ou memória, considere uma estrutura determinística ou iterativa.
