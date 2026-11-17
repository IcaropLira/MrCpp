---
title: priority_queue
summary: Heap: k-ésimo maior em fluxo e remoção preguiçosa.
status: done
complexity: O(log n) por operação
tags: stl, priority_queue, heap
---

## Ideia

`priority_queue` é um max-heap; para min-heap use `greater<>`. Não há busca nem remoção de elemento arbitrário. Para o k-ésimo maior de um fluxo, mantenha um min-heap com os `k` maiores vistos: o topo é a resposta. Para remover elementos arbitrários use *remoção preguiçosa*: um segundo heap com os removidos, descartados quando chegam ao topo.

## Código

```cpp
// k-ésimo maior de um fluxo de valores
struct KMaior {
    int k;
    priority_queue<int, vector<int>, greater<>> pq;
    KMaior(int k) : k(k) {}
    void add(int x) {
        pq.push(x);
        if ((int)pq.size() > k) pq.pop();
    }
    int get() const { return pq.top(); }  // exige pelo menos k valores adicionados
};

// heap com remoção de valores arbitrários (preguiçosa)
struct HeapDel {
    priority_queue<int> a, del;  // max-heap
    void push(int x) { a.push(x); }
    void erase(int x) { del.push(x); }  // x precisa estar presente
    void limpa() { while (!del.empty() && a.top() == del.top()) a.pop(), del.pop(); }
    int top() { limpa(); return a.top(); }
    void pop() { limpa(); a.pop(); }
    int size() const { return a.size() - del.size(); }
};
```

## Complexidade e cuidados

- Só chame `top` e `pop` com a fila não vazia; em `HeapDel` use `size()` antes.
- `priority_queue<pair<ll,int>, vector<pair<ll,int>>, greater<>>` é o heap do Dijkstra.
- Construir a partir de um vetor com `priority_queue(v.begin(), v.end())` é `O(n)`, bem melhor que `n` inserções.
- Não há `decrease-key`: reinsira o elemento e ignore entradas desatualizadas ao retirá-las.
