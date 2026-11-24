---
title: Aliens trick (relaxação lagrangiana)
summary: Remover a restrição "exatamente k" quando f(k) é côncava: penaliza cada uso com λ e busca binária em λ.
status: done
complexity: O(n log V)
tags: aliens, lagrange, wqs binary search, dp, concavidade
---

## Quando vale

A resposta ótima `f(k)` usando exatamente `k` "coisas" é **côncava** (para máximo) em `k`. Então, para cada `λ`, `g(λ) = max_k (f(k) − λk)` é fácil (DP sem a dimensão `k`), e existe `λ` em que o ótimo usa `k` itens. Resposta: `g(λ) + λk`.

Cuidados: desempate pela **menor** quantidade e busque o menor `λ` com `qtd ≤ k` (trata patamares de f linear). Com pesos inteiros, `λ` inteiro basta.

## Código (k posições não adjacentes de soma máxima)

```cpp
// Aliens trick (lambda / relaxação lagrangiana): escolher EXATAMENTE k posições não adjacentes
// maximizando a soma. f(k) é côncava em k -> penaliza cada escolha com lambda e busca binária em lambda.
// g(lambda) = max (soma - lambda * qtd), resolvido sem a restrição de k em O(n).
// Resposta: g(lambda*) + lambda* * k, onde lambda* faz o ótimo usar k itens (desempate: menor qtd).
#include <bits/stdc++.h>
using namespace std;
using ll = long long;
int n, k; vector<ll> a;

pair<ll,int> resolve(ll lambda) {           // (melhor valor, menor qtd que o atinge)
    pair<ll,int> livre = {0, 0}, usado = {LLONG_MIN / 4, 0};   // último não escolhido / escolhido
    for (int i = 0; i < n; i++) {
        pair<ll,int> nu = {livre.first + a[i] - lambda, livre.second + 1};
        pair<ll,int> nl = max(livre, usado, [](auto x, auto y) { return x.first != y.first ? x.first < y.first : x.second > y.second; });
        livre = nl; usado = nu;
    }
    return max(livre, usado, [](auto x, auto y) { return x.first != y.first ? x.first < y.first : x.second > y.second; });
}

int main() {
    cin >> n >> k; a.resize(n);
    for (auto &x : a) cin >> x;
    ll lo = -3e9, hi = 3e9;                  // lambda inteiro basta com pesos inteiros
    while (lo < hi) {                        // menor lambda cuja qtd ótima (mínima) é <= k
        ll mid = lo + (hi - lo) / 2;
        if (resolve(mid).second <= k) hi = mid; else lo = mid + 1;
    }
    cout << resolve(lo).first + lo * k << '\n';
}
```

Exemplo testado — entrada:

```text
6 2
5 1 1 5 9 2
```

saída:

```text
14
```

> Verificação: 400 casos aleatórios contra a DP O(n·k).
