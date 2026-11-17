---
title: Cadeias de Markov
summary: Tempo esperado até absorção e distribuição estacionária resolvendo sistemas lineares.
status: done
complexity: O(n³)
tags: probabilidade, markov, absorção, gauss
---

## Ideia

Uma cadeia de Markov é uma matriz de transição `P` (cada linha soma 1). Em uma cadeia com estados absorventes, sejam `Q` os estados transitórios; o número esperado de passos até a absorção a partir de cada um é a solução de `(I - Q) t = 1`. A probabilidade de absorver em um estado dado resolve `(I - Q) a = r`. A distribuição estacionária `π` satisfaz `π P = π` e `sum π = 1`.

## Código

```cpp
// resolve A x = b por Gauss com pivô parcial (A quadrada e não singular)
vector<double> resolve(vector<vector<double>> A, vector<double> b) {
    int n = A.size();
    for (int c = 0; c < n; c++) {
        int p = c;
        for (int i = c + 1; i < n; i++) if (fabs(A[i][c]) > fabs(A[p][c])) p = i;
        swap(A[c], A[p]); swap(b[c], b[p]);
        for (int i = 0; i < n; i++) {
            if (i == c) continue;
            double f = A[i][c] / A[c][c];
            for (int j = c; j < n; j++) A[i][j] -= f * A[c][j];
            b[i] -= f * b[c];
        }
    }
    vector<double> x(n);
    for (int i = 0; i < n; i++) x[i] = b[i] / A[i][i];
    return x;
}

// P[i][j] = prob. de i -> j; absorvente[i] = true se i é absorvente.
// Devolve t[i] = nº esperado de passos até ser absorvido (0 nos absorventes).
// Pressupõe que a absorção é alcançável de todo estado transitório.
vector<double> passos_ate_absorcao(const vector<vector<double>>& P, const vector<bool>& absorvente) {
    int n = P.size();
    vector<int> id(n, -1), est;
    for (int i = 0; i < n; i++) if (!absorvente[i]) id[i] = est.size(), est.push_back(i);
    int k = est.size();
    vector<vector<double>> A(k, vector<double>(k, 0));
    vector<double> b(k, 1.0);
    for (int a = 0; a < k; a++) {
        A[a][a] += 1;
        for (int j = 0; j < n; j++) if (id[j] >= 0) A[a][id[j]] -= P[est[a]][j];
    }
    vector<double> t = k ? resolve(A, b) : vector<double>();
    vector<double> r(n, 0);
    for (int a = 0; a < k; a++) r[est[a]] = t[a];
    return r;
}

// distribuição estacionária (cadeia irredutível e finita): pi P = pi, soma 1
vector<double> estacionaria(const vector<vector<double>>& P) {
    int n = P.size();
    vector<vector<double>> A(n, vector<double>(n));
    vector<double> b(n, 0);
    for (int j = 0; j < n; j++)
        for (int i = 0; i < n; i++) A[j][i] = P[i][j] - (i == j);
    for (int i = 0; i < n; i++) A[n - 1][i] = 1;  // troca a última equação por sum pi = 1
    b[n - 1] = 1;
    return resolve(A, b);
}
```

## Complexidade e cuidados

- Se algum estado transitório não alcança absorvente, `I - Q` é singular e o resultado é inválido.
- Para `n` grande e modular, use Gauss módulo primo (`24-matrizes-e-algebra/03-eliminacao-gaussiana`).
- Passeio aleatório em `0..N` com extremos absorventes: `t[i] = i (N - i)` e a probabilidade de chegar a `N` é `i / N`.
- Para muitas consultas com `P` fixa, eleve a matriz à potência `k` para a distribuição após `k` passos.
