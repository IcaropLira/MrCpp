---
title: Teorema de Sprague-Grundy
summary: Cada jogo imparcial vale um número de Grundy; a soma de jogos é ganha por quem move se o XOR for diferente de zero.
status: done
complexity: O(n · |S|)
tags: jogos, sprague-grundy, nim, mex
---

## Ideia

Em um jogo imparcial (os dois jogadores têm os mesmos movimentos) em que perde quem não pode mover, o *número de Grundy* de uma posição é `mex` dos Grundy das posições alcançáveis (o menor natural ausente). Posição com Grundy 0 é perdedora. Uma soma de jogos independentes (cada jogador move em um deles por vez) tem Grundy igual ao XOR dos Grundy das componentes, e o primeiro jogador vence se e só se esse XOR for diferente de zero. O Nim com pilhas `a_i` é o caso `g(a_i) = a_i`.

## Código

```cpp
int mex(const vector<int>& v) {
    vector<char> vis(v.size() + 1, 0);
    for (int x : v) if (x <= (int)v.size()) vis[x] = 1;
    int m = 0;
    while (vis[m]) m++;
    return m;
}

// jogo de retirar de uma pilha qualquer quantidade em S; g[i] = Grundy de uma pilha com i pedras
vector<int> grundy_subtracao(int n, const vector<int>& S) {
    vector<int> g(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        vector<int> alc;
        for (int s : S) if (s <= i) alc.push_back(g[i - s]);
        g[i] = mex(alc);
    }
    return g;
}

// soma de pilhas: o primeiro jogador vence?
bool primeiro_vence(const vector<int>& pilhas, const vector<int>& g) {
    int x = 0;
    for (int p : pilhas) x ^= g[p];
    return x != 0;
}
```

## Complexidade e cuidados

- Vale para jogos *finitos* e imparciais com a regra normal (quem não pode mover perde). Na regra misère (quem não pode mover vence) o Nim muda e o teorema não se aplica diretamente.
- Para jogos em que as componentes são estados mais complexos (por exemplo, um tabuleiro que se parte em dois), calcule `g` por memoização sobre o estado.
- O valor de Grundy de uma pilha em `{1, 2, 3}` é `i mod 4`.
- Na prática, imprima os primeiros Grundy e procure padrão periódico para `n` grande.
