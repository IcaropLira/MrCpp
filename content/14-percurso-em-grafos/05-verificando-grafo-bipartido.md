---
title: Verificando grafo bipartido
summary: Colore com duas cores por BFS; falha exatamente quando há ciclo ímpar.
status: done
complexity: O(n + m)
tags: grafos, bipartido, coloração, bfs
---

## Ideia

Um grafo é bipartido se seus vértices se dividem em dois conjuntos sem aresta dentro de um mesmo conjunto, o que equivale a não ter ciclo de comprimento ímpar. Pinte a origem com 0 e cada vizinho com a cor oposta; se algum vizinho já tem a mesma cor, existe ciclo ímpar. Repita para cada componente.

## Código

```cpp
// vértices 0..n-1, não dirigido. cor[v] em {0, 1}. Devolve false se há ciclo ímpar
bool bipartido(const vector<vector<int>>& g, vector<int>& cor) {
    int n = g.size();
    cor.assign(n, -1);
    for (int s = 0; s < n; s++) {
        if (cor[s] != -1) continue;
        cor[s] = 0;
        queue<int> q;
        q.push(s);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (int v : g[u]) {
                if (cor[v] == -1) cor[v] = cor[u] ^ 1, q.push(v);
                else if (cor[v] == cor[u]) return false;
            }
        }
    }
    return true;
}
```

## Complexidade e cuidados

- Um laço (`u - u`) torna o grafo não bipartido, e o código detecta isso (`cor[u] == cor[u]`).
- Em grafo desconexo cada componente pode ser colorido de duas formas; os `2^c` resultados são válidos.
- Árvores e grades são sempre bipartidas.
- Emparelhamento bipartido máximo (Hopcroft-Karp, König) exige essa coloração.
