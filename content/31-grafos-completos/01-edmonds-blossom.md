---
title: Edmonds Blossom
summary: Emparelhamento máximo em grafo geral não bipartido usando contração de flores.
status: done
complexity: O(V³)
tags: grafos, matching, blossom, emparelhamento geral
---

## Quando usar

Quando o grafo não é bipartido e queremos um emparelhamento de cardinalidade máxima. Hopcroft-Karp é preferível em grafos bipartidos.

## Ideia

Uma busca alternante parte de vértices livres. Quando encontra uma aresta entre dois vértices da mesma paridade na floresta alternante, existe uma flor (blossom): um ciclo ímpar com uma base. Contraímos o ciclo em um supervértice, continuamos a busca e depois expandimos o caminho aumentante.

## Código

Vértices 0-based. O grafo é não direcionado e sem laços. A rotina retorna o tamanho do matching e preenche match[u].

~~~cpp
struct Blossom {
    int n;
    vector<vector<int>> g;
    vector<int> match, p, base, q;
    vector<bool> used, blossom;

    Blossom(int n) : n(n), g(n), match(n, -1),
        p(n), base(n), used(n), blossom(n) {}

    void add_edge(int u, int v) {
        g[u].push_back(v);
        g[v].push_back(u);
    }

    int lca(int a, int b) {
        vector<bool> seen(n);
        while (true) {
            a = base[a];
            seen[a] = true;
            if (match[a] == -1) break;
            a = p[match[a]];
        }
        while (true) {
            b = base[b];
            if (seen[b]) return b;
            b = p[match[b]];
        }
    }

    void mark_path(int v, int b, int child) {
        while (base[v] != b) {
            blossom[base[v]] = blossom[base[match[v]]] = true;
            p[v] = child;
            child = match[v];
            v = p[match[v]];
        }
    }

    int find_path(int root) {
        fill(used.begin(), used.end(), false);
        fill(p.begin(), p.end(), -1);
        iota(base.begin(), base.end(), 0);
        q.clear();
        q.push_back(root);
        used[root] = true;

        for (int head = 0; head < (int)q.size(); head++) {
            int v = q[head];
            for (int u : g[v]) {
                if (base[v] == base[u] || match[v] == u) continue;

                if (u == root || (match[u] != -1 && p[match[u]] != -1)) {
                    int cur = lca(v, u);
                    fill(blossom.begin(), blossom.end(), false);
                    mark_path(v, cur, u);
                    mark_path(u, cur, v);
                    for (int i = 0; i < n; i++) if (blossom[base[i]]) {
                        base[i] = cur;
                        if (!used[i]) used[i] = true, q.push_back(i);
                    }
                } else if (p[u] == -1) {
                    p[u] = v;
                    if (match[u] == -1) return u;
                    u = match[u];
                    used[u] = true;
                    q.push_back(u);
                }
            }
        }
        return -1;
    }

    int solve() {
        int ans = 0;
        for (int i = 0; i < n; i++) if (match[i] == -1) {
            int v = find_path(i);
            if (v == -1) continue;
            ans++;
            while (v != -1) {
                int pv = p[v];
                int nv = (pv == -1 ? -1 : match[pv]);
                if (pv != -1) match[v] = pv, match[pv] = v;
                v = nv;
            }
        }
        return ans;
    }
};
~~~

## Cuidados

- O algoritmo é para grafo geral não ponderado; não resolve matching de peso máximo.
- Cada aresta deve ser adicionada uma vez por chamada a add_edge; a função já cria as duas direções.
- O matching pode não ser perfeito: vértices sem par ficam com -1.
- Complexidade O(V³); para bipartidos, use Hopcroft-Karp, O(E√V).
- Laços não fazem sentido em matching e devem ser removidos da entrada.
