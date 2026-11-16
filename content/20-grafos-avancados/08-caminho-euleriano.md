---
title: Caminho e circuito euleriano
summary: Encontra uma trilha que usa cada aresta exatamente uma vez.
status: done
complexity: O(V + E)
tags: grafos, euler, hierholzer
---

## Quando usar

Quando precisamos percorrer todas as arestas exatamente uma vez. O circuito começa e termina no mesmo vértice; o caminho aberto tem início e fim distintos.

## Ideia

Hierholzer constrói ciclos/trilhas e os incorpora usando uma pilha. Remova cada aresta uma única vez e inverta a sequência final.

## Código — grafo dirigido

~~~cpp
vector<int> euler_dirigido(int n, vector<vector<pair<int,int>>>& g,
                           vector<int> indeg, vector<int> outdeg,
                           int s, int m) {
    // g[u] contém {v, id}; cada aresta deve ter ID único.
    for (int u = 0; u < n; u++)
        if (outdeg[u] - indeg[u] > 0 && u != s) return {};
    if (outdeg[s] - indeg[s] != 1 && outdeg[s] != indeg[s]) return {};

    vector<int> ptr(n), st = {s}, path;
    vector<char> used(m, false);

    while (!st.empty()) {
        int u = st.back();
        while (ptr[u] < (int)g[u].size() && used[g[u][ptr[u]].second])
            ptr[u]++;
        if (ptr[u] == (int)g[u].size()) {
            path.push_back(u);
            st.pop_back();
        } else {
            auto [v, id] = g[u][ptr[u]++];
            if (!used[id]) used[id] = true, st.push_back(v);
        }
    }

    if ((int)path.size() != m + 1) return {};
    reverse(path.begin(), path.end());
    return path;
}
~~~

## Cuidados

- O código acima verifica os graus para um caminho aberto com início s; para circuito, todos os graus devem ser iguais.
- Também é necessário garantir que todas as arestas estejam na mesma componente alcançável relevante. A checagem final path.size() == E+1 detecta arestas não usadas.
- Para grafo não dirigido, cada aresta aparece nas listas dos dois extremos com o mesmo ID e o controle used[id] evita usá-la duas vezes.
- Para multigrafos, IDs únicos por aresta são obrigatórios.
