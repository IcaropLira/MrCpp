---
title: Maior subsequência crescente (LIS)
summary: LIS O(n²), O(n log n), reconstrução, não decrescente, contagem e aplicações.
status: done
complexity: O(n log n)
tags: dp, lis, busca binária, subsequência
---

## O problema

Dado `a`, queremos a maior subsequência crescente. **Subsequência não precisa ser contígua**: podemos pular posições, mas a ordem original não muda. Exemplo: em `[3, 1, 2, 5, 4]`, uma LIS é `[1, 2, 4]`, tamanho `3`.

- **Estritamente crescente:** `a[i1] < a[i2] < ...`.
- **Não decrescente:** `a[i1] <= a[i2] <= ...`.
- Não confunda com subarray: subarray exige posições consecutivas.

## 1. DP O(n²): a versão que explica a ideia

`dp[i]` = tamanho da LIS que **termina exatamente** na posição `i`. Para terminar em `i`, o elemento anterior `j` precisa satisfazer `j < i` e `a[j] < a[i]`.

```cpp
int lis(vector<int>& a) {
    int n = a.size(), ans = 0;
    vector<int> dp(n, 1);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1);
        }
        ans = max(ans, dp[i]);
    }
    return ans;
}
```

Inicialização `1`: cada elemento sozinho forma uma subsequência de tamanho 1. Resposta `max(dp[i])`, não necessariamente `dp[n-1]`. Complexidade `O(n²)` tempo e `O(n)` memória. Serve para `n` pequeno e para entender transições.

## 2. O(n log n): menor final possível

Mantenha `fim[k]` = menor valor final entre subsequências crescentes de tamanho `k+1` encontradas até agora. Para cada `x`, substituímos o primeiro `fim[k] >= x` (`lower_bound`) por `x`; se não existir, estendemos a LIS.

```cpp
int lis(vector<int>& a) {
    vector<int> fim;
    for (int x : a) {
        auto it = lower_bound(fim.begin(), fim.end(), x);
        if (it == fim.end()) fim.push_back(x);
        else *it = x;
    }
    return (int)fim.size();
}
```

**Pegadinha:** `fim` não é necessariamente uma subsequência real da entrada; é um resumo dos melhores finais. Seu tamanho, porém, é a resposta.

- Estritamente crescente: `lower_bound` (primeiro `>= x`).
- Não decrescente: `upper_bound` (primeiro `> x`).
- `O(n log n)` tempo, `O(n)` memória.

## 3. Reconstruir uma LIS de verdade

Guardamos `pos[k]` = índice da entrada que atualmente representa `fim[k]` e `ant[i]` = predecessor de `i` na sequência escolhida. Ao substituir a posição `k`, o predecessor de `i` será o representante da camada anterior.

```cpp
vector<int> reconstruir_lis(vector<int>& a) {
    int n = a.size();
    vector<int> fim, pos, ant(n, -1);
    for (int i = 0; i < n; i++) {
        int k = lower_bound(fim.begin(), fim.end(), a[i]) - fim.begin();
        if (k > 0) ant[i] = pos[k - 1];
        if (k == (int)fim.size()) {
            fim.push_back(a[i]);
            pos.push_back(i);
        } else {
            fim[k] = a[i];
            pos[k] = i;
        }
    }
    vector<int> ans;
    if (pos.empty()) return ans;
    int u = pos.back();
    while (u != -1) {
        ans.push_back(a[u]);
        u = ant[u];
    }
    reverse(ans.begin(), ans.end());
    return ans;
}
```

O vetor `ant` preserva a história de cada índice mesmo quando `pos` muda depois. Para obter os **índices** em vez dos valores, guarde `u` em `ans` durante a reconstrução.

## 4. LIS com segment tree: DP por valor

Essa é outra formulação, muito útil quando a transição depende do **valor anterior** e queremos consultas por faixa. Com coordenadas comprimidas, defina `dp[i] = 1 + maior LIS terminando em valor menor que a[i]`:

`dp[i] = 1 + max(dp[j])` para `j < i` e `a[j] < a[i]`.

A segtree indexa valores, não posições da sequência. Em cada valor, guardamos o maior `dp` já visto. Para cada `a[i]`, consultamos valores menores e atualizamos a posição do valor atual.

```cpp
const int N = 2e5 + 5;
int seg[4 * N];

int query(int no, int l, int r, int ql, int qr) {
    if (qr < l || r < ql) return 0;
    if (ql <= l && r <= qr) return seg[no];
    int m = (l + r) / 2;
    return max(query(no * 2, l, m, ql, qr),
               query(no * 2 + 1, m + 1, r, ql, qr));
}

void update(int no, int l, int r, int p, int v) {
    if (l == r) {
        seg[no] = max(seg[no], v);
        return;
    }
    int m = (l + r) / 2;
    if (p <= m) update(no * 2, l, m, p, v);
    else update(no * 2 + 1, m + 1, r, p, v);
    seg[no] = max(seg[no * 2], seg[no * 2 + 1]);
}

int lis_segtree(vector<int> a) {
    vector<int> vals = a;
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    int m = vals.size(), ans = 0;
    fill(seg, seg + 4 * (m + 2), 0);
    for (int x : a) {
        int p = lower_bound(vals.begin(), vals.end(), x) - vals.begin() + 1;
        int best = query(1, 1, m, 1, p - 1);
        int cur = best + 1;
        update(1, 1, m, p, cur);
        ans = max(ans, cur);
    }
    return ans;
}
```

Aqui a árvore tem domínio `[1,m]` das coordenadas comprimidas. A consulta `1..p-1` exclui valores iguais, portanto calcula LIS estrita. Para não decrescente, consulte `1..p`. Atualizar com `max` é importante: vários elementos podem ter o mesmo valor e não devemos apagar um estado melhor. Cada operação custa `O(log n)`; total `O(n log n)`.

### Quando escolher cada versão?

- Só o tamanho da LIS: `lower_bound` é menor e mais simples.
- Reconstruir uma sequência: `pos + ant`.
- Transição com intervalo de valores (`a[i]-k <= a[j] < a[i]`), pesos ou estados agregados: segtree/Fenwick por valor.
- Consultar muitas versões ou combinar estados mais complexos: segtree pode ser mais flexível, mas exige definir corretamente a operação e a identidade.

## 5. Contar quantas LIS existem

Em cada valor comprimido, guarde um par `(melhor_tamanho, quantidade)`. Ao combinar dois pares, fique com o tamanho maior; se empatar, some as quantidades (modularmente, se necessário). A consulta de valores menores retorna o melhor tamanho e quantas maneiras o atingem. Se não houver nenhum, o estado anterior é `(0,1)` para que o primeiro elemento gere uma sequência de tamanho 1 com uma maneira.

Cuidado: contar subsequências por **índice** pode contar valores iguais em posições diferentes como escolhas distintas. Defina o que o enunciado considera uma sequência diferente.

## Aplicações clássicas

- Menor número de remoções para deixar crescente: `n - LIS`.
- Menor número de elementos a inserir para alcançar tamanho `k`: depende do modelo; para apenas completar uma sequência crescente de tamanho `k`, faltam `k-LIS` posições.
- **Envelope nesting / Russian doll:** ordene uma dimensão crescente e a outra decrescente em empates, depois aplique LIS estrita na segunda dimensão; ordenar a segunda dimensão decrescente evita usar duas caixas de mesma primeira dimensão.
- **Maior subconjunto de pontos em ordem:** ordene uma coordenada e aplique LIS na outra, tratando empates com cuidado.
- **LCS via LIS:** quando os elementos são distintos (ou quando há tratamento apropriado de duplicatas), transforme as posições de uma permutação na outra em uma sequência e calcule LIS.
- Sequências de eventos, escalonamento e reconstrução de ordem compatível.

## Erros que dão WA

1. Usar `upper_bound` para LIS estrita: duplicatas passam a aumentar a resposta.
2. Retornar `dp[n-1]` na DP quadrática.
3. Usar `a[i]` como índice da segtree sem compressão (valores negativos ou enormes quebram o domínio).
4. Consultar até `p` na versão estrita: isso permite usar o próprio valor como predecessor.
5. Sobrescrever o máximo de um valor em vez de manter `max`.
6. Confundir subsequência com subarray.
