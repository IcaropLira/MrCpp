---
title: Centroid Decomposition
summary: Decompõe uma árvore em componentes balanceadas para consultas globais de distância.
status: done
complexity: O(n log n) construção; O(log n) por atualização/consulta no exemplo
tags: árvores, centroid decomposition, distância
---

## Ideia

Um centróide é um vértice cuja remoção deixa componentes com no máximo n/2 vértices. Escolha-o como raiz da decomposição, remova-o logicamente e repita em cada componente restante.

A cada nível, o tamanho da componente cai pelo menos pela metade; portanto, a árvore de centróides tem altura O(log n). Para cada vértice v, guardamos os centróides ancestrais e a distância até eles.

## Exemplo: marcar vértices vermelhos e consultar o vermelho mais próximo

Árvore não ponderada. anc[v] contém pares (centróide, distância).

```cpp
const int INF = 1e9;
vector<vector<int>> g;
vector<int> sz;
vector<bool> removed;
vector<vector<pair<int,int>>> anc;
vector<int> best;

int calc_size(int v, int p) {
    sz[v] = 1;
    for (int u : g[v])
        if (u != p && !removed[u]) sz[v] += calc_size(u,v);
    return sz[v];
}

int find_centroid(int v, int p, int total) {
    for (int u : g[v])
        if (u != p && !removed[u] && sz[u] > total/2)
            return find_centroid(u,v,total);
    return v;
}

void collect(int v, int p, int c, int d) {
    anc[v].push_back({c,d});
    for (int u : g[v])
        if (u != p && !removed[u]) collect(u,v,c,d+1);
}

void decompose(int entry) {
    int total = calc_size(entry,-1);
    int c = find_centroid(entry,-1,total);
    collect(c,-1,c,0);
    removed[c] = true;
    for (int u : g[c])
        if (!removed[u]) decompose(u);
}

void activate(int v) {
    for (auto [c,d] : anc[v]) best[c] = min(best[c],d);
}

int nearest(int v) {
    int ans = INF;
    for (auto [c,d] : anc[v])
        ans = min(ans,best[c]+d);
    return ans; // INF se nenhum vértice foi ativado
}
```

Inicialize sz(n), removed(n,false), anc(n), best(n,INF) e chame decompose(0). Marque um vértice inicial com activate(v).

## Por que a consulta funciona?

Para qualquer vértice vermelho x, existe um centróide c comum nas cadeias de ancestrais de v e x no qual o caminho entre eles passa por c. Então dist(v,c)+dist(x,c) é a distância real nesse caso. Para outros centróides, essa soma não pode ser menor que a distância real; tomar o mínimo não subestima a resposta.

## Complexidade

- Construção e preenchimento de anc: O(n log n) tempo e memória.
- activate(v) e nearest(v): O(log n).
- A implementação apresentada pressupõe árvore não ponderada; para pesos, acumule distância long long no collect.

## Cuidados

- removed[c] remove o centróide apenas da componente atual; não apague arestas fisicamente.
- A recursão de coleta e cálculo pode atingir profundidade O(n) em uma cadeia; considere versões iterativas para limites grandes.
- Para contar pares ou distância mínima entre pares, a decomposição é a mesma, mas o estado mantido em cada centróide muda.
- nearest retorna INF se nenhum vértice foi ativado.
