---
title: Checklist e pegadinhas
summary: Erros clássicos de contest (overflow, módulo negativo, multiteste, recursão, arestas paralelas, float) e checklist antes de submeter.
status: done
complexity: —
tags: pegadinhas, checklist, debug, wa, teoria
---

## Antes de submeter

- [ ] Li a saída exata (maiúsculas, "YES"/"Yes", espaço/linha no fim, linha em branco entre casos — ex.: QTREE2 imprime linha em branco após cada caso).
- [ ] Testei o exemplo **e** casos de borda: `n = 1`, tudo igual, tudo distinto, árvore em linha, árvore estrela, grafo desconexo, valores máximos.
- [ ] `long long` onde soma/produto pode passar de 2·10⁹.
- [ ] Multiteste: limpei **tudo** (vetores, contadores, trie, `timer`, globais).
- [ ] Índices: 0- ou 1-indexado? BIT é 1-indexada. Intervalo fechado `[l, r]` ou meio aberto `[l, r)`?
- [ ] Recursão profunda? Troque por pilha explícita.
- [ ] `ios::sync_with_stdio(false); cin.tie(nullptr);` e `'\n'` em vez de `endl`.

## Pegadinhas que aparecem nas aulas

| Situação | Erro comum | Correção |
|---|---|---|
| Módulo de diferença (prefixo, hash) | `(a - b) % MOD` fica negativo em C++ | `((a - b) % MOD + MOD) % MOD` |
| Contagem que explode (sapo, caminhos) | resposta sem módulo estoura | aplicar `% MOD` a cada passo |
| Pontes com `to == pai` | **arestas paralelas**: a cópia da aresta do pai seria ignorada e uma não-ponte vira ponte | pular pela **id da aresta**, não pelo vértice |
| DFS recursiva com n = 2·10⁵ | stack overflow numa linha | DFS iterativa / ordem BFS invertida |
| Lazy | esquecer `push` antes de descer, ou na query | `push` no começo de update e query (ou antes de descer) |
| Lazy de atribuição | usar 0 como "sem pendência" quando 0 é valor válido | flag separada |
| Segtree | vetor `2n` com implementação recursiva | `4n` |
| Ordem topológica pedindo a menor lexicográfica (SPOJ TOPOSORT) | fila comum | `priority_queue` mínima |
| DP em DAG | processar em ordem qualquer | ordem topológica (ou memo) |
| Rerooting | usar a resposta da raiz original em vez da do pai | `ans[filho] = ans[pai] + n - 2·sub[filho]` |
| Euler tour | misturar convenções de `tout` | `tout[v]` = último `tin` da subárvore (intervalo `[tin, tout]`) **ou** carimbo de saída com 2n tempos — escolha uma |
| Hash | base fixa pequena, um único módulo | 2 módulos ~10⁹ (ou 2⁶¹−1) e base aleatória |
| Trie | alocar `N` fixo enorme com 26 filhos por nó | alocar sob demanda; nós ≤ Σ|s| + 1 |
| Geometria | comparar `double` com `==` | inteiros (`dist²`, `orient`); se preciso, `eps ≈ 1e-9` |
| Fecho convexo | `<= 0` vs `< 0` no while | `<= 0` descarta colineares; `< 0` mantém (cuidado com todos colineares) |
| Ponto em polígono | ray casting com ponto na borda | testar a borda antes |
| Polígono horário | testes assumem anti-horário | `reverse` ou checar o sinal de `area2` |
| Compressão de coordenadas | esquecer `unique`/`erase` | `sort`, `erase(unique(...))`, `lower_bound` |
| Small to large | trocar só o contêiner e esquecer agregados (mx, sm) | trocar o "pacote" inteiro |
| BIT de máximo | usar para valores que **diminuem** | BIT de máximo só aceita "aumentar"; senão segtree |

## Quando dá WA sem motivo

1. Gere casos pequenos aleatórios e compare com um **brute force** (é assim que se acha pegadinha de borda).
2. Imprima o estado intermediário (dp, tin/low, segtree) no exemplo à mão.
3. Releia o enunciado procurando: "distintos", "pode haver arestas repetidas", "grafo pode ser desconexo", "mod 10⁹+7", "1 ≤ k" vs "0 ≤ k".

## Quando dá TLE

- `endl` / sem `sync_with_stdio`. `map` onde `vector` serve. `set` desnecessário.
- `memset`/`assign` de tamanho fixo em cada teste.
- Passar `vector` por valor em função recursiva (use `&`).
- `unordered_map` hackeado (anti-hash): use `map` ou hash com semente aleatória.
