---
title: Compressão de coordenadas
summary: Substitui valores grandes por posições compactas preservando ordem e igualdade.
status: done
complexity: O(n log n) para ordenar e O(log n) por mapeamento com busca binária
tags: compressão, ordenação, coordenadas, offline
---

## Ideia

Quando os valores podem chegar a 10^9 ou 10^18, mas existem apenas O(n) valores distintos usados, substitua cada valor pela sua posição em um vetor ordenado e sem duplicatas.

A compressão preserva:
- ordem: x < y se, e somente se, id(x) < id(y);
- igualdade: valores iguais recebem o mesmo id.

Ela **não preserva distâncias**: se x=10 e y=10^9, a diferença entre os ids não representa y-x.

## Implementação

Reúna todos os valores que serão indexados antes de responder às consultas. Inclua também limites de consultas se a estrutura precisar localizar esses limites.

```cpp
using ll = long long;

struct Compressor {
    vector<ll> xs;

    void add(ll x) { xs.push_back(x); }

    void build() {
        sort(xs.begin(), xs.end());
        xs.erase(unique(xs.begin(), xs.end()), xs.end());
    }

    int id(ll x) const {
        return lower_bound(xs.begin(), xs.end(), x) - xs.begin();
    }

    ll value(int p) const { return xs[p]; }

    int size() const { return xs.size(); }
};

// Compressor cp;
// for (ll x : a) cp.add(x);
// cp.build();
// int pos = cp.id(a[i]);
// ll original = cp.value(pos);
```

## Consultas por valor

Para contar quantos valores comprimidos pertencem ao intervalo numérico [L,R], use:
- l = lower_bound(xs.begin(), xs.end(), L) - xs.begin();
- r = upper_bound(xs.begin(), xs.end(), R) - xs.begin().

O intervalo de ids resultante é semiaberto [l,r). Não use id(R) como limite direito se R pode não existir no vetor.

## Complexidade

- Ordenação e remoção de duplicatas: O(n log n).
- Cada id(x) por busca binária: O(log n); acesso por índice em xs é O(1).
- Memória: O(n).
- Se os valores já estiverem ordenados e únicos, a compressão pode ser construída em O(n).

## Aplicações e cuidados

- Fenwick/Segment Tree sobre coordenadas esparsas.
- Segment Tree persistente de frequências para k-ésimo menor.
- Offline queries: comprima também valores que só aparecem nas consultas.
- Não substitui coordenadas reais em geometria quando diferenças, áreas ou distâncias importam.
- Para intervalos semiabertos e inclusivos, defina explicitamente se o limite final usa lower_bound ou upper_bound.
