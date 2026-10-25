---
title: Dois ponteiros
summary: Menor subarray com soma pelo menos S.
status: done
complexity: O(n)
tags: dois ponteiros
---

## Ideia

Para valores positivos, avançar a ponta direita só aumenta a soma, então o ponteiro esquerdo nunca volta.

## Código

```cpp
int shortest(const vector<int>& a, ll S) {
    int best = INT_MAX; ll sum = 0;
    for (int l = 0, r = 0; r < (int)a.size(); r++) {
        sum += a[r];
        while (sum - a[l] >= S) sum -= a[l++];
        if (sum >= S) best = min(best, r - l + 1);
    }
    return best;
}
```
