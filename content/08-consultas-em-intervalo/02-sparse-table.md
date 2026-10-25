---
title: Sparse Table (RMQ)
summary: Mínimo em intervalo, sem atualizações.
status: done
complexity: O(n log n) + O(1)
tags: rmq, consultas
---

## Ideia

Guarda o mínimo de todos os blocos de tamanho potência de 2. Uma consulta junta dois blocos que se sobrepõem, o que não atrapalha para mínimo e máximo.

## Código

```cpp
struct Sparse {
    vector<vector<int>> t;
    Sparse(const vector<int>& a) {
        int n = a.size(), k = __lg(n) + 1;
        t.assign(k, vector<int>(n));
        t[0] = a;
        for (int j = 1; j < k; j++)
            for (int i = 0; i + (1 << j) <= n; i++)
                t[j][i] = min(t[j - 1][i], t[j - 1][i + (1 << (j - 1))]);
    }
    int query(int l, int r) { // [l, r]
        int j = __lg(r - l + 1);
        return min(t[j][l], t[j][r - (1 << j) + 1]);
    }
};
```

## Uso

`Sparse st(a); st.query(l, r);`
