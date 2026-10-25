---
title: Merge sort
summary: Ordenação estável por divisão e conquista.
status: done
complexity: O(n log n)
tags: ordenação
---

## Ideia

Ordena as duas metades e junta com `inplace_merge`.

## Código

```cpp
void msort(vector<int>& a, int l, int r) { // [l, r)
    if (r - l < 2) return;
    int m = (l + r) / 2;
    msort(a, l, m), msort(a, m, r);
    inplace_merge(a.begin() + l, a.begin() + m, a.begin() + r);
}
```
