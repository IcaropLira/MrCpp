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

Cada subárvore mantém um contêiner. Reaproveitamos o contêiner da maior subárvore e inserimos nele os dados das menores. Cada vértice pertence a uma subárvore menor apenas O(log n) vezes, pois a subárvore-base pelo menos dobra de tamanho.

## Código

~~~cpp
vector<vector<int>> g;
vector<int> a, ans, sz;
vector<map<int,int>> bag;

void dfs(int u, int p) {
    sz[u] = 1;
    int heavy = -1;

    for (int v : g[u]) if (v != p) {
        dfs(v, u);
        sz[u] += sz[v];
        if (heavy == -1 || sz[v] > sz[heavy]) heavy = v;
    }

    // Reaproveita o contêiner da maior subárvore.
    if (heavy != -1) bag[u].swap(bag[heavy]);

    bag[u][a[u]]++;
    for (int v : g[u]) if (v != p && v != heavy) {
        for (auto [value, freq] : bag[v])
            bag[u][value] += freq;
        bag[v].clear();
    }

    int best = 0;
    for (auto [value, freq] : bag[u])
        best = max(best, freq);
    ans[u] = best; // maior frequência na subárvore de u
}

// Inicialize g, a, ans(n), sz(n) e bag(n);
// chame dfs(raiz, -1).
~~~

## Cuidados

- A escolha é feita pelo tamanho da subárvore (quantidade de vértices), não pelo número de chaves distintas do map.
- Com std::map, cada inserção custa O(log n), resultando em O(n log² n) no pior caso.
- O exemplo calcula a frequência máxima na subárvore. Adapte o agregado ao problema.
- Small to Large é uma técnica de merge; DSU on Tree com sack (mantendo a maior subárvore) é uma implementação relacionada, mas não idêntica.
