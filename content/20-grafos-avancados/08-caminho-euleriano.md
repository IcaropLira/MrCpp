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
    // g[u] contém {v, id}; cada aresta tem ID único.
    int ini = 0, fim = 0;
    for (int u = 0; u < n; u++) {
        int d = outdeg[u] - indeg[u];
        if (d == 1) ini++;
        else if (d == -1) fim++;
        else if (d != 0) return {};
    }

    bool circuito = (ini == 0 && fim == 0);
    if (!circuito && !(ini == 1 && fim == 1)) return {};
    if (s < 0 || s >= n || outdeg[s] == 0 && m > 0) return {};
    if (!circuito && outdeg[s] - indeg[s] != 1) return {};

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

- Para circuito, todos os graus de entrada e saída devem ser iguais; escolha s em qualquer vértice com aresta. Para caminho aberto, s deve ser o único vértice com saída excedente.
- Também é necessário garantir que todas as arestas estejam na mesma componente alcançável relevante. A checagem final path.size() == E+1 detecta arestas não usadas.
- Para grafo não dirigido, cada aresta aparece nas listas dos dois extremos com o mesmo ID e o controle used[id] evita usá-la duas vezes.
- Para multigrafos, IDs únicos por aresta são obrigatórios.
