---
title: Rotação mínima e comparação cíclica
summary: Acha a menor rotação lexicográfica de uma string em O(n) e compara rotações de strings diferentes.
status: done
complexity: O(n)
tags: strings, rotação, string cíclica, forma canônica
---

## Ideia

Mantemos dois candidatos `i` e `j` a início da menor rotação e um comprimento comum `k` já verificado. Ao primeiro desencontro `a != b` em `s[i+k]` e `s[j+k]`, o candidato com o caractere maior (e todos os inícios `i..i+k`, que são dominados por `j..j+k`) pode ser descartado: avançamos esse candidato em `k+1`. Cada passo descarta pelo menos `k+1` posições, logo o total é O(n). Quando `k` chega a `n`, as duas rotações são iguais (a string é periódica) e o menor índice serve.

Para a forma canônica de uma string cíclica, use `rotação a partir de min_rotation(s)`; duas strings são rotações uma da outra se e somente se suas formas canônicas coincidem. Uma alternativa é a fatoração de Duval (seção de Lyndon) sobre `s+s`.

## Código

~~~cpp
// índice inicial da menor rotação (menor índice em caso de empate)
int min_rotation(const string& s) {
    int n = s.size(), i = 0, j = 1, k = 0;
    while (i < n && j < n && k < n) {
        char a = s[(i + k) % n], b = s[(j + k) % n];
        if (a == b) { k++; continue; }
        if (a > b) i += k + 1; else j += k + 1;
        if (i == j) j++;
        k = 0;
    }
    return min(i, j);
}

// compara a rotação de a em i com a rotação de b em j (|a| = |b|): -1, 0 ou 1
int cmp_rot(const string& a, int i, const string& b, int j) {
    int n = a.size();
    for (int k = 0; k < n; k++) {
        char x = a[(i + k) % n], y = b[(j + k) % n];
        if (x != y) return x < y ? -1 : 1;
    }
    return 0;
}
~~~

## Uso

~~~cpp
string canon(const string& s) {
    int i = min_rotation(s);
    return s.substr(i) + s.substr(0, i);
}
~~~

## Complexidade e cuidados

- Alfabeto qualquer (comparação por `char`, sem sinal se houver bytes acima de 127: converta para `unsigned char` na comparação).
- Indexação 0-based; em strings periódicas devolve o menor índice entre as rotações mínimas.
- `n = 0` devolve 0 (o laço não executa); `n = 1` devolve 0.
- `cmp_rot` é O(n) direta; para muitas comparações use hash com busca binária do primeiro desencontro ou o suffix array de `s+s`.
- Forma canônica: `s.substr(i) + s.substr(0, i)` com `i = min_rotation(s)`.
