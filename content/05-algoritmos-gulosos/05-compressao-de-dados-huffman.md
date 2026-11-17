---
title: Compressão de dados — Huffman
summary: Código de prefixo ótimo: junte sempre os dois símbolos menos frequentes.
status: done
complexity: O(n log n)
tags: guloso, huffman, compressão, heap
---

## Ideia

Dadas as frequências, repita: retire as duas menores, crie um nó com a soma e devolva-o à fila. A soma de todos os nós criados é o custo total (bits do texto codificado). O comprimento de cada símbolo é a profundidade da folha. É ótimo entre todos os códigos de prefixo.

## Código

```cpp
// custo total (soma freq * comprimento do código); f.size() >= 1
ll huffman_custo(const vector<ll>& f) {
    priority_queue<ll, vector<ll>, greater<>> pq(f.begin(), f.end());
    ll custo = 0;
    while (pq.size() > 1) {
        ll a = pq.top(); pq.pop();
        ll b = pq.top(); pq.pop();
        custo += a + b;
        pq.push(a + b);
    }
    return custo;
}

// comprimento do código de cada símbolo (um único símbolo recebe 1 bit)
vector<int> huffman_comprimentos(const vector<ll>& f) {
    int n = f.size();
    vector<int> pai(2 * n, -1), len(n, 0);
    priority_queue<pair<ll, int>, vector<pair<ll, int>>, greater<>> pq;
    for (int i = 0; i < n; i++) pq.push({f[i], i});
    int prox = n;
    while (pq.size() > 1) {
        auto [wa, a] = pq.top(); pq.pop();
        auto [wb, b] = pq.top(); pq.pop();
        pai[a] = pai[b] = prox;
        pq.push({wa + wb, prox++});
    }
    for (int i = 0; i < n; i++)
        for (int v = i; pai[v] != -1; v = pai[v]) len[i]++;
    if (n == 1) len[0] = 1;
    return len;
}
```

## Complexidade e cuidados

- Os códigos concretos são `0`/`1` ao descer à esquerda/direita; existem vários códigos ótimos com o mesmo custo.
- Com um único símbolo o custo da fórmula é 0, mas na prática ele precisa de 1 bit.
- Para alfabeto grande e frequências ordenadas há versão `O(n)` com duas filas.
- Pré-requisito: frequências positivas; símbolos de frequência zero não entram.
