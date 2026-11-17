---
title: SPFA
summary: Bellman-Ford com fila: relaxa só quem mudou; detecta ciclo negativo contando entradas na fila.
status: done
complexity: O(V · E) no pior caso; costuma ser bem menor
tags: grafos, caminho mínimo, spfa, ciclo negativo
---

## Ideia

Em vez de relaxar todas as arestas `V - 1` vezes, só reexamine os vértices cuja distância acabou de diminuir: eles ficam em uma fila. Se um vértice entra na fila `V` ou mais vezes, há um ciclo negativo alcançável da origem. Funciona com pesos negativos; com pesos não negativos use Dijkstra, que tem garantia melhor.

## Código

```cpp
// vértices 0..n-1, g[u] = {(v, w)}. d[v] = menor distância de s a v (INF se inalcançável)
// devolve false se há ciclo negativo alcançável de s
bool spfa(const vector<vector<pair<int, ll>>>& g, int s, vector<ll>& d) {
    const ll INF = LLONG_MAX / 4;
    int n = g.size();
    d.assign(n, INF);
    vector<int> entradas(n, 0);
    vector<char> naFila(n, false);
    queue<int> q;
    d[s] = 0; q.push(s); naFila[s] = true; entradas[s] = 1;
    while (!q.empty()) {
        int u = q.front(); q.pop();
        naFila[u] = false;
        for (auto [v, w] : g[u]) {
            if (d[u] + w < d[v]) {
                d[v] = d[u] + w;
                if (!naFila[v]) {
                    if (++entradas[v] >= n) return false;
                    q.push(v); naFila[v] = true;
                }
            }
        }
    }
    return true;
}
```

## Complexidade e cuidados

- O pior caso é igual ao de Bellman-Ford e existem entradas que o provocam (grades adversariais): em competições com Dijkstra possível, prefira Dijkstra.
- Ciclos negativos *não alcançáveis* de `s` não são detectados (e não importam).
- Com ciclo negativo as distâncias devolvidas não têm significado.
- Use `LLONG_MAX / 4` como infinito para somas não estourarem.
