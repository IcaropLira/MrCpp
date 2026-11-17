---
title: Períodos e bordas de todos os prefixos
summary: Usa a função de prefixo para obter menor período, bordas, quantidade de bordas e ocorrências de cada prefixo.
status: done
complexity: O(n) pré-processamento; O(#bordas) para listar
tags: strings, função de prefixo, borda, período
---

## Ideia

Uma borda de `P` é um prefixo próprio que também é sufixo; `q` é período de `P` exatamente quando `|P| - q` é uma borda (ou `q = |P|`). A função de prefixo dá a maior borda de cada prefixo, e as demais vêm encadeando `k -> pi[k-1]`. Daí:

- menor período do prefixo de tamanho `i+1`: `i + 1 - pi[i]`;
- número de bordas: `nb[i] = nb[pi[i]-1] + 1` (0 se `pi[i] = 0`);
- ocorrências do prefixo de tamanho `k` em `s`: cada posição `i` termina uma ocorrência do prefixo `pi[i]` e de suas bordas; somando de trás para frente, `occ[pi[i]-1] += occ[i]`.

Se `n % per == 0` para `per = n - pi[n-1]`, a string é `n/per` repetições de seu período; senão não é potência de string menor.

## Código

~~~cpp
vector<int> prefix_function(const string& s) {
    int n = s.size();
    vector<int> pi(n, 0);
    for (int i = 1; i < n; i++) {
        int k = pi[i-1];
        while (k && s[i] != s[k]) k = pi[k-1];
        if (s[i] == s[k]) k++;
        pi[i] = k;
    }
    return pi;
}

struct PrefixInfo {
    vector<int> pi, per, nb, occ;
    // per[i]: menor período do prefixo de tamanho i+1
    // nb[i]: número de bordas (não vazias, próprias) desse prefixo
    // occ[i]: ocorrências do prefixo de tamanho i+1 em s inteira
    PrefixInfo(const string& s) {
        int n = s.size();
        pi = prefix_function(s);
        per.assign(n, 0); nb.assign(n, 0); occ.assign(n, 1);
        for (int i = 0; i < n; i++) {
            per[i] = i + 1 - pi[i];
            nb[i] = pi[i] ? nb[pi[i]-1] + 1 : 0;
        }
        for (int i = n - 1; i > 0; i--) if (pi[i]) occ[pi[i]-1] += occ[i];
    }
    // todos os períodos do prefixo de tamanho len, crescentes (o último é len)
    vector<int> periods(int len) const {
        vector<int> r;
        for (int k = pi[len-1]; k > 0; k = pi[k-1]) r.push_back(len - k);
        r.push_back(len);
        return r;
    }
    // todas as bordas não vazias e próprias do prefixo de tamanho len, decrescentes
    vector<int> borders(int len) const {
        vector<int> r;
        for (int k = pi[len-1]; k > 0; k = pi[k-1]) r.push_back(k);
        return r;
    }
};
~~~

## Complexidade e cuidados

- Alfabeto qualquer; indexação 0-based em `pi`, mas `len` em `periods` e `borders` é o tamanho (1..n).
- Bordas são não vazias e próprias; o período `len` (borda vazia) é incluído em `periods`.
- Menor período não implica que divide o tamanho; só divide quando `len % per == 0`.
- `occ` conta ocorrências sobrepostas do prefixo em `s` inteira (inclui a própria).
- Listar todas as bordas custa O(número delas), que pode ser O(n) (como em `aaaa...`).
