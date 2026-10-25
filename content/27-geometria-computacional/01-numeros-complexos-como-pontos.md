---
title: Números complexos como pontos
summary: Em breve.
status: done
complexity: tags:
tags: ---
---

## Ideia e quando usar

Números complexos como pontos é uma técnica/estrutura que aparece quando o problema tem a seguinte necessidade: reconhecer o padrão pedido no enunciado, representar os estados relevantes e escolher uma operação que possa ser executada dentro do limite de tempo. Não decore só o código: identifique **o que cada variável significa**, qual é a condição de validade e qual é o custo de cada operação.

## Como pensar na solução

1. **Defina a entrada e a resposta.** Escreva em uma frase o que precisa ser calculado e quais restrições importam (`n`, número de arestas, tamanho das strings, valores máximos).
2. **Escolha a representação.** Vetor, lista de adjacência, estado de DP, estrutura de dados ou ordenação devem refletir diretamente as operações necessárias.
3. **Mantenha um invariante.** Antes de cada iteração/consulta, diga o que a estrutura representa. Depois da operação, prove que continua representando isso.
4. **Analise a complexidade.** Conte quantas vezes cada elemento/aresta/estado é processado. Uma solução correta que faz `O(n²)` pode falhar para `n=2e5`.
5. **Trate os casos-limite.** Entrada vazia ou mínima, duplicatas, valores negativos, grafo desconexo, ciclos, limites de índice e overflow.

## Modelo de implementação

O esqueleto depende do problema concreto; não existe um único código que resolva todas as variantes. Em C++ competitivo, mantenha a implementação enxuta e explícita, no estilo deste material:

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];

    // 1. Inicialize a estrutura/estado.
    // 2. Processe os dados mantendo o invariante.
    // 3. Extraia e imprima a resposta.
    return 0;
}
```

Não copie o esqueleto literalmente quando a técnica exigir DFS, recursão, uma estrutura persistente ou várias consultas. Use o código específico da seção como base e adapte os tipos aos limites do enunciado.

## Complexidade: como conferir

- Um laço sobre `n` elementos é `O(n)`.
- Dois laços aninhados sobre `n` normalmente são `O(n²)`.
- Ordenar costuma custar `O(n log n)`.
- Uma busca binária custa `O(log n)`; fazer isso para cada elemento dá `O(n log n)`.
- Em grafos, a DFS/BFS com lista de adjacência custa `O(n+m)`.
- Uma estrutura de consultas pode ter custo de construção diferente do custo de cada consulta; informe os dois.

A complexidade indicada no cabeçalho é uma referência para a implementação padrão. Variantes do mesmo algoritmo podem ter custos diferentes conforme a estrutura auxiliar, o domínio dos valores e as operações exigidas.

## Erros comuns

- Usar a técnica só porque o nome aparece no enunciado, sem verificar suas pré-condições.
- Não decidir se os intervalos são inclusivos `[l,r]` ou semiabertos `[l,r)`.
- Misturar índices `0..n-1` com índices `1..n`.
- Usar `int` para somas, distâncias ou produtos que podem ultrapassar `2^31-1`; use `long long` quando necessário.
- Esquecer de limpar vetores globais entre casos de teste.
- Não testar duplicatas, casos mínimos e o maior caso permitido.

## Checklist de prova/contest

- [ ] Sei explicar o que representa cada estado/estrutura?
- [ ] Sei por que a transição/operação é correta?
- [ ] Sei justificar a complexidade total, não apenas de uma operação?
- [ ] Os limites e sentinelas estão corretos?
- [ ] A solução trata o caso mínimo e os empates?
- [ ] O tipo numérico comporta a resposta máxima?
