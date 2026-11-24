---
title: Rerooting genérico (template)
summary: Resposta para todas as raízes definindo só merge, neutro, up (atravessar aresta) e fim (fechar o vértice); prefixo/sufixo dos irmãos, sem inverso.
status: done
complexity: O(n) chamadas de merge
tags: rerooting, dp em árvore, template, todas as raízes
---

## Como adaptar

| Peça | Significado | No exemplo |
|---|---|---|
| `Pac` | o que uma subárvore "devolve" ao pai | (nº de vértices, soma das profundidades, maior profundidade) |
| `E` | neutro do `merge` | (0, 0, −∞) |
| `merge_(a, b)` | junta irmãos (associativo e comutativo) | soma, soma, máximo |
| `up(x, u)` | atravessar a aresta `u → pai` | cada vértice fica 1 mais fundo: `soma += cnt`, `mx += 1` |
| `fim(acc, v)` | incluir o próprio `v` | `cnt + 1`, profundidade 0 |

Funciona para qualquer DP de árvore em que a resposta de `v` é `fim(merge de up(filhos))`. Exemplos de troca: nº de subárvores conexas contendo v (`Pac = ll`, merge = produto, up = `x + 1`), maior caminho saindo de v, AtCoder DP V (Subtree), Tree Distances I e II.

## Código (soma das distâncias e excentricidade de cada vértice)

```cpp
// Rerooting GENÉRICO: resposta para todas as raízes com 3 ingredientes
//   T        tipo do "pacote" de uma subárvore
//   e        neutro do merge
//   merge    junta pacotes de irmãos (associativo e comutativo)
//   up(x, v) transforma o pacote da subárvore de x no que o pai enxerga pela aresta (x -> pai)
//   fim(acc, v) fecha o pacote de v a partir do merge dos filhos
// Exemplo: para cada v, (soma das distâncias, maior distância) até os demais vértices.
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

struct Pac { ll cnt, soma, mx; };                     // nº de vértices, soma das profundidades, maior profundidade
const Pac E = {0, 0, LLONG_MIN / 4};
Pac merge_(Pac a, Pac b) { return {a.cnt + b.cnt, a.soma + b.soma, max(a.mx, b.mx)}; }
Pac fim(Pac acc, int) { return {acc.cnt + 1, acc.soma, max(acc.mx, 0LL)}; }    // inclui o próprio v (prof 0)
Pac up(Pac x, int) { return {x.cnt, x.soma + x.cnt, x.mx + 1}; }              // descer uma aresta: +1 em todos

int main() {
    ios::sync_with_stdio(false); cin.tie(nullptr);
    int n; cin >> n;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) { int a, b; cin >> a >> b; g[a].push_back(b); g[b].push_back(a); }
    vector<int> par(n + 1, 0), ord = {1};
    for (int i = 0; i < (int)ord.size(); i++) { int v = ord[i]; for (int u : g[v]) if (u != par[v]) { par[u] = v; ord.push_back(u); } }
    vector<Pac> down(n + 1), fromPar(n + 1, E), ans(n + 1);
    for (int i = n - 1; i >= 0; i--) {                  // 1) sobe: down[v] = pacote da subárvore de v
        int v = ord[i]; Pac acc = E;
        for (int u : g[v]) if (u != par[v]) acc = merge_(acc, up(down[u], u));
        down[v] = fim(acc, v);
    }
    for (int v : ord) {                                 // 2) desce: prefixo/sufixo dos filhos (sem inverso)
        vector<int> ch; for (int u : g[v]) if (u != par[v]) ch.push_back(u);
        int k = ch.size();
        vector<Pac> pre(k + 1, E), suf(k + 1, E);
        for (int j = 0; j < k; j++) pre[j + 1] = merge_(pre[j], up(down[ch[j]], ch[j]));
        for (int j = k - 1; j >= 0; j--) suf[j] = merge_(suf[j + 1], up(down[ch[j]], ch[j]));
        Pac base = v == 1 ? E : up(fromPar[v], par[v]);   // o "resto da árvore" visto de v
        ans[v] = fim(merge_(base, pre[k]), v);
        for (int j = 0; j < k; j++) fromPar[ch[j]] = fim(merge_(base, merge_(pre[j], suf[j + 1])), v);
    }
    for (int v = 1; v <= n; v++) cout << ans[v].soma << ' ' << ans[v].mx << '\n';
}
```

Exemplo testado — entrada:

```text
5
1 2
1 3
3 4
3 5
```

saída:

```text
6 2
9 3
5 2
8 3
8 3
```

> Verificação: 400 árvores aleatórias contra BFS de cada vértice.
