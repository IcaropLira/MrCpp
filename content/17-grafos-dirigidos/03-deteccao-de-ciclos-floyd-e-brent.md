---
title: Detecção de ciclos: Floyd e Brent
summary: Em x -> f(x), acha o início do ciclo (mu) e seu comprimento (lambda) com O(1) de memória.
status: done
complexity: O(mu + lambda) tempo, O(1) memória
tags: grafos, ciclo, floyd, brent, grafo funcional
---

## Ideia

Em um grafo funcional cada vértice tem uma única saída `f(x)`. A sequência `x0, f(x0), f(f(x0)), ...` entra em um ciclo após `mu` passos de cauda e depois repete com período `lambda`. Floyd usa duas velocidades (tartaruga e lebre): o encontro prova o ciclo; reiniciando a tartaruga em `x0`, os dois se encontram no início do ciclo; andando só a lebre mede-se `lambda`. Brent usa potências de dois e faz menos avaliações de `f`.

## Código

```cpp
// retorna {mu, lambda}: índice do primeiro vértice do ciclo e comprimento do ciclo
pair<ll, ll> floyd(function<ll(ll)> f, ll x0) {
    ll tort = f(x0), lebre = f(f(x0));
    while (tort != lebre) tort = f(tort), lebre = f(f(lebre));
    ll mu = 0;
    tort = x0;
    while (tort != lebre) tort = f(tort), lebre = f(lebre), mu++;
    ll lambda = 1;
    lebre = f(tort);
    while (tort != lebre) lebre = f(lebre), lambda++;
    return {mu, lambda};
}

pair<ll, ll> brent(function<ll(ll)> f, ll x0) {
    ll potencia = 1, lambda = 1;
    ll tort = x0, lebre = f(x0);
    while (tort != lebre) {
        if (potencia == lambda) tort = lebre, potencia *= 2, lambda = 0;
        lebre = f(lebre);
        lambda++;
    }
    tort = lebre = x0;
    for (ll i = 0; i < lambda; i++) lebre = f(lebre);
    ll mu = 0;
    while (tort != lebre) tort = f(tort), lebre = f(lebre), mu++;
    return {mu, lambda};
}
```

## Complexidade e cuidados

- Pressupõe que `f` é determinística e a sequência realmente entra em ciclo (domínio finito).
- Para a posição `k` muito grande: se `k < mu` use simulação; senão `x_k = x_{mu + (k - mu) % lambda}`.
- Quando se pode guardar visitados em `map`, isso é mais simples mas gasta memória `O(mu + lambda)`.
- Aplicações: geradores pseudoaleatórios, Pollard Rho, `f(x) = x^2 + c mod n`.
