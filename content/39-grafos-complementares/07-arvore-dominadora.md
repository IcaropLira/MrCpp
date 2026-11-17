---
title: Árvore dominadora
summary: Dominadores imediatos de um grafo dirigido a partir de uma raiz, pelo algoritmo iterativo de Cooper-Harvey-Kennedy.
status: done
complexity: O(V · E) no pior caso, rápido na prática
tags: grafos, dominadores, dirigido, dfs
---

## Ideia

O vértice `d` domina `v` se todo caminho da raiz até `v` passa por `d`. O dominador imediato `idom[v]` é o dominador estrito mais próximo de `v`, e os `idom` formam uma árvore com a raiz no topo.

O algoritmo numera os vértices em pós-ordem de uma DFS e, em ordem pós-ordem reversa, define `idom[v]` como a interseção (subida na árvore parcial até o ancestral comum) dos `idom` dos predecessores já processados. Repete até nada mudar. Em grafos reais converge em poucas passadas.

## Código

```cpp
// vértices 0..n-1, g[u] = sucessores de u, raiz r.
// idom[v] = dominador imediato; idom[r] = -1; vértices inalcançáveis ficam com -1.
vector<int> dominators(int n, int r, const vector<vector<int>>& g) {
    vector<vector<int>> pred(n);
    for (int u = 0; u < n; u++) for (int v : g[u]) pred[v].push_back(u);
    vector<int> po(n, -1), ord;  // po = índice em pós-ordem
    vector<pair<int, int>> st = {{r, 0}};
    vector<char> vis(n, false);
    vis[r] = true;
    while (!st.empty()) {
        auto& [v, i] = st.back();
        if (i < (int)g[v].size()) {
            int w = g[v][i++];
            if (!vis[w]) vis[w] = true, st.push_back({w, 0});
        } else {
            po[v] = ord.size(); ord.push_back(v); st.pop_back();
        }
    }
    vector<int> idom(n, -1);
    idom[r] = r;
    auto intersect = [&](int a, int b) {
        while (a != b) {
            while (po[a] < po[b]) a = idom[a];
            while (po[b] < po[a]) b = idom[b];
        }
        return a;
    };
    bool ch = true;
    while (ch) {
        ch = false;
        for (int i = (int)ord.size() - 2; i >= 0; i--) {
            int v = ord[i], nw = -1;
            for (int p : pred[v]) {
                if (idom[p] < 0) continue;  // ainda não processado ou inalcançável
                nw = nw < 0 ? p : intersect(p, nw);
            }
            if (nw != idom[v]) idom[v] = nw, ch = true;
        }
    }
    idom[r] = -1;
    return idom;
}
```

## Uso

`auto idom = dominators(n, r, g);` A árvore dominadora tem aresta `idom[v] -> v`. `d` domina `v` se `d` é ancestral de `v` nessa árvore (use tempos de entrada e saída para testar em O(1)).

## Complexidade e cuidados

- Vértices de 0 a n-1; grafo dirigido, pode ter ciclos e arestas múltiplas.
- A DFS é iterativa, então não estoura a pilha em cadeias longas.
- Pior caso O(V·E) (e O(V²) de profundidade em grafos adversariais); Lengauer-Tarjan dá O(E α(V)) mas é bem mais longo.
- Em DAG, uma única passada em ordem topológica reversa já basta.
- Vértices inalcançáveis da raiz ficam com `idom = -1`, igual à raiz; diferencie por `po` se precisar.
- Útil para: pontos de articulação em grafo dirigido, "quais vértices desaparecem se eu remover x".
