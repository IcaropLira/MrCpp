---
title: LCS com bitset
summary: Calcula o comprimento da maior subsequência comum em O(nm/64) usando operações em palavras de 64 bits.
status: done
complexity: O(n m / 64) tempo, O(sigma n / 64) memória
tags: strings, lcs, bitset, programação dinâmica
---

## Ideia

Na DP clássica da LCS, a linha `dp[j]` cresce de 0 ou 1 entre colunas vizinhas. Codificamos a linha pelos seus incrementos: `V` tem bit 0 onde a linha sobe e 1 onde não sobe (começa tudo 1). Para cada caractere `c` de `b`, com `M[c]` a máscara das posições de `a` iguais a `c`:

`V' = (V + (V & M[c])) | (V & ~M[c])`

A soma propaga o carry e realiza, de uma vez, a atualização da linha inteira. No fim, a LCS é o número de bits 0 entre as primeiras `n` posições de `V`. A soma de vários blocos de 64 bits é feita manualmente com carry.

## Código

~~~cpp
using ull = unsigned long long;

// comprimento da LCS de a e b em O(|a| |b| / 64); alfabeto de bytes
int lcs_bitset(const string& a, const string& b) {
    int n = a.size(), W = (n + 63) / 64;
    vector<vector<ull>> M(256, vector<ull>(W, 0));
    for (int i = 0; i < n; i++) M[(unsigned char)a[i]][i >> 6] |= 1ULL << (i & 63);
    vector<ull> V(W, ~0ULL);
    for (char ch : b) {
        const vector<ull>& m = M[(unsigned char)ch];
        ull carry = 0;
        for (int w = 0; w < W; w++) {
            ull v = V[w], u = v & m[w];
            ull s = v + u, c1 = s < v;
            ull s2 = s + carry, c2 = s2 < s;
            carry = c1 | c2;
            V[w] = s2 | (v & ~m[w]);
        }
    }
    int zeros = 0;
    for (int i = 0; i < n; i++) zeros += !((V[i >> 6] >> (i & 63)) & 1);
    return zeros;
}
~~~

## Complexidade e cuidados

- Alfabeto: bytes (256 máscaras); com alfabeto pequeno reduza para economizar memória.
- Coloque a string menor como `a` para reduzir a memória; o tempo é simétrico.
- Bits acima de `n` no último bloco são ignorados na contagem final, apenas os `n` primeiros são lidos.
- Fornece apenas o comprimento. Para reconstruir a subsequência use Hirschberg ou guarde as linhas de `V`.
- Strings vazias devolvem 0.
