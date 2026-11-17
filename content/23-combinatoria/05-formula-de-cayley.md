---
title: Fórmula de Cayley
summary: Há n^(n-2) árvores rotuladas com n vértices; código de Prüfer e contagem de florestas.
status: done
complexity: O(n)
tags: combinatória, cayley, prüfer, árvores
---

## Ideia

O código de Prüfer é uma bijeção entre árvores rotuladas em `n` vértices e sequências de tamanho `n-2` sobre `1..n`, o que dá `n^(n-2)` árvores. Para codificar, remova repetidamente a folha de menor rótulo e anote o rótulo do seu vizinho. Para decodificar, o grau de cada vértice é `1 +` o número de aparições na sequência; ligue sempre a menor folha ao próximo elemento. Generalização: o número de florestas de `k` árvores em que `k` vértices dados estão em árvores distintas é `k · n^(n-k-1)`.

## Código

```cpp
const ll MOD = 1e9 + 7;
ll pw(ll a, ll e) {
    ll r = 1;
    for (a %= MOD; e; e >>= 1, a = a * a % MOD) if (e & 1) r = r * a % MOD;
    return r;
}
ll arvores(int n) { return n <= 1 ? 1 : pw(n, n - 2); }
ll florestas(int n, int k) { return k == n ? 1 : k * pw(n, n - k - 1) % MOD; }  // 1 <= k <= n

// vértices 0..n-1; a árvore é dada por n-1 arestas; devolve o código (n-2 números)
vector<int> prufer_codifica(int n, const vector<pair<int, int>>& E) {
    vector<vector<int>> g(n);
    vector<int> grau(n, 0), seq;
    for (auto [u, v] : E) g[u].push_back(v), g[v].push_back(u), grau[u]++, grau[v]++;
    set<int> folhas;
    for (int v = 0; v < n; v++) if (grau[v] == 1) folhas.insert(v);
    vector<char> removido(n, false);
    for (int i = 0; i < n - 2; i++) {
        int f = *folhas.begin();
        folhas.erase(folhas.begin());
        removido[f] = true;
        for (int w : g[f]) if (!removido[w]) {
            seq.push_back(w);
            if (--grau[w] == 1) folhas.insert(w);
        }
    }
    return seq;
}

// inverso: devolve as n-1 arestas
vector<pair<int, int>> prufer_decodifica(int n, const vector<int>& seq) {
    vector<int> grau(n, 1);
    for (int x : seq) grau[x]++;
    set<int> folhas;
    for (int v = 0; v < n; v++) if (grau[v] == 1) folhas.insert(v);
    vector<pair<int, int>> E;
    for (int x : seq) {
        int f = *folhas.begin();
        folhas.erase(folhas.begin());
        E.push_back({f, x});
        if (--grau[x] == 1) folhas.insert(x);
    }
    int a = *folhas.begin(), b = *next(folhas.begin());
    E.push_back({a, b});
    return E;
}
```

## Complexidade e cuidados

- Com `set` o código é `O(n log n)`; uma versão com ponteiro para a menor folha faz `O(n)`.
- `n = 1` e `n = 2` são casos especiais (código vazio); `prufer_decodifica` exige `n >= 2`.
- A contagem de árvores geradoras do grafo completo `K_n` é `n^(n-2)`; para grafos gerais use o teorema da matriz-árvore (determinante de Laplaciano).
- Se o grau de cada vértice é dado, o número de árvores é o coeficiente multinomial `(n-2)! / prod (d_i - 1)!`.
