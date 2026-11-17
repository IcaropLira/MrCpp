---
title: Borůvka
summary: Árvore geradora mínima em rodadas, escolhendo a menor aresta que sai de cada componente.
status: done
complexity: O(E log V)
tags: grafos, mst, dsu, boruvka
---

## Ideia

Em cada rodada, cada componente escolhe a aresta de menor peso que sai dela; todas essas arestas pertencem a alguma MST. Unir as componentes pelo menos divide o número delas por 2, então há no máximo log V rodadas, cada uma varrendo as E arestas com DSU. É útil quando a escolha "melhor aresta por componente" é mais fácil de calcular que a ordenação global de Kruskal.

Para evitar ciclos quando há pesos iguais, desempate por (peso, índice da aresta).

## Código

```cpp
struct Edge { int u, v; ll w; };

struct DSU {
    vector<int> p, sz;
    DSU(int n) : p(n), sz(n, 1) { iota(p.begin(), p.end(), 0); }
    int find(int x) { while (p[x] != x) x = p[x] = p[p[x]]; return x; }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) swap(a, b);
        p[b] = a; sz[a] += sz[b];
        return true;
    }
};

// vértices 0..n-1; devolve o peso da floresta geradora mínima
// used recebe os índices das arestas escolhidas
ll boruvka(int n, const vector<Edge>& E, vector<int>& used) {
    DSU d(n);
    ll total = 0;
    used.clear();
    int comps = n;
    while (comps > 1) {
        vector<int> best(n, -1);
        for (int i = 0; i < (int)E.size(); i++) {
            int a = d.find(E[i].u), b = d.find(E[i].v);
            if (a == b) continue;
            for (int c : {a, b})
                if (best[c] < 0 || tie(E[i].w, i) < tie(E[best[c]].w, best[c])) best[c] = i;
        }
        bool any = false;
        for (int c = 0; c < n; c++) {
            if (best[c] < 0) continue;
            const Edge& e = E[best[c]];
            if (d.unite(e.u, e.v)) { total += e.w; used.push_back(best[c]); comps--; any = true; }
        }
        if (!any) break;  // grafo desconexo: sobrou uma floresta
    }
    return total;
}
```

## Uso

`vector<int> used; ll w = boruvka(n, E, used);` Se `used.size() < n - 1`, o grafo é desconexo e o resultado é uma floresta.

## Complexidade e cuidados

- Vértices indexados de 0 a n-1; arestas não dirigidas.
- Pesos negativos funcionam (só há comparações).
- Cada rodada custa O(E α(V)); no máximo ⌈log₂ V⌉ rodadas.
- O desempate por índice é obrigatório: sem ele, arestas de mesmo peso podem formar ciclo.
- Laços e arestas paralelas são tratados naturalmente.
