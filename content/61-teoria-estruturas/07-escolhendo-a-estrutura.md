---
title: Escolhendo a estrutura de dados
summary: Tabela "operação pedida → estrutura" (DSU, sparse table, segtree e variações, treap, ordered_set, wavelet, persistente, sqrt, Mo, pilha/fila monotônica).
status: done
complexity: veja a tabela
tags: estruturas, escolha, segtree, treap, sqrt, mo, dsu, pilha monotônica, teoria
---

## Operação pedida → estrutura

| Operações | Estrutura | Custo |
|---|---|---|
| soma de intervalo, sem update | prefix sum | O(1) |
| min/max/gcd de intervalo, sem update | sparse table | O(1) |
| operação associativa qualquer, sem update | disjoint sparse table | O(1) |
| update pontual + soma/xor de intervalo | BIT | O(log n) |
| update pontual + op associativa | segtree | O(log n) |
| update em intervalo | lazy segtree (ou BIT de diferenças para soma) | O(log n) |
| "chmin/chmax em intervalo" + soma | segtree beats | O(log² n) amortizado |
| índices enormes/esparsos, online | segtree dinâmica (cria nós sob demanda) | O(log C) |
| versões antigas ("como estava no tempo t") | segtree persistente | O(log n) por versão |
| k-ésimo menor em intervalo | wavelet tree / persistente / merge sort tree | O(log n) / O(log² n) |
| quantos ≤ x em intervalo | merge sort tree / wavelet / BIT offline | O(log² n) / O(log n) |
| k-ésimo do conjunto dinâmico, rank | ordered_set (pb_ds) ou BIT por valor | O(log n) |
| inserir/remover no meio, reverter intervalo | treap implícita | O(log n) |
| união de conjuntos, componentes | DSU | O(α(n)) |
| desfazer uniões | DSU com rollback | O(log n) |
| min de janela deslizante | deque monotônica | O(1) amortizado |
| próximo menor/maior à esquerda/direita | pilha monotônica | O(n) total |
| min de fila com push/pop | min-queue (duas pilhas) | O(1) amortizado |
| mediana dinâmica | duas heaps | O(log n) |
| inserir retas, min em x | Li Chao / CHT | O(log C) |
| consultas offline de intervalo "distintos", modas | **Mo** (ordenar por bloco) | O((n + q) √n) |
| update pontual + consulta "estranha" | decomposição em √n blocos | O(√n) |
| xor máximo / base de xor | trie de bits / base linear | O(log C) |

## Pilha monotônica (vizinho menor)

Percorra da esquerda; enquanto o topo ≥ a[i], desempilhe; o topo (se existir) é o anterior menor. Cada índice entra/sai uma vez. Aplicações: maior retângulo no histograma, soma de mínimos de todos os subarrays (contribuição: `(i - L) · (R - i)`), "quantos prédios eu vejo".

## Mo

Ordene as consultas `[l, r]` por `(bloco de l, r)` (alternando o sentido de r nos blocos ímpares acelera); mova os ponteiros adicionando/removendo um elemento por vez. Precisa de `add`/`remove` em O(1). Com updates: Mo com tempo, O(n^(5/3)).

## Decomposição em raiz

Blocos de tamanho `B ≈ √n`; cada bloco guarda um resumo (e lazy). Consulta: blocos inteiros + pontas. Também: "√ heurística" — tratar separadamente elementos frequentes (> √n ocorrências: são poucos) e raros.

## Offline costuma ser mais fácil

Ordenar consultas por fim do intervalo e varrer (ex.: distintos em `[l, r]`: BIT com a última ocorrência de cada valor), ou ordenar por valor e inserir em ordem. Divisão e conquista no tempo / busca binária paralela para "qual o primeiro momento em que…".
