---
title: Stoer-Wagner
summary: Corte mínimo global de um grafo não dirigido ponderado, sem escolher origem e destino.
status: done
complexity: O(V³)
tags: grafos, corte minimo, stoer-wagner
---

## Ideia

Em cada fase, escolha vértices em ordem de "adjacência máxima": sempre o vértice fora do conjunto `A` com maior soma de pesos para `A`. O último vértice `t` escolhido tem o corte `{t}` contra o resto igual a um corte mínimo entre `t` e o penúltimo `s`. Guarde esse valor como candidato e contraia `s` e `t`. Após `V-1` fases, o menor candidato é o corte mínimo global.

## Código

```cpp
// w: matriz simétrica de pesos não negativos (0 = sem aresta), vértices 0..n-1
// devolve {valor do corte mínimo, um dos lados do corte}; n >= 2
pair<ll, vector<int>> stoerWagner(vector<vector<ll>> w) {
    int n = w.size();
    vector<vector<int>> grp(n);
    vector<int> alive(n);
    for (int i = 0; i < n; i++) grp[i] = {i}, alive[i] = i;
    ll best = LLONG_MAX;
    vector<int> side;
    while (alive.size() > 1) {
        int k = alive.size();
        vector<ll> key(n, 0);
        vector<char> inA(n, false);
        int prev = -1, last = -1;
        for (int it = 0; it < k; it++) {
            int sel = -1;
            for (int x : alive) if (!inA[x] && (sel < 0 || key[x] > key[sel])) sel = x;
            if (sel < 0) break;
            inA[sel] = true;
            prev = last; last = sel;
            if (it == k - 1 && key[sel] < best) best = key[sel], side = grp[sel];
            for (int x : alive) if (!inA[x]) key[x] += w[sel][x];
        }
        grp[prev].insert(grp[prev].end(), grp[last].begin(), grp[last].end());
        for (int x : alive) if (x != prev && x != last) w[prev][x] += w[last][x], w[x][prev] = w[prev][x];
        alive.erase(find(alive.begin(), alive.end(), last));
    }
    return {best, side};
}
```

## Uso

Monte `w[u][v] += c` para cada aresta (arestas paralelas se somam) e chame `stoerWagner(w)`. O vetor devolvido lista os vértices de um lado do corte.

## Complexidade e cuidados

- Vértices de 0 a n-1; matriz de adjacência O(V²) de memória.
- Pesos devem ser não negativos; pesos negativos quebram a escolha gulosa.
- Grafo desconexo devolve corte 0.
- Para grafos esparsos grandes, use heap por fase (O(VE + V² log V)); aqui o O(V³) simples basta para V até ~500.
- Para corte entre dois vértices fixos, use fluxo máximo.
