---
title: Heavy-Light Decomposition (HLD)
summary: Decompõe caminhos de árvore em O(log n) cadeias e usa uma estrutura de intervalos sobre a ordem linearizada.
status: done
complexity: O(n) construção; O(log² n) por consulta de caminho com Segment Tree
tags: árvores, hld, segtree, consultas de caminho
---

## Ideia

Para cada vértice, escolha como filho pesado aquele com maior subárvore. As demais arestas são leves. Ao subir por uma aresta leve, o tamanho da subárvore cai pelo menos pela metade; portanto, qualquer caminho atravessa O(log n) cadeias pesadas.

Cada cadeia é linearizada em posições contíguas pos[v]. Uma consulta de caminho vira O(log n) consultas de intervalo na Segment Tree, cada uma O(log n).

## Implementação: soma de caminho e atualização pontual

Árvore não ponderada, índices 0-based, raiz 0, caminho inclusivo. O exemplo usa soma; troque a operação e a identidade para outros agregados associativos.

\`\`\`cpp
struct HLD {
    using ll = long long;
    int n, timer = 0;
    vector<vector<int>> g;
    vector<int> parent, depth, sz, heavy, head, pos;
    vector<ll> base, seg;

    HLD(vector<vector<int>> graph, vector<ll> val)
        : n(graph.size()), g(move(graph)), parent(n,-1), depth(n),
          sz(n), heavy(n,-1), head(n), pos(n), base(n), seg(4*n) {
        dfs(0, -1);
        decompose(0, 0, val);
        build(1, 0, n-1);
    }

    int dfs(int v, int p) {
        parent[v] = p;
        sz[v] = 1;
        int best = 0;
        for (int u : g[v]) if (u != p) {
            depth[u] = depth[v] + 1;
            int sub = dfs(u, v);
            sz[v] += sub;
            if (sub > best) best = sub, heavy[v] = u;
        }
        return sz[v];
    }

    void decompose(int v, int h, const vector<ll>& val) {
        head[v] = h;
        pos[v] = timer;
        base[timer++] = val[v];
        if (heavy[v] != -1) decompose(heavy[v], h, val);
        for (int u : g[v])
            if (u != parent[v] && u != heavy[v]) decompose(u, u, val);
    }

    void build(int x, int l, int r) {
        if (l == r) { seg[x] = base[l]; return; }
        int m = (l+r)/2;
        build(x*2,l,m); build(x*2+1,m+1,r);
        seg[x] = seg[x*2] + seg[x*2+1];
    }

    void setval(int p, ll v, int x, int l, int r) {
        if (l == r) { seg[x] = v; return; }
        int m = (l+r)/2;
        if (p <= m) setval(p,v,x*2,l,m);
        else setval(p,v,x*2+1,m+1,r);
        seg[x] = seg[x*2] + seg[x*2+1];
    }

    ll query(int a, int b, int x, int l, int r) const {
        if (b < l || r < a) return 0;
        if (a <= l && r <= b) return seg[x];
        int m = (l+r)/2;
        return query(a,b,x*2,l,m) + query(a,b,x*2+1,m+1,r);
    }

    void update(int v, ll value) { setval(pos[v],value,1,0,n-1); }

    ll path(int a, int b) const {
        ll ans = 0;
        while (head[a] != head[b]) {
            if (depth[head[a]] < depth[head[b]]) swap(a,b);
            ans += query(pos[head[a]],pos[a],1,0,n-1);
            a = parent[head[a]];
        }
        if (depth[a] > depth[b]) swap(a,b);
        ans += query(pos[a],pos[b],1,0,n-1);
        return ans;
    }
};
\`\`\`

## Complexidade

- DFS de tamanhos + decomposição: O(n).
- Cada caminho cruza O(log n) cadeias.
- Cada consulta de intervalo custa O(log n): caminho O(log² n).
- Atualização pontual: O(log n).
- Memória: O(n).

## Variações

- **Máximo/mínimo/XOR:** substitua soma por max, min ou XOR e use a identidade correta.
- **Atualização em caminho:** use Lazy Propagation na árvore linearizada.
- **Arestas em vez de vértices:** armazene o valor da aresta pai-vértice na posição do filho; ao consultar a última cadeia, exclua o LCA.
- **Subárvore:** a decomposição mantém a ordem DFS; a subárvore de v também corresponde a [pos[v], pos[v]+sz[v]-1].

## Cuidados

- O código pressupõe árvore conectada e n >= 1.
- A recursão pode estourar a pilha em uma cadeia com 2e5 vértices; use DFS iterativa se necessário.
- path(a,b) inclui ambos os extremos e o LCA.
- Para grafos com ciclos, a DFS precisa de visited; ignorar apenas o pai só é suficiente em árvore.
