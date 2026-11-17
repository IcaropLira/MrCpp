---
title: Tarjan (componentes fortemente conexas)
summary: Uma única DFS com pilha e low-link; os componentes saem em ordem topológica reversa.
status: done
complexity: O(V + E)
tags: grafos, scc, tarjan, dfs
---

## Ideia

Cada vértice recebe um tempo de descoberta `tin` e um `low`: o menor `tin` alcançável pela subárvore da DFS usando no máximo uma aresta de retorno para um vértice ainda na pilha. Quando `low[u] == tin[u]`, `u` é a raiz de um componente: desempilha-se até `u`, e tudo o que saiu forma uma SCC. A versão abaixo é iterativa, segura para `n = 2e5` em cadeia.

## Código

```cpp
// vértices 0..n-1, arestas dirigidas. comp[v] = índice da SCC de v.
// Os índices saem em ordem topológica REVERSA: se há aresta u -> v entre SCCs diferentes, comp[u] > comp[v].
int tarjan_scc(const vector<vector<int>>& g, vector<int>& comp) {
    int n = g.size(), timer = 0, nc = 0;
    vector<int> tin(n, -1), low(n, 0), it(n, 0), pilha;
    vector<char> naPilha(n, false);
    comp.assign(n, -1);
    for (int s = 0; s < n; s++) {
        if (tin[s] != -1) continue;
        vector<int> chamada = {s};
        tin[s] = low[s] = timer++;
        pilha.push_back(s); naPilha[s] = true;
        while (!chamada.empty()) {
            int u = chamada.back();
            if (it[u] < (int)g[u].size()) {
                int v = g[u][it[u]++];
                if (tin[v] == -1) {
                    tin[v] = low[v] = timer++;
                    pilha.push_back(v); naPilha[v] = true;
                    chamada.push_back(v);
                } else if (naPilha[v]) low[u] = min(low[u], tin[v]);
            } else {
                if (low[u] == tin[u]) {
                    while (true) {
                        int v = pilha.back(); pilha.pop_back();
                        naPilha[v] = false; comp[v] = nc;
                        if (v == u) break;
                    }
                    nc++;
                }
                chamada.pop_back();
                if (!chamada.empty()) low[chamada.back()] = min(low[chamada.back()], low[u]);
            }
        }
    }
    return nc;
}
```

## Complexidade e cuidados

- Para o grafo condensado (DAG das SCCs), crie uma aresta `comp[u] -> comp[v]` para cada aresta com `comp[u] != comp[v]`.
- Kosaraju faz duas DFS e usa o grafo transposto; Tarjan faz uma e não precisa do transposto.
- Só considere `tin[v]` (e não `low[v]`) para vértices na pilha; usar `naPilha` evita juntar componentes errados.
- Laços e arestas paralelas não afetam o resultado.
