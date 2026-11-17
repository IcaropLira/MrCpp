---
title: set, map e multiset
summary: Árvores balanceadas: vizinhos, remoção de uma ocorrência e contagem de frequências.
status: done
complexity: O(log n) por operação
tags: stl, set, map, multiset
---

## Ideia

`set` e `map` mantêm as chaves ordenadas e permitem achar predecessor e sucessor com `lower_bound`/`upper_bound` em `O(log n)`. `multiset` aceita repetidos; `erase(valor)` remove *todas* as cópias, então para remover uma só use `erase(find(valor))`. Para só contar frequências sem ordem, `unordered_map` é mais rápido, porém com risco de ataques de colisão.

## Código

```cpp
// maior elemento <= x, ou nada
optional<int> pred(const set<int>& s, int x) {
    auto it = s.upper_bound(x);
    if (it == s.begin()) return nullopt;
    return *prev(it);
}

// menor elemento >= x, ou nada
optional<int> succ(const set<int>& s, int x) {
    auto it = s.lower_bound(x);
    if (it == s.end()) return nullopt;
    return *it;
}

// remove uma única ocorrência de x; devolve se havia
bool erase_one(multiset<int>& s, int x) {
    auto it = s.find(x);
    if (it == s.end()) return false;
    s.erase(it);
    return true;
}

// frequência de cada valor, em ordem
map<int, int> freq(const vector<int>& v) {
    map<int, int> m;
    for (int x : v) m[x]++;
    return m;
}
```

## Complexidade e cuidados

- `m[x]` cria a chave se ela não existir; use `m.find(x)` ou `m.count(x)` para só consultar.
- `distance(s.begin(), it)` é `O(n)` em `set`; para ranking por posição use uma árvore de estatísticas de ordem (`pb_ds`) ou um Fenwick.
- Modificar uma chave dentro do `set` é proibido; remova e reinsira.
- Iteradores de `set`/`map` não se invalidam em inserções; só o elemento apagado é invalidado.
