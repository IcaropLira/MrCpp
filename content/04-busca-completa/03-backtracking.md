---
title: Backtracking
summary: Constrói a solução passo a passo e desfaz a escolha ao voltar; exemplo: N rainhas com bitmask.
status: done
complexity: O(n!) no pior caso
tags: busca completa, backtracking, n-rainhas, bitmask
---

## Ideia

Escolha uma decisão, recurse e desfaça ao voltar. No problema das N rainhas coloque uma rainha por linha; três máscaras guardam colunas e as duas diagonais ocupadas, e `livres & -livres` extrai a próxima casa disponível. As diagonais deslocam-se uma casa a cada linha.

## Código

```cpp
// número de formas de posicionar n rainhas sem ataques (n <= 15)
int nqueens(int n) {
    int full = (1 << n) - 1, cnt = 0;
    function<void(int, int, int)> go = [&](int cols, int d1, int d2) {
        if (cols == full) { cnt++; return; }
        int livres = full & ~(cols | d1 | d2);
        while (livres) {
            int b = livres & -livres;
            livres ^= b;
            go(cols | b, ((d1 | b) << 1) & full, (d2 | b) >> 1);
        }
    };
    go(0, 0, 0);
    return cnt;
}
```

## Complexidade e cuidados

- Resultados conhecidos: `n = 1..10` dá 1, 0, 0, 2, 10, 4, 40, 92, 352, 724.
- Sempre desfaça o estado ao voltar (aqui isso é automático porque as máscaras são passadas por valor).
- Backtracking é busca completa com poda natural: só explora estados válidos. Veja também a ficha de poda.
- Para contar apenas até simetria, fixe a primeira rainha na metade esquerda e dobre.
