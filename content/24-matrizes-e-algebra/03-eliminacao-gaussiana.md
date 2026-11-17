---
title: Eliminação gaussiana
summary: Resolve sistemas lineares com doubles (pivô parcial) e módulo primo (exato); conta soluções.
status: done
complexity: O(n³)
tags: álgebra linear, gauss, sistemas lineares
---

## Ideia

Transforme a matriz aumentada em forma escalonada reduzida escolhendo, em cada coluna, um pivô e zerando as demais linhas. Com `double`, escolha o pivô de maior módulo (pivô parcial) para reduzir erro numérico e compare com `eps`. Módulo primo é exato e usa o inverso modular. Colunas sem pivô são variáveis livres: o sistema tem infinitas soluções (ou `p^livres` módulo `p`), e uma linha `0 = c` com `c ≠ 0` mostra que não há solução.

## Código

```cpp
const double EPS = 1e-9;

// A (n x m) e b (n): resolve A x = b. Devolve -1 se não há solução, senão o nº de variáveis livres;
// x recebe uma solução (livres = 0)
int gauss(vector<vector<double>> a, vector<double> b, vector<double>& x) {
    int n = a.size(), m = a[0].size();
    for (int i = 0; i < n; i++) a[i].push_back(b[i]);
    vector<int> piv(m, -1);
    int row = 0;
    for (int col = 0; col < m && row < n; col++) {
        int sel = row;
        for (int i = row; i < n; i++) if (fabs(a[i][col]) > fabs(a[sel][col])) sel = i;
        if (fabs(a[sel][col]) < EPS) continue;
        swap(a[sel], a[row]);
        piv[col] = row;
        for (int i = 0; i < n; i++) {
            if (i == row) continue;
            double f = a[i][col] / a[row][col];
            for (int j = col; j <= m; j++) a[i][j] -= f * a[row][j];
        }
        row++;
    }
    for (int i = row; i < n; i++) if (fabs(a[i][m]) > EPS) return -1;
    x.assign(m, 0);
    int livres = 0;
    for (int j = 0; j < m; j++) {
        if (piv[j] >= 0) x[j] = a[piv[j]][m] / a[piv[j]][j];
        else livres++;
    }
    return livres;
}

const ll MOD = 998244353;
ll pw(ll a, ll e) {
    ll r = 1;
    for (a %= MOD; e; e >>= 1, a = a * a % MOD) if (e & 1) r = r * a % MOD;
    return r;
}

// mesmo problema módulo MOD (primo), exato; devolve -1 ou o nº de variáveis livres
int gauss_mod(vector<vector<ll>> a, vector<ll> b, vector<ll>& x) {
    int n = a.size(), m = a[0].size();
    for (int i = 0; i < n; i++) a[i].push_back(((b[i] % MOD) + MOD) % MOD);
    for (auto& r : a) for (auto& v : r) v = ((v % MOD) + MOD) % MOD;
    vector<int> piv(m, -1);
    int row = 0;
    for (int col = 0; col < m && row < n; col++) {
        int sel = -1;
        for (int i = row; i < n; i++) if (a[i][col]) { sel = i; break; }
        if (sel < 0) continue;
        swap(a[sel], a[row]);
        piv[col] = row;
        ll inv = pw(a[row][col], MOD - 2);
        for (int j = col; j <= m; j++) a[row][j] = a[row][j] * inv % MOD;
        for (int i = 0; i < n; i++) {
            if (i == row || !a[i][col]) continue;
            ll f = a[i][col];
            for (int j = col; j <= m; j++) a[i][j] = ((a[i][j] - f * a[row][j]) % MOD + MOD) % MOD;
        }
        row++;
    }
    for (int i = row; i < n; i++) if (a[i][m]) return -1;
    x.assign(m, 0);
    int livres = 0;
    for (int j = 0; j < m; j++) {
        if (piv[j] >= 0) x[j] = a[piv[j]][m];
        else livres++;
    }
    return livres;
}
```

## Complexidade e cuidados

- O determinante é o produto dos pivôs (com sinal trocado a cada troca de linhas); o código acima não o devolve, mas o laço é o mesmo.
- Com `double`, matrizes mal condicionadas perdem precisão: prefira a versão modular quando os dados são inteiros.
- Para sistemas sobre `GF(2)` (XOR) use `bitset` e o mesmo esquema (`O(n³ / 64)`).
- O número de soluções módulo `p` é `p^livres` quando o sistema é consistente.
