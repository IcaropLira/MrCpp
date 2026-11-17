---
title: Caminho euleriano (Hierholzer)
summary: Percorre todas as arestas exatamente uma vez, em grafo dirigido e não dirigido.
status: done
complexity: O(V + E)
tags: grafos, euleriano, hierholzer
---

## Ideia

Existe caminho euleriano em um grafo dirigido se no máximo um vértice tem `saída - entrada = 1` (o início), no máximo um tem `entrada - saída = 1` (o fim) e todos os outros são equilibrados, além de todas as arestas estarem em um só componente. Em um não dirigido, no máximo dois vértices têm grau ímpar. Hierholzer: siga arestas não usadas, empilhando vértices; ao ficar preso, desempilhe e acrescente à resposta; o resultado sai invertido.

## Código

```cpp
// dirigido, vértices 0..n-1: sequência de m+1 vértices ou vazio se não existe (ou m == 0)
vector<int> euler_dirigido(int n, const vector<pair<int, int>>& E) {
    int m = E.size();
    vector<vector<int>> g(n);
    vector<int> sai(n, 0), entra(n, 0), it(n, 0);
    for (auto [u, v] : E) g[u].push_back(v), sai[u]++, entra[v]++;
    int ini = -1, mais = 0, menos = 0;
    for (int v = 0; v < n; v++) {
        if (sai[v] - entra[v] == 1) mais++, ini = v;
        else if (entra[v] - sai[v] == 1) menos++;
        else if (sai[v] != entra[v]) return {};
    }
    if (mais > 1 || menos > 1 || mais != menos) return {};
    if (ini < 0) for (int v = 0; v < n; v++) if (sai[v]) { ini = v; break; }
    if (ini < 0) return {};
    vector<int> pilha = {ini}, r;
    while (!pilha.empty()) {
        int u = pilha.back();
        if (it[u] < (int)g[u].size()) pilha.push_back(g[u][it[u]++]);
        else r.push_back(u), pilha.pop_back();
    }
    if ((int)r.size() != m + 1) return {};  // arestas em mais de um componente
    reverse(r.begin(), r.end());
    return r;
}

// não dirigido (laços e arestas paralelas permitidos): idem
vector<int> euler_nao_dirigido(int n, const vector<pair<int, int>>& E) {
    int m = E.size();
    vector<vector<pair<int, int>>> g(n);  // (vizinho, id da aresta)
    vector<int> grau(n, 0), it(n, 0);
    for (int i = 0; i < m; i++) {
        auto [u, v] = E[i];
        g[u].push_back({v, i}); g[v].push_back({u, i});
        grau[u]++; grau[v]++;
    }
    int ini = -1, impares = 0;
    for (int v = 0; v < n; v++) if (grau[v] % 2) { impares++; if (ini < 0) ini = v; }
    if (impares != 0 && impares != 2) return {};
    if (ini < 0) for (int v = 0; v < n; v++) if (grau[v]) { ini = v; break; }
    if (ini < 0) return {};
    vector<char> usada(m, false);
    vector<int> pilha = {ini}, r;
    while (!pilha.empty()) {
        int u = pilha.back();
        while (it[u] < (int)g[u].size() && usada[g[u][it[u]].second]) it[u]++;
        if (it[u] == (int)g[u].size()) r.push_back(u), pilha.pop_back();
        else {
            auto [v, id] = g[u][it[u]++];
            usada[id] = true;
            pilha.push_back(v);
        }
    }
    if ((int)r.size() != m + 1) return {};
    reverse(r.begin(), r.end());
    return r;
}
```

## Complexidade e cuidados

- Se existir um vértice de grau ímpar, o caminho começa em um deles; senão é um circuito e começa em qualquer vértice com aresta.
- A checagem final `r.size() == m + 1` garante que todas as arestas estão no mesmo componente.
- Sem arestas (`m = 0`) as funções devolvem vazio.
- Com arestas rotuladas (ids) é possível devolver as arestas em vez dos vértices.
