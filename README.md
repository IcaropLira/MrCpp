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
