---
title: Reduzindo código
summary: Aliases, impressão genérica de contêineres e um dbg() para depurar sem reescrever.
status: done
complexity: O(1)
tags: introdução, template, depuração
---

## Ideia

Em contest, menos código significa menos erros e mais tempo para pensar. Aliases (`using ll = long long`), `auto`, lambdas, `structured bindings` e a STL (`iota`, `sort`, `accumulate`) tiram laços repetitivos. Vale mais ainda ter uma função genérica de impressão: ela mostra qualquer vetor, par ou mapa e serve para depurar na saída de erro (`cerr`), que o juiz ignora.

## Código

```cpp
using ll = long long;
using pii = pair<int, int>;
using vi = vector<int>;

// impressão de pares, vetores, conjuntos e mapas: (a, b) [x, y, z] {x, y}
template <class A, class B> ostream& operator<<(ostream& o, const pair<A, B>& p) {
    return o << '(' << p.first << ", " << p.second << ')';
}
template <class T> ostream& operator<<(ostream& o, const vector<T>& v) {
    o << '[';
    for (size_t i = 0; i < v.size(); i++) o << (i ? ", " : "") << v[i];
    return o << ']';
}
template <class T> ostream& operator<<(ostream& o, const set<T>& s) {
    o << '{';
    bool primeiro = true;
    for (auto& x : s) o << (primeiro ? "" : ", ") << x, primeiro = false;
    return o << '}';
}
template <class K, class V> ostream& operator<<(ostream& o, const map<K, V>& m) {
    o << '{';
    bool primeiro = true;
    for (auto& [k, v] : m) o << (primeiro ? "" : ", ") << k << ": " << v, primeiro = false;
    return o << '}';
}

#define dbg(x) cerr << #x << " = " << (x) << '\n'
```

## Uso

`vector<pii> v = {{1, 2}, {3, 4}}; dbg(v);` imprime `v = [(1, 2), (3, 4)]`.

## Complexidade e cuidados

- Imprima depurações em `cerr` e remova (ou desligue com `#ifdef LOCAL`) antes de enviar: algumas plataformas tratam saída de erro como falha.
- Evite macros que escondem laços (`#define rep(i,n) for...`) em código que outras pessoas vão ler; aliases e templates são mais seguros.
- As funções `operator<<` precisam estar declaradas antes de usar; a de `vector<pair<...>>` exige a de `pair` já definida.
- Copiar um template pronto para o início de cada solução economiza minutos, mas confira se compila com `-Wall` no juiz local.
