---
title: Segment Tree 2D
summary: Consultas e atualizações em retângulos de uma matriz, com uma árvore de segmentos em cada dimensão.
status: done
complexity: O(nm) construção e memória; O(log n · log m) por consulta/atualização pontual
tags: segtree, 2d, matriz, consultas
---

## Ideia

A árvore divide as linhas; em cada nó da dimensão x existe uma Segment Tree que divide as colunas. Assim, um retângulo é decomposto em O(log n) nós de linhas e cada consulta em colunas custa O(log m).

É uma estrutura pesada: a versão densa usa O(nm) memória com fator constante alto. Para soma dinâmica em matriz, compare com Fenwick 2D; para pontos esparsos, considere compressão offline.

## Implementação: soma, atualização pontual e retângulo

A implementação abaixo é recursiva, 0-based e usa intervalos inclusivos. a é a matriz inicial.

```cpp
struct SegTree2D {
    using ll = long long;
    int n, m;
    vector<vector<ll>> t;

    SegTree2D(const vector<vector<ll>>& a) {
        n = a.size();
        m = n ? a[0].size() : 0;
        t.assign(4 * max(1,n), vector<ll>(4 * max(1,m), 0));
        if (n && m) build_x(a, 1, 0, n-1);
    }

    void build_y(const vector<vector<ll>>& a, int vx,
                 int lx, int rx, int vy, int ly, int ry) {
        if (ly == ry) {
            if (lx == rx) t[vx][vy] = a[lx][ly];
            else t[vx][vy] = t[vx*2][vy] + t[vx*2+1][vy];
            return;
        }
        int my = (ly + ry) / 2;
        build_y(a,vx,lx,rx,vy*2,ly,my);
        build_y(a,vx,lx,rx,vy*2+1,my+1,ry);
        t[vx][vy] = t[vx][vy*2] + t[vx][vy*2+1];
    }

    void build_x(const vector<vector<ll>>& a, int vx, int lx, int rx) {
        if (lx != rx) {
            int mx = (lx + rx) / 2;
            build_x(a,vx*2,lx,mx);
            build_x(a,vx*2+1,mx+1,rx);
        }
        build_y(a,vx,lx,rx,1,0,m-1);
    }

    void update_y(int vx, int lx, int rx, int vy,
                  int ly, int ry, int y, ll val) {
        if (ly == ry) {
            if (lx == rx) t[vx][vy] = val;
            else t[vx][vy] = t[vx*2][vy] + t[vx*2+1][vy];
            return;
        }
        int my = (ly + ry) / 2;
        if (y <= my) update_y(vx,lx,rx,vy*2,ly,my,y,val);
        else update_y(vx,lx,rx,vy*2+1,my+1,ry,y,val);
        t[vx][vy] = t[vx][vy*2] + t[vx][vy*2+1];
    }

    void update_x(int vx, int lx, int rx, int x, int y, ll val) {
        if (lx != rx) {
            int mx = (lx + rx) / 2;
            if (x <= mx) update_x(vx*2,lx,mx,x,y,val);
            else update_x(vx*2+1,mx+1,rx,x,y,val);
        }
        update_y(vx,lx,rx,1,0,m-1,y,val);
    }

    ll query_y(int vx, int vy, int ly, int ry, int ql, int qr) const {
        if (qr < ly || ry < ql) return 0;
        if (ql <= ly && ry <= qr) return t[vx][vy];
        int my = (ly + ry) / 2;
        return query_y(vx,vy*2,ly,my,ql,qr)
             + query_y(vx,vy*2+1,my+1,ry,ql,qr);
    }

    ll query_x(int vx, int lx, int rx, int qlx, int qrx,
               int qly, int qry) const {
        if (qrx < lx || rx < qlx) return 0;
        if (qlx <= lx && rx <= qrx)
            return query_y(vx,1,0,m-1,qly,qry);
        int mx = (lx + rx) / 2;
        return query_x(vx*2,lx,mx,qlx,qrx,qly,qry)
             + query_x(vx*2+1,mx+1,rx,qlx,qrx,qly,qry);
    }

    void update(int x, int y, ll val) {
        if (n && m) update_x(1,0,n-1,x,y,val);
    }

    ll query(int x1, int y1, int x2, int y2) const {
        if (!n || !m || x1 > x2 || y1 > y2) return 0;
        return query_x(1,0,n-1,x1,x2,y1,y2);
    }
};
```

## Complexidade e quando usar

- Construção: O(nm); memória: O(nm), com fator constante alto.
- Atualização de uma célula: O(log n · log m).
- Soma de um retângulo: O(log n · log m).
- Use para operações dinâmicas em retângulos quando a matriz cabe na memória.
- Para soma e atualização pontual, Fenwick 2D costuma ser menor e mais simples.
- Para matriz estática, prefixos 2D dão consulta O(1) após O(nm) de preparação.

## Fórmula de prefixos 2D

Com P[i][j] representando a soma do retângulo [0..i) × [0..j), a soma de [x1,x2) × [y1,y2) é:

P[x2][y2] - P[x1][y2] - P[x2][y1] + P[x1][y1].

Não misture retângulos semiabertos de prefixos com os intervalos inclusivos do código.
