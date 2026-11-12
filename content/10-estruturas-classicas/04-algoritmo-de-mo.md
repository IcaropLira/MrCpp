---
title: Algoritmo de Mo
summary: Reordena consultas offline para mover uma janela e manter uma resposta incremental.
status: done
complexity: O((n + q)√n) movimentos na ordenação em blocos; O(1) por movimento
tags: consultas offline, sqrt decomposition, frequência
---

## Ideia

Mo resolve consultas de intervalo offline quando todas as consultas são conhecidas antes de respondê-las e conseguimos adicionar/remover um elemento das extremidades da janela em O(1) (ou custo pequeno).

Ordene consultas pelo bloco de l; dentro do bloco, ordene r alternando a direção para reduzir o movimento do ponteiro direito. Mantenha a janela atual [L,R] e mova as pontas até coincidir com a consulta.

## Exemplo: quantidade de valores distintos

O exemplo comprime os valores para indexar frequências e mantém distintos ao inserir/remover ocorrências. Consultas são inclusivas.

\`\`\`cpp
struct Query { int l, r, id; };

vector<int> mo_distinct(vector<int> a, vector<Query> qs) {
    int n = a.size(), q = qs.size();
    vector<int> vals = a;
    sort(vals.begin(), vals.end());
    vals.erase(unique(vals.begin(), vals.end()), vals.end());
    for (int &x : a)
        x = lower_bound(vals.begin(), vals.end(), x) - vals.begin();

    int B = max(1, (int)sqrt(n));
    sort(qs.begin(), qs.end(), [&](const Query& x, const Query& y) {
        int bx = x.l / B, by = y.l / B;
        if (bx != by) return bx < by;
        return (bx & 1) ? x.r > y.r : x.r < y.r;
    });

    vector<int> freq(vals.size()), ans(q);
    int L = 0, R = -1, distinct = 0;

    auto add = [&](int p) {
        if (freq[a[p]]++ == 0) distinct++;
    };
    auto remove = [&](int p) {
        if (--freq[a[p]] == 0) distinct--;
    };

    for (auto qu : qs) {
        while (L > qu.l) add(--L);
        while (R < qu.r) add(++R);
        while (L < qu.l) remove(L++);
        while (R > qu.r) remove(R--);
        ans[qu.id] = distinct;
    }
    return ans;
}
\`\`\`

Antes de chamar, atribua id = índice original a cada consulta e garanta 0 <= l <= r < n.

## Complexidade

- Ordenação: O(q log q).
- Movimento total usual: O((n+q)√n) com bloco B ≈ √n; a constante depende da distribuição das consultas.
- Memória: O(n+q).
- O custo real é número de chamadas a add/remove multiplicado pelo custo de cada chamada.

## Variações

- **Mo com atualização:** inclui tempo t na consulta e aplica/desfaz atualizações; a ordenação usa blocos em l, r e t.
- **Mo em árvores:** Euler Tour transforma subárvore em intervalo; caminhos exigem uma técnica de Euler/LCA própria.
- **Resposta por frequência:** soma de frequências, pares iguais, modo com estruturas adicionais etc. O estado e as funções add/remove mudam.

## Quando não usar

- Se uma Fenwick/Segment Tree responde online em O(log n), normalmente prefira a estrutura.
- Se não há como atualizar a resposta ao adicionar/remover uma extremidade com custo pequeno, Mo pode não ajudar.
- Consultas online não podem ser reordenadas livremente.

## Erros comuns

1. Esquecer de devolver as respostas na ordem original usando id.
2. Usar bloco zero; o código protege com max(1, sqrt(n)).
3. Fazer remove antes de garantir que a posição pertence à janela.
4. Esquecer que add/remove devem manter o invariante da janela atual.
