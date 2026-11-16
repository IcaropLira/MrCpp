---
title: Simplex para programação linear
summary: Resolve programas lineares maximizando c*x sujeito a A*x <= b e x >= 0.
status: done
complexity: O(m n) por pivô; exponencial no pior caso
tags: simplex, programacao linear, otimizacao
---

## Quando usar

Quando o problema pode ser formulado como programação linear e as variáveis são reais não negativas. Em programação competitiva, aparece em problemas de otimização com restrições lineares.

## Modelo

Maximize c^T x sujeito a A x <= b e x >= 0. A implementação abaixo usa tableau com fase I para lidar com b negativo.

## Código

~~~cpp
struct LPSolver {
    static constexpr double EPS = 1e-9, INF = 1e100;
    int m, n;
    vector<int> B, N;
    vector<vector<double>> D;

    LPSolver(const vector<vector<double>>& A, const vector<double>& b,
             const vector<double>& c)
        : m(b.size()), n(c.size()), B(m), N(n + 1),
          D(m + 2, vector<double>(n + 2)) {
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) D[i][j] = A[i][j];
        for (int i = 0; i < m; i++) {
            B[i] = n + i;
            D[i][n] = -1;
            D[i][n + 1] = b[i];
        }
        for (int j = 0; j < n; j++) N[j] = j, D[m][j] = -c[j];
        N[n] = -1;
        D[m + 1][n] = 1;
    }

    void pivot(int r, int s) {
        double inv = 1.0 / D[r][s];
        for (int i = 0; i < m + 2; i++) if (i != r)
            for (int j = 0; j < n + 2; j++) if (j != s)
                D[i][j] -= D[r][j] * D[i][s] * inv;
        for (int j = 0; j < n + 2; j++) if (j != s) D[r][j] *= inv;
        for (int i = 0; i < m + 2; i++) if (i != r) D[i][s] *= -inv;
        D[r][s] = inv;
        swap(B[r], N[s]);
    }

    bool simplex(int phase) {
        int x = phase == 1 ? m + 1 : m;
        while (true) {
            int s = -1;
            for (int j = 0; j <= n; j++) {
                if (phase == 2 && N[j] == -1) continue;
                if (s == -1 || D[x][j] < D[x][s] - EPS ||
                    (abs(D[x][j] - D[x][s]) <= EPS && N[j] < N[s])) s = j;
            }
            if (D[x][s] >= -EPS) return true;
            int r = -1;
            for (int i = 0; i < m; i++) {
                if (D[i][s] <= EPS) continue;
                if (r == -1 || D[i][n + 1] / D[i][s] < D[r][n + 1] / D[r][s] - EPS ||
                    (abs(D[i][n + 1] / D[i][s] - D[r][n + 1] / D[r][s]) <= EPS && B[i] < B[r]))
                    r = i;
            }
            if (r == -1) return false;
            pivot(r, s);
        }
    }

    // Retorna -INF se inviável, INF se ilimitado; caso contrário, ótimo.
    double solve(vector<double>& x) {
        int r = 0;
        for (int i = 1; i < m; i++)
            if (D[i][n + 1] < D[r][n + 1]) r = i;
        if (m && D[r][n + 1] < -EPS) {
            pivot(r, n);
            if (!simplex(1) || D[m + 1][n + 1] < -EPS) return -INF;
            if (abs(D[m + 1][n + 1]) > EPS) return -INF;
            for (int i = 0; i < m; i++) if (B[i] == -1) {
                int s = 0;
                for (int j = 1; j <= n; j++)
                    if (D[i][j] < D[i][s] - EPS ||
                        (abs(D[i][j] - D[i][s]) <= EPS && N[j] < N[s])) s = j;
                pivot(i, s);
            }
        }
        if (!simplex(2)) return INF;
        x.assign(n, 0);
        for (int i = 0; i < m; i++) if (B[i] < n) x[B[i]] = D[i][n + 1];
        return D[m][n + 1];
    }
};
~~~

## Cuidados

- O algoritmo usa double e tolerância EPS; não é apropriado quando a resposta exige aritmética exata.
- INF significa ilimitado; -INF significa inviável.
- Variáveis livres precisam ser representadas como diferença de duas variáveis não negativas.
- O Simplex tem pior caso exponencial, embora funcione bem em muitas instâncias práticas.
