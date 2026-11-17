---
title: Entrada e saída rápidas
summary: sync_with_stdio, quebra de linha sem flush e um leitor por blocos para milhões de números.
status: done
complexity: O(tamanho da entrada)
tags: introdução, entrada e saída, desempenho
---

## Ideia

Com `1e6` números, `cin`/`cout` sem ajuste pode estourar o tempo. Dois comandos resolvem quase tudo: `ios::sync_with_stdio(false)` desliga a sincronização com `stdio` e `cin.tie(nullptr)` evita descarregar `cout` a cada leitura. Use `'\n'` em vez de `endl` (que força o flush). Depois dessas linhas **não misture** `cin` com `scanf`/`printf`. Para entradas ainda maiores, leia em blocos com `fread` e escreva em um único `fputs`.

## Código

```cpp
// leitor de inteiros com sinal por blocos (stdin)
struct Leitor {
    static const size_t TAM = 1 << 16;
    char buf[TAM];
    size_t pos = 0, len = 0;
    int ch() {
        if (pos == len) {
            len = fread(buf, 1, TAM, stdin);
            pos = 0;
            if (!len) return -1;
        }
        return buf[pos++];
    }
    bool ler(ll& x) {  // false no fim da entrada
        int c = ch();
        while (c != -1 && c != '-' && (c < '0' || c > '9')) c = ch();
        if (c == -1) return false;
        bool neg = false;
        if (c == '-') neg = true, c = ch();
        x = 0;
        for (; c >= '0' && c <= '9'; c = ch()) x = x * 10 + (c - '0');
        if (neg) x = -x;
        return true;
    }
};

// escritor: acumula e imprime de uma vez
struct Escritor {
    string s;
    void escreve(ll x, char sep = '\n') { s += to_string(x); s += sep; }
    ~Escritor() { fwrite(s.data(), 1, s.size(), stdout); }
};
```

## Complexidade e cuidados

- Configuração padrão em `main`: `ios::sync_with_stdio(false); cin.tie(nullptr);`.
- Problemas interativos (que esperam a resposta antes da próxima leitura) exigem `cout << x << endl;` ou `cout.flush()`.
- Misturar `cin >> n` e `getline(cin, s)`: depois do número fica um `'\n'` no buffer; chame `cin.ignore()` antes do `getline`.
- `Leitor` ignora qualquer caractere que não seja dígito ou `-`; não serve para ler palavras ou números decimais.
