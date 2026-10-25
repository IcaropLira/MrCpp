---
title: Crivo de Eratóstenes
summary: Menor fator primo de todos os números até n.
status: done
complexity: O(n log log n)
tags: primos, crivo, fatoração
---

## Ideia

Para cada primo `i`, marca seus múltiplos que ainda não têm fator. Guardar o menor fator primo permite fatorar qualquer número em `O(log n)`.

## Código

```cpp
vector<int> sieve(int n) { // spf[i] == i  <=>  i é primo
    vector<int> spf(n + 1);
    for (int i = 2; i <= n; i++) if (!spf[i])
        for (int j = i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    return spf;
}
```

## Uso

Fatorar `x`: `while (x > 1) { fatores.push_back(spf[x]); x /= spf[x]; }`
