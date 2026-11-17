---
title: Regras de cálculo
summary: Como obter a complexidade de laços: sequência soma, aninhamento multiplica, e os casos log e harmônico.
status: done
complexity: —
tags: complexidade, análise, laços
---

## Ideia

Regras práticas: (1) comandos em sequência *somam* custos e domina o maior; (2) laços aninhados *multiplicam*; (3) constantes e termos menores somem (`3n² + 5n` é `O(n²)`); (4) um laço em que a variável dobra (`i *= 2`) executa `log2 n` vezes; (5) um laço `j` de `i` a `n` em passos de `i` soma a série harmônica `n/1 + n/2 + ... = n ln n`; (6) em recursão, some o custo por chamada sobre todas as chamadas. As funções abaixo contam as operações de cada padrão, para conferir a fórmula.

## Código

```cpp
// um laço: n execuções
ll um_laco(ll n) { ll c = 0; for (ll i = 0; i < n; i++) c++; return c; }

// dois laços aninhados completos: n * n
ll dois_lacos(ll n) { ll c = 0; for (ll i = 0; i < n; i++) for (ll j = 0; j < n; j++) c++; return c; }

// laço interno triangular: n(n-1)/2, ainda O(n^2)
ll triangular(ll n) { ll c = 0; for (ll i = 0; i < n; i++) for (ll j = 0; j < i; j++) c++; return c; }

// variável que dobra: floor(log2 n) + 1 execuções
ll dobrando(ll n) { ll c = 0; for (ll i = 1; i <= n; i *= 2) c++; return c; }

// harmônico: sum_{i=1..n} floor(n / i) = O(n log n)
ll harmonico(ll n) { ll c = 0; for (ll i = 1; i <= n; i++) for (ll j = i; j <= n; j += i) c++; return c; }

// raiz: i * i <= n executa floor(sqrt n) vezes
ll raiz(ll n) { ll c = 0; for (ll i = 1; i * i <= n; i++) c++; return c; }
```

## Complexidade e cuidados

- Conte o laço *interno* com os limites reais: `j < i` dá metade do `n²`, mas continua `O(n²)`.
- `harmonico(n)` vale cerca de `n ln n`: para `n = 10^6` são `1,4 · 10^7` operações, muito menos que `n²`.
- Chamadas a funções da STL entram na conta: `sort` custa `O(n log n)`, `set::insert` custa `O(log n)`, `string::substr` e `vector` copiados custam `O(tamanho)`.
- Se o custo depende de mais de uma variável (`n` e `m`), mantenha as duas: `O(n + m)` ou `O(n · m)`.
