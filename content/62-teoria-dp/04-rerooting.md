---
title: Rerooting DP — teoria
summary: Calcular a resposta para todas as raízes em O(n): contribuição de aresta, troca de dono e prefixo/sufixo dos irmãos.
status: done
complexity: O(n)
tags: rerooting, dp em árvore, soma das distâncias, teoria
---

## Problema: soma das distâncias de cada vértice

Exemplo da aula (arestas 1-2, 1-3, 3-4, 3-5): respostas 6, 9, 5, 8, 8.

### Para uma raiz só

"Contribuição de cada aresta": para chegar à raiz, todos os vértices da subárvore de `v` passam pela aresta `(v, pai)` ⇒ contribuição = `sub[v]`. Logo `ans[raiz] = Σ_{v ≠ raiz} sub[v]`.

### Para todas as raízes

Ao mudar a raiz de `v` para o filho `c`, **só a aresta `(v, c)` troca de dono**; as únicas subárvores que mudam são as de `v` e `c`:

```
sub[v] = sub[v] - sub[c]      // v deixa de conter c
sub[c] = n                    // c vira raiz
```

Contribuição da aresta passa de `sub[c]` para `n - sub[c]`, portanto:

**`ans[c] = ans[v] - sub[c] + (n - sub[c]) = ans[v] + n - 2·sub[c]`**

> Pegadinha do código do slide: ele faz `ans[ch] = sum - auxV - auxCH + sub[v] + sub[ch]`, com `sum` = resposta da raiz **original**. Isso só está certo para filhos da raiz; em profundidade maior é preciso partir de `ans[v]` (do pai), como na fórmula acima.

## Receita geral

1. Enraíze em 1. **Sobe**: calcule `down[v]` (resposta olhando só a subárvore).
2. **Desce**: calcule `up[c]` (resposta do "resto da árvore" visto de `c`) a partir de `up[v]` e dos **irmãos** de `c`.
3. Resposta de `v` = combinação de `down[v]` e `up[v]`.

## Irmãos sem divisão: prefixo e sufixo

Se a combinação é um produto e o módulo **não é primo** (AtCoder DP V – Subtree), não dá para "dividir para tirar o filho". Use produtos de prefixo/sufixo dos filhos:
`up[c_i] = up[v] · pre[i] · suf[i+1] + 1`, onde `pre/suf` são produtos de `(down[f] + 1)`.

## Maior distância (Tree Distances I)

Guarde as **duas** maiores descidas `d1[v] ≥ d2[v]` e por qual filho veio `d1`. Ao descer para `c`: o melhor irmão é `d2[v]` se `c` deu o `d1`, senão `d1[v]`; `up[c] = 1 + max(up[v], irmão)`. Resposta `max(d1[v], up[v])`.
