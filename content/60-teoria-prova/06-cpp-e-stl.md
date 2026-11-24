---
title: C++ e STL — referência rápida
summary: Complexidade de cada contêiner, armadilhas da STL, comparadores, I/O, __int128, pb_ds, built-ins de bits.
status: done
complexity: —
tags: c++, stl, contêineres, complexidade, comparadores, io, teoria
---

## Contêineres

| Contêiner | Inserir/remover | Busca | Observação |
|---|---|---|---|
| `vector` | fim O(1) amort.; meio O(n) | O(n) / `lower_bound` O(log n) se ordenado | `reserve`; `v.erase(unique(...))` |
| `deque` | pontas O(1) | índice O(1) | memória maior que vector |
| `set` / `map` | O(log n) | O(log n) | ordenado; `lower_bound` **membro** (`s.lower_bound(x)`, não `std::lower_bound` → O(n)) |
| `multiset` | O(log n) | O(log n) | `erase(x)` apaga **todos**; para um: `erase(find(x))` |
| `unordered_map` | O(1) esperado | O(1) esperado | anti-hash: hash customizado |
| `priority_queue` | O(log n) | topo O(1) | é **máximo**; mínimo: `greater<>` |
| `bitset<N>` | — | — | operações /64; `count()`, `_Find_first()`, `_Find_next(i)` |
| `ordered_set` (pb_ds) | O(log n) | k-ésimo, rank O(log n) | ver Complementos |

## Armadilhas

- `map[x]` **cria** a chave se não existir (use `find`/`count` para só consultar).
- Iterar e apagar: `it = s.erase(it)`.
- `v.size()` é sem sinal: `v.size() - 1` com vetor vazio = enorme. Use `(int)v.size()`.
- `abs` de `long long`: `llabs` ou `abs` com `<cstdlib>`/`<cmath>` correto; `pow` é double (use exponenciação inteira); `sqrt` de long long: corrija ±1.
- `1 << 40` estoura: use `1LL << 40`.
- Comparador de `sort` precisa ser **estrito** (`<`, nunca `<=`): senão RE/loop.
- `endl` faz flush (lento); use `'\n'` (exceto em problema **interativo**: aí dê flush).
- Variáveis globais começam zeradas; locais não.
- `memset` só para 0, −1 ou `0x3f` (≈ 1e9, soma de dois não estoura `int`).

## Ordenação e comparadores

```cpp
sort(v.begin(), v.end(), [](const auto &a, const auto &b) { return a.x != b.x ? a.x < b.x : a.y > b.y; });
// pares e tuplas já comparam lexicograficamente; stable_sort mantém empates
```

## I/O

- `ios::sync_with_stdio(false); cin.tie(nullptr);`
- Ler até EOF: `while (cin >> x)`. Linha inteira: `getline(cin, s)` (cuidado com o `\n` deixado pelo `>>`: use `cin >> ws`).
- Precisão: `cout << fixed << setprecision(9)`.
- `__int128`: sem `cin/cout` — converta para string manualmente.

## Utilidades

`iota`, `accumulate` (cuidado: tipo do valor inicial `0LL`), `partial_sum`, `nth_element` (O(n)), `next_permutation` (gera em ordem lexicográfica; ordene antes), `__gcd`/`gcd`, `lcm`, `minmax_element`, `count`, `reverse`, `rotate`, `binary_search`.
