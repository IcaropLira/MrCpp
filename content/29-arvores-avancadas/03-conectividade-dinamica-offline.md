---
title: Dynamic Connectivity Offline
summary: Responde conectividade em uma sequência de inserções e remoções de arestas usando segment tree sobre o tempo e DSU rollback.
status: done
complexity: O((n + q) log q log n)
tags: grafos, conectividade dinâmica, dsu rollback, offline
---

## Quando usar

Quando um grafo não dirigido recebe inserções e remoções de arestas e há consultas de conectividade entre pares. As operações são conhecidas previamente, portanto podemos processá-las offline.

## Ideia

Cada aresta está ativa em um intervalo de tempo [l,r]. Colocamos esse intervalo em uma segment tree sobre os instantes. Ao percorrer a árvore, aplicamos as arestas do nó na DSU com rollback; ao sair, desfazemos exatamente as uniões feitas naquele nó.

A DSU não usa compressão de caminho, pois ela dificultaria desfazer alterações. União por tamanho mantém a altura O(log n).

## Código

Operações: '+ id u v' insere a aresta, '- id' remove e '? u v' consulta. Um ID não pode estar ativo duas vezes ao mesmo tempo. Vértices 0-based.

~~~cpp
struct RollbackDSU {
    vector<int> p, sz;
    vector<pair<int,int>> hist;

    RollbackDSU(int n) : p(n), sz(n, 1) {
        iota(p.begin(), p.end(), 0);
    }

    int find(int x) const {
        while (p[x] != x) x = p[x];
        return x;
    }

    int snapshot() const { return hist.size(); }

    bool unite(int a, int b) {
        a = find(a), b = find(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) swap(a, b);
        hist.push_back({b, sz[a]});
        p[b] = a;
        sz[a] += sz[b];
        return true;
    }

    void rollback(int snap) {
        while ((int)hist.size() > snap) {
            auto [b, oldSize] = hist.back();
            hist.pop_back();
            int a = p[b];
            sz[a] = oldSize;
            p[b] = b;
        }
    }

    bool same(int a, int b) const {
        return find(a) == find(b);
    }
};

struct Operation {
    char type;
    int id = -1, u = -1, v = -1;
};

struct DynamicConnectivity {
    int q;
    vector<Operation> op;
    vector<vector<pair<int,int>>> seg;
    RollbackDSU dsu;
    vector<string> answer;

    DynamicConnectivity(int n, vector<Operation> operations)
        : q(operations.size()), op(move(operations)),
          seg(4 * max(1, q)), dsu(n) {}

    void add(int x, int l, int r, int a, int b, pair<int,int> e) {
        if (a > r || b < l) return;
        if (a <= l && r <= b) {
            seg[x].push_back(e);
            return;
        }
        int m = (l + r) / 2;
        add(x*2, l, m, a, b, e);
        add(x*2+1, m+1, r, a, b, e);
    }

    void dfs(int x, int l, int r) {
        int snap = dsu.snapshot();
        for (auto [u, v] : seg[x]) dsu.unite(u, v);

        if (l == r) {
            if (op[l].type == '?')
                answer.push_back(dsu.same(op[l].u, op[l].v) ? "YES" : "NO");
        } else {
            int m = (l + r) / 2;
            dfs(x*2, l, m);
            dfs(x*2+1, m+1, r);
        }
        dsu.rollback(snap);
    }

    vector<string> solve() {
        if (!q) return {};
        map<int, tuple<int,int,int>> active;
        for (int t = 0; t < q; t++) {
            auto cur = op[t];
            if (cur.type == '+') {
                active[cur.id] = {t, cur.u, cur.v};
            } else if (cur.type == '-') {
                auto [start, u, v] = active.at(cur.id);
                add(1, 0, q-1, start, t-1, {u, v});
                active.erase(cur.id);
            }
        }
        for (auto [id, data] : active) {
            auto [start, u, v] = data;
            add(1, 0, q-1, start, q-1, {u, v});
        }
        dfs(1, 0, q-1);
        return answer;
    }
};
~~~

## Cuidados

- O grafo é não dirigido. Para arestas paralelas, use IDs distintos.
- Cada ID deve ser inserido antes de ser removido e não pode ser reinserido enquanto estiver ativo.
- O exemplo guarda respostas na ordem das consultas; não há resposta para operações de atualização.
- A DSU rollback não usa path compression. Não substitua por uma DSU comum.
- A complexidade é O(q log q log n): cada intervalo aparece em O(log q) nós e cada união custa O(log n).
