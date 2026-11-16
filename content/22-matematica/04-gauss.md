---
title: Eliminação de Gauss
summary: Resolve sistemas lineares e encontra posto da matriz.
status: done
complexity: O(n m min(n,m))
tags: matematica, algebra linear, gauss
---

## Quando usar

Resolver sistemas lineares Ax = b, verificar consistência e obter uma solução quando existem variáveis livres.

## Código

~~~cpp
struct GaussResult {
    bool possible;
    int rank;
    vector<long double> x;
};

GaussResult gauss(vector<vector<long double>> a, int m) {
    const long double EPS = 1e-12;
    int n = a.size(); // n equações, m variáveis; última coluna é b
    vector<int> where(m, -1);
    int row = 0;

    for (int col = 0; col < m && row < n; col++) {
        int sel = row;
        for (int i = row; i < n; i++)
            if (fabsl(a[i][col]) > fabsl(a[sel][col])) sel = i;

        if (fabsl(a[sel][col]) < EPS) continue;
        swap(a[sel], a[row]);
        where[col] = row;

        long double div = a[row][col];
        for (int j = col; j <= m; j++) a[row][j] /= div;

        for (int i = 0; i < n; i++) if (i != row) {
            long double factor = a[i][col];
            for (int j = col; j <= m; j++)
                a[i][j] -= factor * a[row][j];
        }
        row++;
    }

    for (int i = 0; i < n; i++) {
        bool zero = true;
        for (int j = 0; j < m; j++)
            if (fabsl(a[i][j]) >= EPS) zero = false;
        if (zero && fabsl(a[i][m]) >= EPS)
            return {false, row, {}};
    }

    vector<long double> x(m, 0);
    for (int j = 0; j < m; j++)
        if (where[j] != -1) x[j] = a[where[j]][m];

    return {true, row, x};
}
~~~

## Cuidados

- A matriz recebida tem m+1 colunas: coeficientes e termo independente.
- Se possible=false, o sistema é inconsistente.
- Se rank < m, há infinitas soluções; o código retorna uma solução particular atribuindo zero às variáveis livres.
- EPS depende da escala dos dados. Para coeficientes inteiros e problemas exatos, prefira eliminação modular ou frações.
