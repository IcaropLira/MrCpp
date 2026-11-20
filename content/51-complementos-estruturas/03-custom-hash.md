---
title: Hash seguro para unordered_map
summary: splitmix64 com semente aleatória contra testes anti-hash; reserve e max_load_factor.
status: done
complexity: O(1) esperado
tags: unordered_map, hash, anti-hash, splitmix64
---

```cpp
// Hash seguro para unordered_map (anti-hack): splitmix64 + semente aleatória.
// Sem isso, testes "anti-hash" deixam unordered_map O(n) por operação (TLE).
#include <bits/stdc++.h>
using namespace std;

struct custom_hash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15; x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb; return x ^ (x >> 31);
    }
    size_t operator()(uint64_t x) const {
        static const uint64_t SEED = chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + SEED);
    }
    size_t operator()(pair<int,int> p) const { return (*this)(((uint64_t)(uint32_t)p.first << 32) | (uint32_t)p.second); }
};

int main() {
    unordered_map<long long, int, custom_hash> cnt;
    cnt.reserve(1 << 20); cnt.max_load_factor(0.25);   // menos rehash
    int n; cin >> n;
    for (int i = 0; i < n; i++) { long long x; cin >> x; cnt[x]++; }
    int best = 0; for (auto &[k, v] : cnt) best = max(best, v);
    cout << cnt.size() << ' ' << best << '\n';
}
```

Exemplo testado — entrada:

```text
6
7 3 7 1000000000000 7 3
```

saída:

```text
3 3
```
