---
title: Componentes conexos
summary: Rotula cada vértice com o número do seu componente usando uma busca iterativa.
status: done
complexity: O(n + m)
tags: grafos, componentes conexos, bfs
---

## Ideia

Para cada vértice ainda sem rótulo, inicie uma busca e rotule tudo o que ela alcança com um novo número. Cada vértice e cada aresta são visitados uma vez. A versão iterativa (com pilha própria) evita estourar a pilha de recursão em grafos profundos.

## Código

```cpp
// vértices 0..n-1, grafo não dirigido. comp[v] = id do componente; devolve o nº de componentes
int componentes(const vector<vector<int>>& g, vector<int>& comp) {
    int n = g.size(), c = 0;
    comp.assign(n, -1);
    for (int s = 0; s < n; s++) {
        if (comp[s] != -1) continue;
        vector<int> pilha = {s};
        comp[s] = c;
        while (!pilha.empty()) {
            int u = pilha.back(); pilha.pop_back();
            for (int v : g[u])
                if (comp[v] == -1) comp[v] = c, pilha.push_back(v);
        }
        c++;
    }
    return c;
}
```

## Complexidade e cuidados

- Em grafos dirigidos isto acha componentes *fracamente* conexos só se o grafo guardar as arestas nos dois sentidos; para fortemente conexos veja Tarjan/Kosaraju.
- Para tamanhos, conte quantos `v` têm cada `comp[v]`.
- Se as arestas chegam aos poucos, um DSU resolve online.
- Um grafo com `n` vértices e `c` componentes precisa de pelo menos `n - c` arestas.
