---
title: Segment Tree dinâmica
summary: Árvore implícita que cria nós sob demanda em um domínio grande ou esparso.
status: done
complexity: O(log U) por operação; O(q log U) nós após q atualizações
tags: segtree, dinâmica, domínio implícito
---

## Ideia

A árvore cobre um domínio inteiro [L,R], mas não aloca 4U posições. Cada nó guarda o agregado do segmento e os índices dos filhos; um filho só é criado quando uma atualização visita aquela metade.

Use quando o domínio é enorme (por exemplo, coordenadas até 10^9 ou 10^18) e poucas posições são realmente alteradas. Se todas as coordenadas são conhecidas antes, compressão de coordenadas costuma ser mais simples e econômica.

## Soma com atualização pontual

Convenção: domínio inclusivo [0, 10^18]; limites e posições usam long long; atualização soma v em uma posição; consulta soma em [a,b].

```cpp
struct DynamicSegTree {
    using ll = long long;
    struct Node { ll sum = 0; int l = 0, r = 0; };

    vector<Node> t = {Node()}; // índice 0 = filho inexistente

    int add(int x, ll l, ll r, ll p, ll v) {
        if (!x) {
            x = (int)t.size();
            t.push_back(Node());
        }
        t[x].sum += v;
        if (l == r) return x;

        ll m = l + (r - l) / 2;
        if (p <= m) {
            int child = add(t[x].l, l, m, p, v);
            t[x].l = child;
        } else {
            int child = add(t[x].r, m + 1, r, p, v);
            t[x].r = child;
        }
        return x;
    }

    ll query(int x, ll l, ll r, ll a, ll b) const {
        if (!x || b < l || r < a) return 0;
        if (a <= l && r <= b) return t[x].sum;
        int m = l + (r - l) / 2;
        return query(t[x].l, l, m, a, b)
             + query(t[x].r, m + 1, r, a, b);
    }
};

// int root = 0;
// root = st.add(root, 0LL, 1000000000000000000LL, pos, delta);
// ll ans = st.query(root, 0LL, 1000000000000000000LL, l, r);
```

## Complexidade

- Altura: O(log U), com U = R-L+1.
- Atualização pontual e consulta de intervalo: O(log U).
- Cada atualização cria no máximo O(log U) nós; após q atualizações, memória O(q log U).
- O nó zero representa soma zero e filhos ausentes; não tente acessar t[0] como nó modificável.

## Variações

- **Persistente + dinâmica:** em vez de alterar o nó atual, copie o nó e seus ancestrais; cada raiz passa a representar uma versão.
- **Range add / range sum:** acrescente uma tag lazy e a regra sum += delta * comprimento.
- **Domínio 2D:** uma árvore dinâmica em cada dimensão pode chegar a O(log² U) por operação, mas a memória deve ser analisada com cuidado.
- **Compressão:** se todas as coordenadas de atualização/consulta forem conhecidas, comprima e use uma árvore convencional.

## Cuidados

1. Calcule m = l + (r-l)/2 para evitar overflow em domínios grandes.
2. Atualize a raiz devolvida por add; a primeira raiz é 0.
3. O código usa índices, não referências a vector<Node>, pois push_back pode realocar o vetor.
4. Garanta L <= p <= R e interseção válida nas consultas.
5. Não confunda memória O(U) de uma árvore completa com O(q log U) da árvore implícita.
