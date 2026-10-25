---
title: Template de código
summary: Template base e convenções de estilo.
status: done
complexity: 
tags: template, io
---

## Ideia

Todo código do Mr. C++ segue este template: C++17, `ll` para inteiros de 64 bits, índices a partir de 0 e intervalos fechados, a menos que o tópico diga o contrário. Para mudar o estilo da biblioteca inteira, edite este arquivo e os blocos de código dos tópicos.

## Código

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // ...
}
```

## Uso

Cole o template e acrescente a estrutura do tópico acima de `main`.
