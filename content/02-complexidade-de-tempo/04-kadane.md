---
title: Subarray de soma máxima (Kadane)
summary: Maior soma de subarray.
status: done
complexity: O(n)
tags: kadane, dp
---

## Ideia

Em cada posição, ou continua o subarray anterior ou recomeça.

## Código

```cpp
ll kadane(const vector<ll>& a) {
    ll best = a[0], cur = 0;
    for (ll x : a) cur = max(x, cur + x), best = max(best, cur);
    return best;
}
```
