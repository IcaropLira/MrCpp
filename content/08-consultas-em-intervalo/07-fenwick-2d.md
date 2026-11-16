---
title: Fenwick Tree 2D
summary: Soma e atualização pontual em uma matriz com BIT bidimensional.
status: done
complexity: O(log n log m) por operação
tags: fenwick, bit, matriz, consultas em retângulo
---

## Quando usar

Quando a matriz sofre atualizações pontuais e precisamos consultar somas em sub-retângulos. Para consultas estáticas, prefixos 2D costumam ser mais simples.

## Ideia

Cada célula da BIT guarda a soma de um bloco definido pelos bits menos significativos das coordenadas. A soma de um retângulo é obtida por inclusão-exclusão de quatro prefixos.

## Código

Índices 1-based. A matriz tem n linhas e m colunas.

~~~cpp
struct Fenwick2D {
    int n, m;
    vector<vector<long long>> bit;

    Fenwick2D(int n, int m) : n(n), m(m),
        bit(n + 1, vector<long long>(m + 1)) {}

    void add(int x, int y, long long val) {
        for (int i = x; i <= n; i += i & -i)
            for (int j = y; j <= m; j += j & -j)
                bit[i][j] += val;
    }

    long long sum(int x, int y) const {
        long long ans = 0;
        for (int i = x; i > 0; i -= i & -i)
            for (int j = y; j > 0; j -= j & -j)
                ans += bit[i][j];
        return ans;
    }

    long long query(int x1, int y1, int x2, int y2) const {
        return sum(x2, y2) - sum(x1 - 1, y2)
             - sum(x2, y1 - 1) + sum(x1 - 1, y1 - 1);
    }
};
~~~

## Cuidados

- Todas as coordenadas devem estar em [1..n] x [1..m]; prefixos com coordenada zero retornam zero.
- Memória O(nm), portanto não serve para matrizes enormes e esparsas.
- Para atualização de valor, mantenha o valor atual e chame add com a diferença.
- A estrutura acima soma valores; min/max não admitem a mesma combinação por inclusão-exclusão.
