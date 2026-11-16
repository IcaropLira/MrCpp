---
title: Rolling Hash
summary: Compara substrings em tempo constante após pré-processamento probabilístico.
status: done
complexity: O(n) pré-processamento e O(1) por consulta
tags: strings, hash, rolling hash
---

## Quando usar

Comparar substrings rapidamente, detectar repetições e buscar padrões quando uma solução determinística linear não é necessária ou quando o hash é usado como filtro.

## Código — hash duplo

~~~cpp
struct Hash {
    static const long long M1 = 1000000007;
    static const long long M2 = 1000000009;
    static const long long BASE = 911382323;

    vector<long long> h1, h2, p1, p2;

    Hash(const string& s) {
        int n = s.size();
        h1.assign(n+1, 0); h2.assign(n+1, 0);
        p1.assign(n+1, 1); p2.assign(n+1, 1);

        for (int i = 0; i < n; i++) {
            int x = (unsigned char)s[i] + 1;
            h1[i+1] = (h1[i] * BASE + x) % M1;
            h2[i+1] = (h2[i] * BASE + x) % M2;
            p1[i+1] = p1[i] * BASE % M1;
            p2[i+1] = p2[i] * BASE % M2;
        }
    }

    pair<long long,long long> get(int l, int r) const { // [l,r)
        long long a = (h1[r] - h1[l] * p1[r-l] % M1 + M1) % M1;
        long long b = (h2[r] - h2[l] * p2[r-l] % M2 + M2) % M2;
        return {a, b};
    }
};
~~~

## Cuidados

- As consultas usam intervalo semiaberto [l,r).
- Hash igual não prova igualdade: colisões são possíveis. Dois módulos reduzem muito a probabilidade, mas não tornam o método determinístico.
- BASE é fixa neste snippet; em ambientes adversariais, escolha uma base aleatória em tempo de execução e mantenha-a igual para todos os hashes comparados.
- Para comparar substrings de comprimentos diferentes, inclua também o comprimento ou normalize as posições.
- O produto máximo fica abaixo de 64 bits para os módulos usados.
