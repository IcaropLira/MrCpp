---
title: Counting sort
summary: Ordena chaves inteiras pequenas em O(n + K), de forma estável; base do radix sort.
status: done
complexity: O(n + K)
tags: ordenação, counting sort, radix sort
---

## Ideia

Conte quantas vezes cada chave aparece e transforme as contagens em posições iniciais (soma de prefixos). Percorrendo a entrada na ordem original e colocando cada elemento na próxima posição livre de sua chave, a ordenação fica estável. Isso permite encadear passadas: o radix sort ordena por um dígito de cada vez, do menos para o mais significativo.

## Código

```cpp
// ordena de forma estável por key(x) em [0, K)
template <class T, class F> vector<T> counting_sort_by(const vector<T>& a, int K, F key) {
    vector<int> pos(K + 1, 0);
    for (auto& x : a) pos[key(x) + 1]++;
    for (int k = 0; k < K; k++) pos[k + 1] += pos[k];  // pos[k] = início da chave k
    vector<T> out(a.size());
    for (auto& x : a) out[pos[key(x)]++] = x;
    return out;
}

// radix sort de inteiros não negativos de 32 bits, 4 passadas de 8 bits
void radix_sort(vector<unsigned>& a) {
    for (int sh = 0; sh < 32; sh += 8)
        a = counting_sort_by(a, 256, [&](unsigned x) { return (int)((x >> sh) & 255); });
}
```

## Uso

`counting_sort_by(v, 101, [](pair<int,int> p){ return p.first; })` ordena pares pela primeira componente mantendo a ordem dos empates.

## Complexidade e cuidados

- `K` é o tamanho do domínio das chaves; se `K` é muito maior que `n` (por exemplo `1e9`), não use: comprima as coordenadas ou use `sort`.
- A estabilidade é o que faz o radix sort funcionar: cada passada preserva a ordem da passada anterior.
- Chaves negativas: some o menor valor (deslocamento) antes de contar.
- Memória extra `O(n + K)`.
