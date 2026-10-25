# Mr. C++

Biblioteca de algoritmos para programação competitiva, em React + TypeScript (Vite). Todo o conteúdo é Markdown.

    npm install
    npm run dev
    npm run build

## Como editar

- `content/NN-secao/_section.md`: dados da seção (`title`, `part`, `summary`).
- `content/NN-secao/NN-topico.md`: um tópico. Frontmatter: `title`, `summary`, `status` (`done` ou `todo`), `complexity`, `tags`.
- O número no nome do arquivo define a ordem. A parte depois do número vira o endereço (`/secao/topico`).

## Adicionar uma seção ou tópico

1. Crie a pasta `content/31-minha-secao/` com um `_section.md`.
2. Crie `01-meu-topico.md` dentro dela.
3. Pronto: ela aparece na home, na busca e na navegação. Nenhum código muda.

## Estilo de código

O estilo está no tópico `content/01-introducao/01-template.md` e nos blocos de código dos tópicos. Para mudar, edite os `.md`.
# MrCpp


## Roteiro de revisão

O conteúdo é organizado por assunto e os tópicos usam Markdown com frontmatter. Para revisar de forma eficiente:

1. Comece pelos fundamentos e pela complexidade; depois pratique ordenação, busca e estruturas da STL.
2. Domine prefixos, Fenwick/BIT e segment tree antes de avançar para lazy, persistente e técnicas offline.
3. Em DP, estude primeiro a definição de estado e a transição; depois LIS, mochila, LCS e DP em árvores. Compare a LIS `O(n²)`, a versão `O(n log n)` e a formulação por segment tree.
4. Em árvores, aprenda DFS/BFS, pai/profundidade, `tin/tout`, Euler Tour, LCA e consultas de subárvore. A convenção de `tout` deve ser consistente em todo o código.
5. Em strings, pratique trie com alfabeto correto, frequência de prefixos e depois hashing/KMP/Z/Aho-Corasick.
6. Em grafos, separe bem grafos dirigidos/não dirigidos, pesos negativos/não negativos e problemas de conectividade/caminho mínimo.

### Convenções de código

- C++17, `bits/stdc++.h`, `using namespace std` e `ll` quando conveniente.
- Vértices normalmente `1..n` nas implementações de grafos; vetores de entrada frequentemente `0..n-1`. Confira cada tópico.
- As estruturas com `N` fixo precisam de um limite coerente com o enunciado. Se o domínio for grande ou desconhecido, prefira `vector`.
- Recursão em árvores profundas pode estourar a pilha; considere DFS iterativa para limites próximos de `2e5`.
