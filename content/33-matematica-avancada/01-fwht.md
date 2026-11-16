---
title: Fast Walsh-Hadamard Transform
summary: XOR convolution e transformada sobre máscaras em O(n log n).
status: done
complexity: O(n log n), n potência de 2
tags: fwht, xor, convolucao, bitmask
---

## Quando usar

Para convolução XOR de frequências: C[k] = soma A[i]B[j] sobre i XOR j = k. Também aparece em DP sobre subconjuntos e problemas de XOR.

## Código

A transformada abaixo usa inteiros. Para obter convolução modular, faça a inversa multiplicando por n^{-1} módulo MOD.

~~~cpp
void fwht(vector<long long>& a, bool inverse = false) {
    int n = a.size();
    for (int len = 1; len < n; len <<= 1)
        for (int i = 0; i < n; i += 2 * len)
            for (int j = 0; j < len; j++) {
                long long u = a[i + j];
                long long v = a[i + j + len];
                a[i + j] = u + v;
                a[i + j + len] = u - v;
            }

    if (inverse)
        for (auto& x : a) x /= n;
}

vector<long long> xor_convolution(vector<long long> a,
                                  vector<long long> b) {
    assert(a.size() == b.size());
    int n = a.size();
    assert(n && (n & (n - 1)) == 0);
    fwht(a);
    fwht(b);
    for (int i = 0; i < n; i++) a[i] *= b[i];
    fwht(a, true);
    return a;
}
~~~

## Cuidados

- O tamanho deve ser potência de 2.
- A versão acima é exata para inteiros se não houver overflow e a divisão inversa for exata.
- Para módulo primo, substitua a divisão por n pela multiplicação pelo inverso modular de n.
- Não confunda XOR convolution com OR/AND convolution; as borboletas são diferentes.
