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
vector<int> a, ans, sz, best;
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
    if (heavy != -1) {
        bag[u].swap(bag[heavy]);
        best[u] = best[heavy];
    }

    best[u] = max(best[u], ++bag[u][a[u]]);
    for (int v : g[u]) if (v != p && v != heavy) {
        for (auto [value, freq] : bag[v]) {
            bag[u][value] += freq;
            best[u] = max(best[u], bag[u][value]);
        }
        bag[v].clear();
    }

    ans[u] = best[u]; // maior frequência na subárvore de u
}

// Inicialize g, a, ans(n), sz(n), best(n) e bag(n);
// chame dfs(raiz, -1).
~~~

## Cuidados

- A escolha é feita pelo tamanho da subárvore (quantidade de vértices), não pelo número de chaves distintas do map.
- Com std::map, cada inserção custa O(log n), resultando em O(n log² n) no pior caso.
- O exemplo calcula a frequência máxima na subárvore. Adapte o agregado ao problema.
- Small to Large é uma técnica de merge; DSU on Tree com sack (mantendo a maior subárvore) é uma implementação relacionada, mas não idêntica.

## Como escolher entre Small to Large e Sack

| Situação | Técnica |
|---|---|
| Cada nó precisa mesclar um contêiner próprio com os filhos | Small to Large |
| Há um único estado global de frequências e consultas por subárvore | DSU on Tree (Sack) |
| A resposta depende de um conjunto de cores/valores e a operação de merge é barata | Ambas podem ser adaptadas |

### Prova do fator logarítmico

Um elemento só é movido quando está no contêiner menor. Depois do merge, o contêiner que o contém tem tamanho pelo menos duas vezes maior. Logo, cada elemento é movido no máximo floor(log2 n) vezes.

Com std::map, cada inserção custa O(log n), então o total é O(n log² n) quando cada elemento é inserido O(log n) vezes. O uso de unordered_map pode reduzir o custo esperado por inserção para O(1), mas não garante pior caso constante.

### Cuidados adicionais

- O contêiner maior deve ser escolhido por tamanho total de elementos representados, não necessariamente pelo número de chaves distintas.
- Se cada chave guarda uma frequência, ao mesclar some a frequência inteira, não apenas 1.
- O agregado (máxima frequência, soma ponderada, número de distintos) deve ser atualizado no próprio merge.
- Se o contêiner guarda conjuntos ordenados, avalie se uma estrutura especializada oferece melhor limite.
