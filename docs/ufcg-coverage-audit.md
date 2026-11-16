# Auditoria de cobertura — UFCG / Competitive Programming

Referência: https://github.com/lucasbrenner/competitive-programming/tree/master/content

## Estado

Este documento registra o inventário inicial obtido do índice de código do repositório de referência. Ele não declara cobertura integral: cada item ainda precisa ser comparado com a ficha correspondente do MrCpp, conferindo código, interface, complexidade, limites e casos especiais.

- [x] Inventário inicial de caminhos de código coletado.
- [x] Pontes, Dinic, fluxo de custo mínimo e Small to Large adicionados nesta etapa.
- [ ] Conferir individualmente todos os itens abaixo contra o conteúdo do MrCpp.
- [ ] Portar o que estiver ausente, mantendo autoria/referências e adaptando para snippets autocontidos.
- [ ] Compilar e testar cada implementação portada.
- [x] Criar fichas de SCC, 2-SAT, caminho euleriano e Hopcroft-Karp (primeira revisão estática realizada).
- [ ] Registrar cobertura final por algoritmo e variante.

## Grafos

Fonte — UFCG:
- graph/dsu.cpp
- graph/lca.cpp
- graph/scc.cpp
- graph/hld.cpp
- graph/bridges.cpp
- graph/articulation_points.cpp
- graph/block_cut_tree.cpp
- graph/max_flow.cpp
- graph/mcmf.cpp
- graph/twosat.cpp
- graph/euler_path.cpp
- graph/undirected_eulerian_path.cpp
- graph/bipartite_matching.cpp
- graph/link_cut_tree.cpp
- graph/centroid_decomposition.cpp

MrCpp:
- Já existentes antes desta etapa: DSU, LCA, HLD, Centroid Decomposition, DFS/BFS, componentes, bipartido, ciclos, ordenação topológica e MST.
- Incluídos nesta etapa: pontes e pontos de articulação, Dinic, fluxo de custo mínimo, SCC (Kosaraju), 2-SAT, caminho euleriano, matching bipartido (Hopcroft-Karp), Small to Large e modelagem com vértices auxiliares.
- Pendentes de conferência/possível inclusão: Block-Cut Tree, Link-Cut Tree e variantes específicas do código-fonte.

## Estruturas de dados

Fonte — UFCG:
- data-structures/rmq.cpp
- data-structures/cht.cpp
- data-structures/bit.cpp
- data-structures/bit2d.cpp
- data-structures/xor_base.cpp
- data-structures/trie_bit.cpp
- data-structures/min_queue.cpp
- data-structures/bit_multi.cpp
- data-structures/linear_cht.cpp
- data-structures/generic_rmq.cpp (experimental)
- data-structures/generic_seg_tree.cpp (experimental)
- data-structures/seg_tree.cpp
- data-structures/seg_tree_lazy.cpp
- data-structures/seg_tree_lazy_add_set.cpp
- data-structures/seg_tree_beats.cpp
- data-structures/iterative_seg_tree.cpp
- data-structures/implicit_segtree.cpp
- data-structures/persistent_seg_tree.cpp
- data-structures/persistent_bit_trie.cpp
- data-structures/slope_trick.cpp
- data-structures/seg_tree_poly.cpp
- data-structures/persistent_lichao.cpp
- data-structures/implicit_treap.cpp

MrCpp já possui fichas para DSU, Treap, sqrt decomposition, Mo, HLD, Centroid Decomposition, Segment Tree (incluindo variantes), Fenwick 2D e Disjoint Sparse Table. A correspondência fina entre implementações UFCG e variantes MrCpp ainda precisa ser marcada uma a uma.

## Strings

Fonte — UFCG:
- string/kmp.cpp
- string/trie.cpp
- string/hash.cpp
- string/manacher.cpp
- string/z_function.cpp
- string/aho_corasick.cpp
- string/suffix_array.cpp
- string/suffix_automaton.cpp

Pendentes de conferência/possível inclusão: KMP, Trie, hashing, Manacher, Z, Aho-Corasick, Suffix Array e Suffix Automaton.

## Matemática

Fonte — UFCG:
- math/ntt.cpp
- math/crt.cpp
- math/nck.cpp
- math/fft.cpp
- math/FWHT.cpp
- math/fft2D.cpp
- math/gauss.cpp
- math/mobius.cpp
- math/ext_gcd.cpp
- math/gaussXor.cpp
- math/ceil_div.cpp
- math/floor_sum.cpp
- math/floor_div.cpp
- math/Lagrange.cpp
- math/simplex.cpp
- math/circular_fft.cpp
- math/linear_sieve.cpp
- math/discrete_log.cpp
- math/discrete_root.cpp
- math/diophantine.cpp
- math/pollardrho.cpp
- math/division_trick.cpp

## Geometria

Fonte — UFCG:
- geometry/point.cpp
- geometry/in_polygon.cpp
- geometry/convex_hull.cpp
- geometry/closest_pair.cpp
- geometry/sum_minkowski.cpp
- geometry/half_plane.cpp
- geometry/circle.cpp
- geometry/polygon.cpp
- geometry2/point.cpp
- geometry2/minkowski.cpp
- geometry2/angle_sort.cpp
- geometry2/half_plane_intersection.cpp
- geometry/Emerson.cpp

## Primitivas e utilitários

Fonte — UFCG:
- primitives/mint.cpp
- primitives/hash.cpp
- primitives/frac.cpp
- primitives/matrix.cpp
- primitives/function.cpp
- miscellaneous/dynamic_ds.cpp
- miscellaneous/hilbert_order.cpp
- miscellaneous/rotate_matrix.cpp
- contest/template.cpp
- contest/template_big.cpp

## Observações de portabilidade

A biblioteca de referência usa um template próprio e abreviações globais. O MrCpp deve preservar a ideia dos algoritmos, mas cada ficha publicada precisa explicitar dependências, tipos, indexação, limites e contratos. Não copiar snippets que dependam silenciosamente de macros, aliases ou constantes do template original.
