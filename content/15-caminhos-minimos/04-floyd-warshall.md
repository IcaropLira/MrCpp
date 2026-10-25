---
title: Floyd–Warshall
summary: Distâncias entre todos os pares.
status: done
complexity: O(V³)
tags: grafos, caminho mínimo
---

## Ideia

O laço mais externo `k` indica quais vértices já podem ser usados como intermediários.

## Código

```cpp
void floyd(vector<vector<ll>>& d) { // d[i][i] = 0; sem aresta = INF (1e18)
    int n = d.size();
    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                d[i][j] = min(d[i][j], d[i][k] + d[k][j]);
}
```

## Uso

Funciona com pesos negativos. Um `d[i][i] < 0` indica ciclo negativo.
