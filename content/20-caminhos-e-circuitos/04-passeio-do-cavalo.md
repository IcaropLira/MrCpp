---
title: Passeio do cavalo
summary: Percorre todas as casas de um tabuleiro n×n com saltos de cavalo: Warnsdorff com desempate aleatório e reinícios.
status: done
complexity: Quase linear por tentativa; sem garantia de término em tabuleiros sem solução
tags: busca, cavalo, warnsdorff, heurística
---

## Ideia

Warnsdorff: a partir da casa atual, vá sempre para a próxima casa livre que tem *menos* saídas livres. Isso consome as casas difíceis (cantos) antes que fiquem isoladas e resolve quase todos os tabuleiros sem voltar atrás. Quando os empates são resolvidos sempre do mesmo jeito, alguns tabuleiros emperram; por isso cada tentativa é uma DFS com limite de nós e empates sorteados, e se ela falha reinicia-se com outros sorteios.

## Código

```cpp
// tab[i][j] = ordem (0..n*n-1) em que a casa é visitada; vazio se nenhuma tentativa achou
vector<vector<int>> passeio_cavalo(int n, int sx, int sy, int tentativas = 300) {
    const int dx[8] = {1, 2, 2, 1, -1, -2, -2, -1}, dy[8] = {2, 1, -1, -2, -2, -1, 1, 2};
    vector<vector<int>> t(n, vector<int>(n, -1));
    auto livre = [&](int x, int y) { return x >= 0 && y >= 0 && x < n && y < n && t[x][y] < 0; };
    auto saidas = [&](int x, int y) {
        int c = 0;
        for (int d = 0; d < 8; d++) c += livre(x + dx[d], y + dy[d]);
        return c;
    };
    mt19937 rng(712367);
    for (int tent = 0; tent < tentativas; tent++) {
        for (auto& linha : t) fill(linha.begin(), linha.end(), -1);
        long long nos = 0, limite = 100LL * n * n;
        function<bool(int, int, int)> go = [&](int x, int y, int k) {
            t[x][y] = k;
            if (k == n * n - 1) return true;
            if (++nos > limite) { t[x][y] = -1; return false; }
            vector<array<int, 3>> cand;  // {nº de saídas, desempate aleatório, direção}
            for (int d = 0; d < 8; d++)
                if (livre(x + dx[d], y + dy[d]))
                    cand.push_back({saidas(x + dx[d], y + dy[d]), (int)(rng() >> 1), d});
            sort(cand.begin(), cand.end());
            for (auto& c : cand)
                if (go(x + dx[c[2]], y + dy[c[2]], k + 1)) return true;
            t[x][y] = -1;
            return false;
        };
        if (go(sx, sy, 0)) return t;
    }
    return {};
}
```

## Complexidade e cuidados

- Não existe passeio em `n = 2, 3, 4`. Para `n` ímpar só as casas com `i + j` par servem de início; para `n` par (`n >= 6`) qualquer casa serve. Nos casos sem solução a função esgota as tentativas e devolve vazio.
- Vazio significa "não achou", não "não existe": para provar inexistência use a regra de cores acima.
- Passeio *fechado* (volta ao início) exige `n` par e `n >= 6`; este código só garante o aberto.
- Cada tentativa é limitada a `100 n²` nós; aumente `tentativas` para tabuleiros muito grandes.
