---
title: Base linear de XOR
summary: Mantém uma base de vetores binários para maximizar XOR e testar representabilidade.
status: done
complexity: O(B) por inserção e consulta
tags: xor, algebra linear, bitmask
---

## Quando usar

Problemas de subconjuntos em que a operação é XOR: maior XOR possível, verificar se um valor pode ser formado por XOR de elementos ou descobrir o posto do conjunto.

## Código

```cpp
struct XorBasis {
    static constexpr int B = 64;
    unsigned long long basis[B]{};
    int rank = 0;

    bool insert(unsigned long long x) {
        for (int b = B - 1; b >= 0; --b) {
            if (!(x >> b & 1ULL)) continue;
            if (basis[b]) x ^= basis[b];
            else {
                basis[b] = x;
                ++rank;
                return true;
            }
        }
        return false;
    }

    bool contains(unsigned long long x) const {
        for (int b = B - 1; b >= 0; --b)
            if ((x >> b & 1ULL) && basis[b])
                x ^= basis[b];
        return x == 0;
    }

    unsigned long long max_xor(unsigned long long seed = 0) const {
        for (int b = B - 1; b >= 0; --b)
            seed = max(seed, seed ^ basis[b]);
        return seed;
    }
};
```

- A base não é necessariamente reduzida; as operações acima não dependem disso.
- `rank` é a dimensão do espaço gerado. Existem `2^rank` XORs distintos de subconjuntos.
- Para obter o k-ésimo XOR em ordem crescente, primeiro reduza a base para uma forma canônica e defina a ordenação dos bits.
- Usa os 64 bits de `unsigned long long`; adapte B e o tipo para domínios menores.
