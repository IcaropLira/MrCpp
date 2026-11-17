---
title: Algoritmos randomizados
summary: Quickselect, embaralhamento de Fisher-Yates e o teste de Freivalds para produto de matrizes.
status: done
complexity: O(n) esperado; O(k n²) para Freivalds
tags: probabilidade, randomização, quickselect, freivalds
---

## Ideia

Aleatoriedade evita entradas adversariais e simplifica algoritmos. *Quickselect* acha o `k`-ésimo menor em `O(n)` esperado escolhendo o pivô ao acaso. *Fisher-Yates* gera uma permutação uniforme em `O(n)`. *Freivalds* confere se `A · B = C` em `O(n²)` por rodada: multiplica ambos os lados por um vetor aleatório `r` de 0/1 e compara; se `AB ≠ C`, cada rodada falha em detectar com probabilidade no máximo `1/2`.

## Código

```cpp
mt19937_64 rng(712367);

// k-ésimo menor (k de 0 a n-1), O(n) esperado
int quickselect(vector<int> a, int k) {
    int lo = 0, hi = a.size() - 1;
    while (true) {
        if (lo == hi) return a[lo];
        int pivo = a[lo + rng() % (hi - lo + 1)];
        int i = lo, lt = lo, gt = hi;  // partição em três: < pivo | == pivo | > pivo
        while (i <= gt) {
            if (a[i] < pivo) swap(a[i++], a[lt++]);
            else if (a[i] > pivo) swap(a[i], a[gt--]);
            else i++;
        }
        if (k < lt) hi = lt - 1;
        else if (k > gt) lo = gt + 1;
        else return pivo;
    }
}

// embaralhamento uniforme
void embaralha(vector<int>& v) {
    for (int i = (int)v.size() - 1; i > 0; i--) swap(v[i], v[rng() % (i + 1)]);
}

// A, B, C matrizes n x n; devolve false se encontrou prova de que A*B != C
bool freivalds(const vector<vector<ll>>& A, const vector<vector<ll>>& B, const vector<vector<ll>>& C, int rodadas = 30) {
    int n = A.size();
    for (int it = 0; it < rodadas; it++) {
        vector<ll> r(n), Br(n, 0), ABr(n, 0), Cr(n, 0);
        for (auto& x : r) x = rng() & 1;
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) Br[i] += B[i][j] * r[j];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) ABr[i] += A[i][j] * Br[j];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) Cr[i] += C[i][j] * r[j];
        if (ABr != Cr) return false;
    }
    return true;
}
```

## Complexidade e cuidados

- A partição em três evita o pior caso quando há muitos elementos iguais.
- Troque `rng() % (i + 1)` por uma distribuição uniforme exata (`uniform_int_distribution`) se o viés (ínfimo) importar.
- Use uma semente fixa em contests para reproduzir o erro e `chrono::steady_clock::now().time_since_epoch().count()` quando a entrada puder ser adversarial (hash hacking).
- Freivalds com `k` rodadas erra com probabilidade menor que `2^-k`; só falso positivo (aceitar um produto errado) é possível.
