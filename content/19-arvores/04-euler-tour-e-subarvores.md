---
title: Euler Tour e consultas em subárvores
summary: tin, tout, flattening, Fenwick, caminho raiz-vértice e LCA.
status: done
complexity: O(n) pré-processamento; O(log n) por consulta com BIT
tags: árvores, euler tour, tin, tout, fenwick, subtree queries
---

## A sacada: transformar uma subárvore em intervalo

Faça uma DFS e registre o tempo de entrada `tin[v]`. Ao entrar em `v`, coloque seu valor na próxima posição de um vetor linear `euler`. Ao terminar de visitar todos os descendentes, registre `tout[v]` como o último índice incluído na subárvore.

Com essa convenção **inclusiva**, todos os vértices da subárvore de `v` ficam exatamente no intervalo `[tin[v], tout[v]]`. Então uma consulta de subárvore vira uma consulta de intervalo normal.

## Código de flattening (índices 1-based)

```cpp
const int N = 2e5 + 5;
int n, timer, tin[N], tout[N], euler[N];
long long valor[N];
vector<int> adj[N];

void dfs(int v, int p = 0) {
    tin[v] = ++timer;
    euler[timer] = v;
    for (int u : adj[v]) {
        if (u == p) continue;
        dfs(u, v);
    }
    tout[v] = timer;
}
```

Observe que `timer` aumenta **só na entrada**. Por isso `tout[v] - tin[v] + 1` é o tamanho da subárvore. O vetor `euler[pos]` guarda qual vértice está naquela posição; para construir um vetor linear de valores, use `a[tin[v]] = valor[v]`.

## Soma de subárvore com Fenwick/BIT

Depois da DFS, insira cada valor na posição `tin[v]`:

```cpp
long long bit[N];
void add(int i, long long x) {
    for (; i <= n; i += i & -i) bit[i] += x;
}
long long sum(int i) {
    long long ans = 0;
    for (; i > 0; i -= i & -i) ans += bit[i];
    return ans;
}
long long query_subtree(int v) {
    return sum(tout[v]) - sum(tin[v] - 1);
}
```

Inicialização: `for (int v = 1; v <= n; v++) add(tin[v], valor[v]);`. Atualização do valor de um vértice `v`: calcule `delta = novo - valor[v]`, atualize `valor[v]` e faça `add(tin[v], delta)`. Cada atualização/consulta custa `O(log n)`.

## Contagem de nós / soma estática

Se os valores não mudam, use prefixos: `pref[tout[v]] - pref[tin[v]-1]`. Isso dá consulta `O(1)` depois de `O(n)` de preparação. Se houver atualizações pontuais e soma, BIT é natural. Para máximo/mínimo com atualizações, use segment tree; BIT comum não resolve todo tipo de operação.

## Convenção alternativa: intervalo semiaberto

Alguns códigos definem `tout[v]` como o primeiro índice **depois** da subárvore. Aí o intervalo é `[tin[v], tout[v])`, o tamanho é `tout[v]-tin[v]` e a soma é `sum(tout[v]-1)-sum(tin[v]-1)` se a BIT for 1-based. As duas convenções são corretas; misturá-las causa erros de uma posição. Neste material, o código acima usa `tout` inclusivo.

## Consultas de caminho com Euler Tour

A ordem de entrada sozinha transforma subárvores em intervalos, mas **não** transforma todo caminho `u-v` em um único intervalo. Para caminhos, use LCA, Heavy-Light Decomposition, ou uma técnica de diferença apropriada.

Para soma de raiz até `v`, uma técnica comum usa uma DFS com soma acumulada: `raiz[v] = raiz[pai[v]] + valor[v]`. Para soma de caminho `u-v`, com `w = LCA(u,v)`, a soma dos vértices é `raiz[u] + raiz[v] - 2*raiz[w] + valor[w]`.

Outra aplicação é marcar a entrada e saída de cada vértice em um Euler Tour de **2n eventos**. Isso é útil para detectar ancestralidade (`tin[u] <= tin[v] && tout[v] <= tout[u]` em convenção de saída temporal), construir LCA com RMQ ou processar eventos de entrada/saída. Não misture esse tour de 2n eventos com o flattening de n vértices usado pela BIT.

## Aplicações

- Soma/quantidade/máximo de uma subárvore com estrutura adequada.
- Atualização de valor de um vértice e consulta agregada da subárvore.
- Subárvore como intervalo para Mo em árvores ou segment tree.
- Verificar se `u` é ancestral de `v` usando tempos de entrada/saída.
- DP em árvore em que cada subárvore é processada como bloco contíguo.
- Atualizações de caminho raiz-vértice por diferença em entrada/saída, conforme a operação.

## Erros comuns

1. Construir a BIT no índice do vértice em vez de `tin[v]`.
2. Atualizar `tin[v]`, mas consultar `[tin[v], tin[v]+tam[v]-1]` sem ter calculado corretamente o tamanho.
3. Misturar `tout` inclusivo e semiaberto.
4. Achar que qualquer caminho entre dois nós é um intervalo no flattening.
5. Esquecer que a BIT é indexada a partir de 1 no template acima.
6. Usar `int` para somas que podem ultrapassar 2 bilhões.
