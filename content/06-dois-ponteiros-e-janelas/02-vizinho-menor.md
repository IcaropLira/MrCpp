---
title: Vizinho menor mais próximo
summary: Vizinho menor à esquerda com pilha monotônica.
status: done
complexity: O(n)
tags: pilha monotônica
---

## Ideia

A pilha guarda candidatos em ordem crescente; quem é maior que o atual nunca mais será resposta.

## Código

```cpp
vector<int> prevSmaller(const vector<int>& a) { // -1 se não existe
    vector<int> r(a.size()), st;
    for (int i = 0; i < (int)a.size(); i++) {
        while (!st.empty() && a[st.back()] >= a[i]) st.pop_back();
        r[i] = st.empty() ? -1 : st.back();
        st.push_back(i);
    }
    return r;
}
```
