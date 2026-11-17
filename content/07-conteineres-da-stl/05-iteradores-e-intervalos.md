---
title: Iteradores e intervalos
summary: lower_bound, upper_bound, equal_range e as armadilhas de apagar durante a iteração.
status: done
complexity: O(log n) por consulta em vetor ordenado
tags: stl, iteradores, busca
---

## Ideia

Em um vetor ordenado, `lower_bound(x)` aponta para o primeiro elemento `>= x` e `upper_bound(x)` para o primeiro `> x`. A contagem em um intervalo de valores `[l, r]` é a diferença entre os dois. Em `set`/`map`, use as funções-membro de mesmo nome (`s.lower_bound(x)`), não `lower_bound(s.begin(), ...)`, que é `O(n)`.

## Código

```cpp
// quantos elementos de v (ordenado) estão em [l, r]
int contar(const vector<int>& v, int l, int r) {
    return upper_bound(v.begin(), v.end(), r) - lower_bound(v.begin(), v.end(), l);
}

// primeiro elemento > x; devolve -1 se não existir
int primeiro_maior(const vector<int>& v, int x) {
    auto it = upper_bound(v.begin(), v.end(), x);
    return it == v.end() ? -1 : *it;
}

// apaga de s todos os pares (percorrendo com segurança)
void apagar_pares(set<int>& s) {
    for (auto it = s.begin(); it != s.end();) {
        if (*it % 2 == 0) it = s.erase(it);  // erase devolve o próximo
        else ++it;
    }
}
```

## Complexidade e cuidados

- Sempre confira `it == v.end()` antes de desreferenciar o resultado de uma busca.
- Subtrair iteradores só vale em contêineres de acesso aleatório (`vector`, `deque`).
- `it = s.erase(it)` é o padrão correto; `s.erase(it++)` também funciona em contêineres de nós, mas `erase(it); ++it` não.
- `equal_range` devolve o par `{lower_bound, upper_bound}` em uma única busca.
