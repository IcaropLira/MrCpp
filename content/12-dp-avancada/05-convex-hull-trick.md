---
title: Convex Hull Trick
summary: Mínimo de retas em um ponto, com inclinações adicionadas em ordem; acelera DP de O(n²) para O(n log n).
status: done
complexity: O(log n) por consulta; O(1) amortizado por inserção
tags: dp, convex hull trick, retas
---

## Ideia

Em transições `dp[i] = min_j (dp[j] + b[j] * a[i])` cada `j` é uma reta `y = b[j] * x + dp[j]` avaliada em `x = a[i]`. Mantém-se só o envelope inferior: ao inserir uma reta de inclinação menor que todas as anteriores, retiram-se do fim as retas que deixam de aparecer no envelope. A consulta é uma busca binária (ou um ponteiro se os `x` forem crescentes).

## Código

```cpp
// mínimo de m*x + b; retas inseridas com inclinação ESTRITAMENTE decrescente
struct CHT {
    vector<ll> M, B;
    int ptr = 0;  // para consultas com x crescente

    // a reta do meio é inútil se a interseção (1,3) vem antes da (1,2)
    bool inutil(int i1, int i2, ll m3, ll b3) {
        return (__int128)(b3 - B[i1]) * (M[i1] - M[i2]) <= (__int128)(B[i2] - B[i1]) * (M[i1] - m3);
    }
    void add(ll m, ll b) {
        while (M.size() >= 2 && inutil(M.size() - 2, M.size() - 1, m, b)) M.pop_back(), B.pop_back();
        M.push_back(m); B.push_back(b);
        ptr = min<int>(ptr, M.size() - 1);
    }
    ll f(int i, ll x) const { return M[i] * x + B[i]; }
    ll query(ll x) const {  // qualquer x: busca binária
        int lo = 0, hi = M.size() - 1;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (f(mid, x) > f(mid + 1, x)) lo = mid + 1; else hi = mid;
        }
        return f(lo, x);
    }
    ll query_crescente(ll x) {  // x não decrescente entre chamadas: O(1) amortizado
        while (ptr + 1 < (int)M.size() && f(ptr + 1, x) <= f(ptr, x)) ptr++;
        return f(ptr, x);
    }
};
```

## Complexidade e cuidados

- Para *máximo*, insira `(-m, -b)` e negue a resposta, ou inverta a ordem de inclinações (crescentes).
- Inclinações iguais: mantenha só a de menor `b` (para mínimo) antes de inserir.
- Os produtos usam `__int128` na comparação; `m * x + b` precisa caber em `long long`.
- Se as inclinações não vêm em ordem, use a Li Chao tree (`09-segment-tree-avancada/07-li-chao`) ou o CHT dinâmico.
