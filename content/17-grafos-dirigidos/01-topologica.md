---
title: Ordenação topológica
summary: Ordenação topológica (Kahn).
status: done
complexity: O(V + E)
tags: dag, ordem
---

## Ideia

Remove repetidamente vértices sem arestas de entrada. Se sobrar vértice, há ciclo.

## Código

```cpp
vector<int> topo(const vector<vector<int>>& g) { // vazio se há ciclo
    int n = g.size(); vector<int> deg(n), order;
    for (auto& adj : g) for (int v : adj) deg[v]++;
    queue<int> q;
    for (int i = 0; i < n; i++) if (!deg[i]) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop(); order.push_back(u);
        for (int v : g[u]) if (!--deg[v]) q.push(v);
    }
    return (int)order.size() == n ? order : vector<int>();
}
```

## Variante — DFS e ordem de término

Também é possível obter uma ordem topológica com DFS: ao terminar de processar u, adicione u à lista; ao final, inverta a lista. Uma aresta para um vértice cinza (na pilha de recursão) denuncia ciclo.

~~~cpp
vector<int> topo_dfs(const vector<vector<int>>& g) {
    int n = g.size();
    vector<int> state(n), order;
    bool ciclo = false;

    function<void(int)> dfs = [&](int u) {
        state[u] = 1;
        for (int v : g[u]) {
            if (state[v] == 1) ciclo = true;
            else if (state[v] == 0) dfs(v);
        }
        state[u] = 2;
        order.push_back(u);
    };

    for (int u = 0; u < n; u++)
        if (!state[u]) dfs(u);

    if (ciclo) return {};
    reverse(order.begin(), order.end());
    return order;
}
~~~

- state = 0: não visitado; 1: ativo na recursão; 2: finalizado.
- Complexidade O(V + E).
- Use Kahn quando também precisar detectar ciclo pelo tamanho da ordem ou processar vértices em ordem de grau de entrada.
- A versão recursiva pode estourar a pilha em grafos muito profundos.
