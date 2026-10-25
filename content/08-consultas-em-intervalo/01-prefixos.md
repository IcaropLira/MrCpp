---
title: Soma de prefixos
summary: Soma em intervalo com uma passada de pré-processamento.
status: done
complexity: O(n) + O(1)
tags: prefixos, consultas
---

## Ideia

`pre[i]` guarda a soma dos `i` primeiros elementos. A soma de `[l, r]` é `pre[r + 1] - pre[l]`.

## Código

```cpp
vector<ll> pre(n + 1);
for (int i = 0; i < n; i++) pre[i + 1] = pre[i] + a[i];
auto sum = [&](int l, int r) { return pre[r + 1] - pre[l]; }; // [l, r]
```

## Uso

Em duas dimensões: `pre[i][j] = a[i-1][j-1] + pre[i-1][j] + pre[i][j-1] - pre[i-1][j-1]`.
