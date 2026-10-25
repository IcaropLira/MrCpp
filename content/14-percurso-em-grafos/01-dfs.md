---
title: DFS
summary: Busca em profundidade.
status: done
complexity: O(V + E)
tags: grafos, dfs
---

## Ideia

Explora cada caminho até o fim antes de voltar. Base de componentes, ciclos, ordenação topológica e árvores.

## Código

```cpp
vector<vector<int>> g;
vector<bool> vis;
void dfs(int u) {
    vis[u] = true;
    for (int v : g[u]) if (!vis[v]) dfs(v);
}
```

## Uso

Em grafos com 10^6 vértices em cadeia, a recursão pode estourar a pilha; use uma pilha explícita.
