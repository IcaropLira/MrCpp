---
title: Par de pontos mais próximos
summary: Varredura com um set ordenado por y: cada ponto compara com poucos vizinhos.
status: done
complexity: O(n log n)
tags: sweep line, geometria, par mais próximo
---

## Ideia

Ordene por `x` e varra da esquerda para a direita, mantendo em um `set` (ordenado por `y`) os pontos cuja coordenada `x` está a menos de `d` do ponto atual, onde `d` é a melhor distância até agora. Para cada ponto, só importam os do conjunto com `y` em `[y - d, y + d]`, e há um número constante deles (no máximo 6 por empacotamento). Cada ponto entra e sai do conjunto uma vez.

## Código

```cpp
// pontos inteiros; devolve o menor quadrado de distância (0 se há pontos repetidos); n >= 2
ll par_mais_proximo(vector<pair<ll, ll>> p) {
    sort(p.begin(), p.end());
    set<pair<ll, ll>> s;  // (y, x)
    ll best = LLONG_MAX;
    int j = 0;
    for (int i = 0; i < (int)p.size(); i++) {
        ll d = best == LLONG_MAX ? LLONG_MAX : (ll)ceil(sqrt((double)best));
        while (j < i && (best == LLONG_MAX ? false : p[i].first - p[j].first >= d)) {
            s.erase({p[j].second, p[j].first});
            j++;
        }
        ll lo = best == LLONG_MAX ? LLONG_MIN : p[i].second - d;
        ll hi = best == LLONG_MAX ? LLONG_MAX : p[i].second + d;
        for (auto it = s.lower_bound({lo, LLONG_MIN}); it != s.end() && it->first <= hi; ++it) {
            ll dx = p[i].first - it->second, dy = p[i].second - it->first;
            best = min(best, dx * dx + dy * dy);
        }
        s.insert({p[i].second, p[i].first});
    }
    return best;
}
```

## Complexidade e cuidados

- Pontos repetidos funcionam: o segundo encontra o primeiro ainda no `set` (distância 0), e a inserção do par idêntico simplesmente não duplica.
- O código usa `ceil(sqrt(best))` como largura da janela: com coordenadas até `1e9` o quadrado cabe em `long long` (até `4e18`).
- Alternativa: divisão e conquista, também `O(n log n)`.
- Para a distância real, tire a raiz do resultado no final.
