---
title: DSU com rollback
summary: Permite desfazer uniões em ordem inversa, sem compressão de caminhos.
status: done
complexity: O(log n) por operação; rollback O(quantidade de uniões desfeitas)
tags: dsu, rollback, conectividade dinamica
---

## Quando usar

Em algoritmos offline que dividem o tempo em intervalos, como conectividade dinâmica com árvore de segmentos sobre o tempo e divide and conquer.

## Ideia

A DSU tradicional usa compressão de caminhos, que altera muitos pais e dificulta desfazer operações. Aqui usamos union by size sem compressão: cada união bem-sucedida registra a raiz alterada e o tamanho anterior da outra raiz. Um snapshot é o tamanho do histórico.

## Código

~~~cpp
struct RollbackDSU {
    vector<int> p, sz;
    vector<pair<int,int>> hist;

    RollbackDSU(int n) : p(n), sz(n, 1) {
        iota(p.begin(), p.end(), 0);
    }

    int find(int x) {
        while (p[x] != x) x = p[x];
        return x;
    }

    bool unite(int a, int b) {
        a = find(a), b = find(b);
        if (a == b) return false;
        if (sz[a] < sz[b]) swap(a, b);

        hist.push_back({b, sz[a]});
        p[b] = a;
        sz[a] += sz[b];
        return true;
    }

    int snapshot() const {
        return (int)hist.size();
    }

    void rollback(int snap) {
        while ((int)hist.size() > snap) {
            auto [b, oldSize] = hist.back();
            hist.pop_back();
            int a = p[b];
            p[b] = b;
            sz[a] = oldSize;
        }
    }

    bool same(int a, int b) { return find(a) == find(b); }
    int size(int x) { return sz[find(x)]; }
};
~~~

## Padrão de uso

~~~cpp
int snap = dsu.snapshot();
dsu.unite(u, v);
// ... resolve o estado atual
dsu.rollback(snap);
~~~

## Cuidados

- Não use path compression em find.
- Union by size garante altura O(log n).
- snapshot é o tamanho do histórico, não o número total de chamadas a unite.
- Uniões redundantes não precisam ser registradas, pois não alteram o estado.
- Para conectividade dinâmica offline, coloque cada aresta no intervalo de tempo em que está ativa em uma árvore de segmentos; ao entrar em um nó, aplique as uniões e, ao sair, faça rollback ao snapshot.
