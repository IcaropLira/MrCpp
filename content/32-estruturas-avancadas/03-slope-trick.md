---
title: Slope Trick
summary: Representa funções convexas por partes para otimizações de DP.
status: done
complexity: O(log n) por inserção de termo absoluto
tags: dp, convexidade, slope trick, heaps
---

## Quando usar

Em DP de otimização convexa, especialmente quando a função de custo é soma de valores absolutos. A representação por dois heaps mantém os pontos de quebra da derivada.

## Código — soma de valores absolutos

A estrutura abaixo representa F(x) = soma |x-a_i|. get_min retorna o mínimo e argmin retorna o intervalo de minimizadores (medianas).

~~~cpp
struct SlopeTrickAbs {
    priority_queue<long long> L;
    priority_queue<long long, vector<long long>, greater<long long>> R;
    long long min_f = 0;

    void add_abs(long long a) {
        if (!L.empty() && L.top() > a) {
            min_f += L.top() - a;
            R.push(L.top());
            L.pop();
            L.push(a);
        } else if (!R.empty() && R.top() < a) {
            min_f += a - R.top();
            L.push(R.top());
            R.pop();
            R.push(a);
        } else {
            L.push(a);
            R.push(a);
        }
    }

    long long get_min() const { return min_f; }

    pair<long long,long long> argmin() const {
        if (L.empty() || R.empty()) return {LLONG_MIN, LLONG_MAX};
        return {L.top(), R.top()};
    }
};
~~~

## Cuidados

- Esta implementação específica mantém soma de valores absolutos; não é a biblioteca completa de Slope Trick com operações de shift, chmin ou prefix minimum.
- O intervalo de minimizadores é [max(L), min(R)].
- A cada inserção, heaps crescem em O(log n); consulta do mínimo é O(1).
- Para DP com transições e deslocamentos, derive as operações sobre os pontos de quebra antes de adaptar a estrutura.
