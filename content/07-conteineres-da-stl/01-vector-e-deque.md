---
title: vector e deque
summary: Idiomas de vector (dedup, remoção, rotação) e quando usar deque.
status: done
complexity: O(n) por operação indicada
tags: stl, vector, deque
---

## Ideia

`vector` é o padrão: acesso `O(1)`, `push_back` amortizado `O(1)`. Inserir ou remover no meio custa `O(n)`. `deque` permite `push/pop` nas duas pontas em `O(1)` com acesso por índice, útil em BFS 0-1 e filas monótonas. Os idiomas abaixo evitam laços manuais com erros de índice.

## Código

```cpp
// remove duplicatas mantendo ordem crescente
void dedup(vector<int>& v) {
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());
}

// remove todas as ocorrências de x em O(n) (erase-remove)
void remove_all(vector<int>& v, int x) {
    v.erase(remove(v.begin(), v.end(), x), v.end());
}

// rotaciona k posições para a esquerda
void rotate_left(vector<int>& v, int k) {
    if (v.empty()) return;
    k %= (int)v.size();
    rotate(v.begin(), v.begin() + k, v.end());
}

// matriz n x m inicializada com 0
vector<vector<int>> grid(int n, int m) { return vector<vector<int>>(n, vector<int>(m, 0)); }
```

## Complexidade e cuidados

- `v.size()` é `size_t` sem sinal: `v.size() - 1` com vetor vazio dá um valor enorme. Converta com `(int)v.size()`.
- `erase` dentro de um laço invalida iteradores; use o idioma erase-remove.
- `push_back` pode realocar e invalidar referências e iteradores; use `reserve(n)` quando souber o tamanho.
- `vector<bool>` é especial (bits compactados) e não devolve referência real.
