---
title: Listas de adjacência
summary: Representação esparsa de grafos; armazena apenas os vizinhos de cada vértice.
status: done
complexity: O(n + m) espaço e leitura; O(grau(v)) para percorrer vizinhos
tags: grafos, representação, listas de adjacência
---

## Ideia

`g[u]` guarda todos os vértices alcançados por uma aresta que sai de `u`. É a representação padrão para grafos esparsos: percorremos somente arestas existentes, sem varrer uma matriz de `n × n`.

## Não ponderado e não direcionado

```cpp
int n, m;
cin >> n >> m;
vector<vector<int>> g(n);

for (int i = 0; i < m; i++) {
    int u, v;
    cin >> u >> v;
    --u; --v;                 // entrada 1-based -> vetor 0-based
    g[u].push_back(v);
    g[v].push_back(u);        // remova esta linha se for direcionado
}
```

Percorrer todos os vizinhos de `u`:

```cpp
for (int v : g[u]) {
    // processa a aresta u -> v
}
```

## Grafo ponderado

Guarde `(vizinho, peso)` em cada lista. Use `long long` para pesos/acumulados quando os limites exigirem.

```cpp
using ll = long long;
vector<vector<pair<int, ll>>> g(n);

for (int i = 0; i < m; i++) {
    int u, v;
    ll w;
    cin >> u >> v >> w;
    --u; --v;
    g[u].push_back({v, w});
    g[v].push_back({u, w});   // grafo não direcionado
}
```

## Variações

- **Direcionado:** insira somente `g[u].push_back(v)`.
- **Não direcionado:** insira nos dois sentidos; cada aresta aparece duas vezes.
- **Ponderado:** use `vector<vector<pair<int,ll>>>`.
- **Arestas identificadas:** guarde `{vizinho, id}` quando precisar distinguir arestas paralelas, por exemplo em pontes.
- **Lista de arestas:** mantenha também `vector<tuple<int,int,ll>> edges` para Kruskal ou processamento global.

## Comparação rápida

| Representação | Espaço | Testar se existe u-v | Percorrer vizinhos de u |
|---|---:|---:|---:|
| Lista de adjacência | `O(n+m)` | `O(grau(u))` | `O(grau(u))` |
| Matriz | `O(n²)` | `O(1)` | `O(n)` |
| Lista de arestas | `O(m)` | `O(m)` | `O(m)` |

Para grafos esparsos (`m` próximo de `n`), prefira lista. Para grafos densos ou consultas constantes de existência de aresta, matriz pode ser adequada.

## Cuidados

- Em grafo não direcionado, cada aresta é armazenada duas vezes.
- Laços (`u = v`) e arestas paralelas podem existir; não os remova sem autorização do enunciado.
- Para detectar pontes em multigrafo, ignore a aresta pelo **id**, não apenas o vértice pai.
- Limpe as listas entre casos de teste ou recrie `g`.
- A DFS/BFS com lista de adjacência custa `O(n+m)` quando todos os vértices e arestas são percorridos.
