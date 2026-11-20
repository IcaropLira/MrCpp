---
title: Stress test (sol × brute × gerador)
summary: Script que compila, gera casos aleatórios por semente e para no primeiro caso diferente.
status: done
complexity: —
tags: stress test, brute force, gerador, debug, wa
---

## Quando usar

WA sem motivo aparente: escreva a força bruta (a "solução ingênua" da aula), um gerador de casos **pequenos**, e compare. O caso que quebra é pequeno o bastante para depurar à mão.

## Script

```bash
#!/bin/bash
# uso: ./stress.sh sol brute gen [testes]
# compila os três, roda até achar diferença e mostra a entrada que quebrou
set -e
for f in "$1" "$2" "$3"; do g++ -std=c++17 -O2 -o "$f" "$f.cpp"; done
for ((i = 1; i <= ${4:-1000}; i++)); do
    ./"$3" "$i" > in.txt                       # semente = nº do teste (reprodutível)
    ./"$1" < in.txt > out1.txt
    ./"$2" < in.txt > out2.txt
    if ! cmp -s out1.txt out2.txt; then
        echo "DIFERENÇA no teste $i"; echo "--- entrada"; cat in.txt
        echo "--- sol"; cat out1.txt; echo "--- brute"; cat out2.txt; exit 1
    fi
done
echo "OK: $((i - 1)) testes"
```

## Gerador

```cpp
#include <bits/stdc++.h>
using namespace std;
int main(int argc, char **argv) {
    mt19937 rng(atoi(argv[1]));                               // semente vinda do script
    auto rnd = [&](int l, int r) { return uniform_int_distribution<int>(l, r)(rng); };
    int n = rnd(1, 8);
    cout << n << '\n';
    for (int i = 0; i < n; i++) cout << rnd(-10, 10) << " \n"[i == n - 1];
}
```

Uso: `chmod +x stress.sh && ./stress.sh sol brute gen 1000`. Para checar respostas com várias saídas válidas, troque o `cmp` por um verificador (`./checker in.txt out1.txt`).

> Verificado: o script acima rodou 200 testes de Kadane contra a força bruta O(n²).
