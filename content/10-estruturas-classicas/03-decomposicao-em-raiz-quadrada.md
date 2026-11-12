---
title: Decomposição em raiz quadrada
summary: Divide o vetor em blocos de tamanho aproximado √n para equilibrar trabalho local e agregado por bloco.
status: done
complexity: O(n) construção; O(√n) por consulta/atualização de intervalo
tags: sqrt decomposition, blocos, consultas, Mo
---

## Ideia

Divida o vetor em blocos de tamanho B ≈ √n. Em uma consulta [l,r], processe diretamente as pontas parciais e use o agregado pré-calculado para cada bloco inteiro.

A técnica é útil quando uma Segment Tree é excessiva, quando o agregado é simples ou quando o problema pede uma solução offline/por blocos.

## Soma: atualização pontual e consulta de intervalo

Intervalos inclusivos e índices 0-based.

```cpp
struct SqrtSum {
    int n, B;
    vector<long long> a, sum;

    SqrtSum(const vector<long long>& v) {
        a = v;
        n = a.size();
        B = max(1, (int)sqrt(n));
        sum.assign((n+B-1)/B, 0);
        for (int i = 0; i < n; i++) sum[i/B] += a[i];
    }

    void setval(int p, long long v) {
        sum[p/B] += v - a[p];
        a[p] = v;
    }

    long long query(int l, int r) const {
        long long ans = 0;
        while (l <= r && l % B) ans += a[l++];
        while (l + B - 1 <= r) {
            ans += sum[l/B];
            l += B;
        }
        while (l <= r) ans += a[l++];
        return ans;
    }
};
```

- Construção: O(n).
- Atualização pontual: O(1).
- Consulta de intervalo: O(√n).
- Memória: O(n).

## Range add + range sum com lazy por bloco

Guarde a soma dos valores-base de cada bloco e uma tag lazy aplicada a todos os elementos do bloco. Em uma consulta parcial, some os valores-base mais a tag; em um bloco inteiro, use somaBase + lazy × comprimento.

- Atualização de intervalo: O(√n).
- Consulta de intervalo: O(√n).
- Atualização/consulta de bloco inteiro: O(1).

\`\`\`cpp
struct SqrtRange {
    using ll = long long;
    int n, B;
    vector<ll> a, sum, lazy;

    SqrtRange(const vector<ll>& v) {
        a = v;
        n = a.size();
        B = max(1, (int)sqrt(n));
        int blocks = (n+B-1)/B;
        sum.assign(blocks,0);
        lazy.assign(blocks,0);
        for (int i = 0; i < n; i++) sum[i/B] += a[i];
    }

    int len(int b) const {
        return min(B,n-b*B);
    }

    void add(int l, int r, ll v) {
        int bl = l/B, br = r/B;
        if (bl == br) {
            for (int i = l; i <= r; i++) a[i] += v;
            sum[bl] += v*(r-l+1);
            return;
        }
        int rightL = (bl+1)*B;
        for (int i = l; i < rightL; i++) a[i] += v;
        sum[bl] += v*(rightL-l);

        for (int b = bl+1; b < br; b++) lazy[b] += v;

        int leftR = br*B;
        for (int i = leftR; i <= r; i++) a[i] += v;
        sum[br] += v*(r-leftR+1);
    }

    ll query(int l, int r) const {
        ll ans = 0;
        while (l <= r && l%B) ans += a[l] + lazy[l/B], l++;
        while (l+B-1 <= r) {
            int b = l/B;
            ans += sum[b] + lazy[b]*len(b);
            l += B;
        }
        while (l <= r) ans += a[l] + lazy[l/B], l++;
        return ans;
    }
};
\`\`\`

## Escolha do tamanho do bloco

B = √n é uma escolha padrão quando o custo de percorrer pontas e blocos é simétrico. Em problemas com q consultas, pode ser melhor ajustar B em função de n e q. A complexidade deve contar separadamente o trabalho nas pontas e nos blocos inteiros.

## Variações

- **Mo:** ordena consultas em blocos para reduzir o movimento das extremidades; exige todas as consultas offline.
- **Blocos com lazy:** aplica atualizações uniformes a blocos inteiros e processa pontas individualmente.
- **Agregados:** soma, mínimo, máximo, frequência ou outra informação que possa ser mantida por bloco.
- **Ordenação por blocos:** mantém cada bloco ordenado para responder contagens por valor; atualização pode exigir reordenar um bloco.

## Cuidados

1. O código pressupõe 0 <= l <= r < n e n > 0.
2. O tamanho B afeta constantes e memória; não assuma que √n é sempre ótimo.
3. Para operações associativas e atualizações online, Fenwick/Segment Tree pode ser mais simples e rápida.
4. Não confunda decomposição em blocos com o algoritmo de Mo: Mo é uma ordenação específica das consultas.
