---
title: Segment Tree persistente
summary: Versionamento de consultas por path copying; cada atualização cria uma nova raiz sem alterar versões antigas.
status: done
complexity: O(log n) por atualização e consulta; O(log n) nós novos por versão
tags: segtree, persistência, consultas, k-ésimo
---

## Ideia

Uma raiz identifica uma versão imutável da árvore. Ao atualizar uma posição, copiamos somente os nós do caminho entre a raiz e a folha; os demais nós são compartilhados com a versão anterior (*path copying*).

- **Versão 0:** vetor inicial ou árvore vazia.
- **Versão i:** resultado após as primeiras i atualizações.
- Nunca modifique um nó antigo: crie uma cópia antes de alterar seus filhos ou agregado.

## Soma em intervalo entre versões

O exemplo começa com uma árvore zerada. `add(raiz, pos, delta)` cria uma nova versão somando `delta` na posição. `query(raiz, l, r)` consulta intervalo inclusivo.

```cpp
struct PersistentSegTree {
    using ll = long long;
    struct Node { ll sum = 0; int l = 0, r = 0; };

    int n;
    vector<Node> t = {Node()}; // nó 0 representa uma árvore nula

    PersistentSegTree(int n) : n(n) {}

    int add(int old, int l, int r, int p, ll v) {
        int cur = (int)t.size();
        t.push_back(t[old]); // copia o nó antigo
        t[cur].sum += v;

        if (l == r) return cur;
        int m = (l + r) / 2;
        if (p <= m) {
            int child = add(t[old].l, l, m, p, v);
            t[cur].l = child;
        } else {
            int child = add(t[old].r, m + 1, r, p, v);
            t[cur].r = child;
        }
        return cur;
    }

    ll query(int x, int l, int r, int a, int b) const {
        if (!x || b < l || r < a) return 0;
        if (a <= l && r <= b) return t[x].sum;
        int m = (l + r) / 2;
        return query(t[x].l, l, m, a, b)
             + query(t[x].r, m + 1, r, a, b);
    }
};

// vector<int> raiz(q + 1, 0);
// raiz[i + 1] = st.add(raiz[i], 0, n - 1, pos, delta);
// st.query(raiz[k], 0, n - 1, l, r);
```

Para um vetor inicial não nulo, construa a primeira raiz em `O(n)` ou insira os `n` valores; não confunda a versão zerada acima com uma construção a partir de `a`.

## K-ésimo menor em um intervalo

Com compressão de coordenadas, crie `raiz[i]` contendo as frequências dos valores em `a[0..i)`. A diferença entre `raiz[r]` e `raiz[l]` representa exatamente as frequências do intervalo semiaberto `[l,r)`.

Na descida simultânea pelas duas raízes, a quantidade à esquerda é `leftCount = t[t[raiz[r]].l].sum - t[t[raiz[l]].l].sum`. Se `k <= leftCount`, desça à esquerda; caso contrário, subtraia `leftCount` de `k` e desça à direita.

- Construção das versões de frequência: `O(n log n)`.
- Consulta do k-ésimo menor: `O(log n)`.
- Memória: `O(n log n)` nós.
- `k` é 1-based e deve satisfazer `1 <= k <= r-l`.

## Quando usar

- Consultar somas/contagens em versões históricas.
- Comparar prefixos de frequências para estatísticas de ordem.
- Responder consultas offline de k-ésimo menor em subarray.

## Complexidade e invariantes

- Cada atualização cria no máximo `ceil(log2(n)) + 1` nós: `O(log n)`.
- Uma consulta de intervalo visita `O(log n)` nós.
- A memória total é `O(n + q log n)` para `q` atualizações, além dos vetores de raízes.
- Nós compartilhados são imutáveis. Alterar um nó compartilhado corrompe todas as versões que o utilizam.

## Erros comuns

1. Guardar referências ou ponteiros para elementos de `vector<Node>` durante `push_back`: a realocação pode invalidá-los. O código usa índices.
2. Modificar o filho da versão antiga em vez de gravar o índice do novo filho no nó copiado.
3. Subtrair versões em ordem errada: `raiz[r] - raiz[l]` representa `[l,r)`.
4. Usar k fora de `1..r-l` na consulta de ordem estatística.
5. Esquecer que a coordenada comprimida precisa ser mapeada de volta para o valor original.
