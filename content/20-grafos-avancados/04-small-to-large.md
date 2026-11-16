---
title: Small to Large (DSU on Tree)
summary: Combina informações de subárvores movendo os dados menores para a estrutura maior.
status: done
complexity: O(n log² n) com map; O(n log n) esperado com unordered_map
tags: árvores, sacks, frequência, dsu on tree
---

## Quando usar

Quando cada vértice precisa responder algo sobre a frequência dos valores em sua subárvore, ou quando a informação de uma subárvore pode ser mesclada em outra.

## Ideia

Cada subárvore mantém um contêiner. Ao combinar dois contêineres, percorremos o menor e inserimos seus elementos no maior. Um elemento só é movido O(log n) vezes, pois o contêiner de destino pelo menos dobra de tamanho.

## Código

~~~cpp
vector<vector<int>> g;
vector<int> a, ans;
vector<map<int,int>> bag;

void dfs(int u, int p) {
    bag[u][a[u]] = 1;
    for (int v : g[u]) if (v != p) {
        dfs(v, u);
        if (bag[u].size() < bag[v].size())
            bag[u].swap(bag[v]);
        for (auto [value, freq] : bag[v])
            bag[u][value] += freq;
        bag[v].clear();
    }
    int best = 0;
    for (auto [value, freq] : bag[u])
        best = max(best, freq);
    ans[u] = best; // maior frequência na subárvore de u
}

// Inicialize g, a, ans(n) e bag(n); chame dfs(raiz, -1).
~~~

## Cuidados

- A propriedade de dobrar o tamanho limita a quantidade de movimentos por elemento.
- Com std::map, cada inserção custa O(log n), resultando em O(n log² n) no pior caso.
- O exemplo calcula a frequência máxima na subárvore. Adapte o agregado ao problema.
- Small to Large é uma técnica de merge; DSU on Tree com sack (mantendo a maior subárvore) é uma implementação relacionada, mas não idêntica.
