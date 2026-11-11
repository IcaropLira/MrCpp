---
title: Trie
summary: Árvore de prefixos: inserir, buscar, prefixos, contagem, exclusão e aplicações.
status: done
complexity: O(|s|) por operação
tags: strings, trie, prefixos, dicionário
---

## Ideia

Uma trie guarda strings compartilhando prefixos. Cada aresta representa um caractere; o caminho da raiz até um nó representa um prefixo. A raiz é o nó `0`, e `0` também significa “não existe filho” no vetor abaixo — por isso os nós reais novos começam no índice `1`.

É especialmente boa quando várias palavras compartilham prefixos, quando precisamos listar/contar palavras por prefixo ou quando cada consulta deve custar `O(|s|)` independentemente do número de palavras.

## Trie para palavras minúsculas (`a` a `z`)

```cpp
const int N = 2e6 + 5;
int trie[N][26], fim[N], pref[N];
int prox = 1;

void add(string s) {
    int u = 0;
    pref[u]++;
    for (char ch : s) {
        int c = ch - 'a';
        if (!trie[u][c]) trie[u][c] = prox++;
        u = trie[u][c];
        pref[u]++;
    }
    fim[u]++;
}

bool has(string s) {
    int u = 0;
    for (char ch : s) {
        int c = ch - 'a';
        if (!trie[u][c]) return false;
        u = trie[u][c];
    }
    return fim[u] > 0;
}

int quantas_com_prefixo(string s) {
    int u = 0;
    for (char ch : s) {
        int c = ch - 'a';
        if (!trie[u][c]) return 0;
        u = trie[u][c];
    }
    return pref[u];
}
```

- `fim[u]`: quantas palavras inseridas terminam exatamente em `u` (trata duplicatas).
- `pref[u]`: quantas palavras inseridas passam por `u`, incluindo as que terminam ali.
- `prox`: próximo índice livre. Não reinicie `prox` sem limpar a estrutura.
- Cada inserção/busca custa `O(|s|)`; memória `O(total de caracteres * alfabeto)` no vetor fixo.

## Alfabeto é parte do problema

O exemplo usa `ch - 'a'`, logo só aceita `a..z`. Para números, use `ch - '0'` e dimensão `10`. Para maiúsculas/minúsculas, alfabeto de 52 letras ou mapear caracteres. Se a entrada tiver caracteres arbitrários, `map<char,int>` por nó economiza espaço quando há poucos filhos, mas costuma ter maior constante.

## Prefixo vs palavra completa

- Para saber se existe uma palavra exatamente igual, confira `fim[u] > 0` depois de percorrer toda a string.
- Para saber se existe alguma palavra começando com `s`, basta chegar ao nó final do prefixo e conferir `pref[u] > 0` (ou se o caminho existe, caso nunca haja remoções).
- A palavra `abc` pode ser prefixo de `abcd`: `fim` e `pref` têm papéis diferentes.

## Remover uma palavra

Só remova se `has(s)` for verdadeiro. Diminua `fim` no nó terminal e `pref` na raiz e em todos os nós percorridos. Não é necessário apagar nós para a correção; deixar nós mortos facilita a implementação. Se for apagar nós, confirme que `pref` virou zero e que nenhum filho ainda é usado.

## Aplicações clássicas

- **Phone List / consistência de telefones:** ao inserir cada número, detecte se algum número anterior é prefixo dele; também detecte se ele é prefixo de um número já inserido. Uma implementação simples guarda `fim` e `pref`, ou sinaliza terminal encontrado antes do último caractere.
- Dicionário e autocomplete: percorrer o prefixo e explorar a subárvore para sugerir palavras.
- Contar palavras com um prefixo, frequência de strings e maior prefixo comum.
- XOR máximo de pares: trie de bits; em cada bit, tente o filho oposto ao bit atual para maximizar XOR.
- Aho-Corasick: trie + links de falha para buscar muitas palavras ao mesmo tempo.
- Busca de palavras em grades, filtragem e compressão de prefixos.

## Trie binária para XOR máximo

Cada número vira uma sequência de bits, do mais significativo ao menos significativo. Para maximizar `x XOR y`, em cada bit tentamos seguir o bit oposto de `x`; se não existir, seguimos o mesmo bit. Abaixo, cada nó tem dois filhos e a consulta devolve o valor máximo de XOR encontrado.

```cpp
struct TrieXor {
    struct Node { int filho[2] = {-1, -1}; };
    vector<Node> t;

    TrieXor() { t.push_back(Node()); }

    void add(int x) {
        int u = 0;
        for (int b = 30; b >= 0; b--) {
            int bit = (x >> b) & 1;
            if (t[u].filho[bit] == -1) {
                t[u].filho[bit] = t.size();
                t.push_back(Node());
            }
            u = t[u].filho[bit];
        }
    }

    int max_xor(int x) {
        int u = 0, ans = 0;
        for (int b = 30; b >= 0; b--) {
            int bit = (x >> b) & 1, want = bit ^ 1;
            if (t[u].filho[want] != -1) {
                ans |= (1 << b);
                u = t[u].filho[want];
            } else u = t[u].filho[bit];
        }
        return ans;
    }
};
```

Insira pelo menos um número antes de consultar. Para achar o maior XOR de um par do vetor, consulte cada elemento contra a trie dos anteriores e só depois insira o atual. Assim não pareamos um elemento consigo mesmo.

```cpp
TrieXor tr;
int ans = 0;
for (int x : a) {
    if (tr.t.size() > 1) ans = max(ans, tr.max_xor(x));
    tr.add(x);
}
```

Use bits 30..0 para valores não negativos até `2^31-1`; para `long long`, percorra 62..0 e use `1LL << b`.

### Variações recorrentes

- **XOR máximo com um valor dado:** trie binária, escolhendo o bit oposto sempre que possível.
- **XOR mínimo:** faça o contrário: prefira o mesmo bit.
- **Maior XOR de um par:** percorra o vetor, consulte os anteriores e insira o atual.
- **Subarray com XOR máximo:** use prefix XOR; o XOR de `[l,r]` é `pref[r+1] ^ pref[l]`, e a trie busca o prefixo anterior que maximiza o resultado.
- **XOR menor que K:** armazene contagem de elementos por nó e conte os caminhos que ficam abaixo do limite bit a bit.
- **XOR de caminho em árvore:** calcule `xr[v] = xr[pai[v]] ^ peso(pai[v],v)`; então `xorPath(u,v) = xr[u] ^ xr[v]` em árvore.


## Erros comuns

1. Usar `ch-'a'` para uma string de dígitos: índice fora do vetor.
2. Considerar que chegar a um nó significa que a palavra completa existe; falta conferir `fim`.
3. Não tratar palavras duplicadas quando a entrada permite repetição.
4. Alocar `N` nós sem estimar a soma dos comprimentos. O máximo de nós é `1 + soma(|s|)`.
5. Usar `int trie[N][26]` enorme sem verificar memória: são aproximadamente `N*26*4` bytes só para os filhos.
6. Misturar nó zero como raiz e como “ausente” sem começar os novos nós em `1`.
