---
title: DP em árvores
summary: Estados por nó, ordem pós-ordem, rerooting, independente máximo e aplicações.
status: done
complexity: O(n) ou O(n log n), conforme os estados
tags: dp, árvores, dfs, rerooting
---

## A sacada

Em uma árvore, remover a aresta entre um nó `v` e seu pai separa a árvore em subárvores independentes. Por isso, muitos problemas podem ser resolvidos calculando respostas dos filhos antes do pai: uma DFS em **pós-ordem**.

Escolha uma raiz (geralmente `1`). `pai[v]` identifica o pai e `adj[v]` lista vizinhos. Ao percorrer a árvore, ignore o pai para não voltar pela aresta que acabou de usar.

## Exemplo 1: maior conjunto independente

Queremos escolher o maior número de vértices sem escolher duas pontas da mesma aresta.

- `dp[v][0]`: melhor resposta na subárvore de `v` quando `v` **não** é escolhido.
- `dp[v][1]`: melhor resposta quando `v` **é** escolhido.

Se `v` não é escolhido, cada filho pode ser escolhido ou não: `dp[v][0] += max(dp[u][0], dp[u][1])`. Se `v` é escolhido, nenhum filho pode ser escolhido: `dp[v][1] += dp[u][0]`.

```cpp
const int N = 2e5 + 5;
int n, dp[N][2];
vector<int> adj[N];

void dfs(int v, int p = 0) {
    dp[v][0] = 0;
    dp[v][1] = 1;
    for (int u : adj[v]) {
        if (u == p) continue;
        dfs(u, v);
        dp[v][0] += max(dp[u][0], dp[u][1]);
        dp[v][1] += dp[u][0];
    }
}
// resposta: max(dp[1][0], dp[1][1])
```

Tempo `O(n)`. A inicialização `dp[v][1]=1` conta o próprio vértice. A raiz pode ser escolhida ou não, então pegamos o máximo dos dois estados.

## Exemplo 2: tamanho da subárvore e soma

```cpp
int tam[N];
long long soma[N];
void dfs(int v, int p = 0) {
    tam[v] = 1;
    soma[v] = valor[v];
    for (int u : adj[v]) {
        if (u == p) continue;
        dfs(u, v);
        tam[v] += tam[u];
        soma[v] += soma[u];
    }
}
```

Esse padrão aparece em contagem de descendentes, soma da subárvore, maior profundidade, quantidade de folhas, número de caminhos que passam por um nó e muitos outros estados agregáveis.

## Exemplo 3: distância máxima a partir de cada nó (rerooting)

Uma DFS de baixo para cima calcula informações da subárvore; uma segunda DFS propaga informações do pai para os filhos. Para distâncias em árvore não ponderada:

- `baixo[v]` = maior distância de `v` até um descendente.
- `cima[v]` = maior distância de `v` até um vértice fora da subárvore de `v`.
- `baixo[v] = max(0, 1 + baixo[u])` sobre filhos `u`.
- Para passar de `v` para o filho `u`, o melhor caminho que não entra na subárvore de `u` pode ir para cima (`cima[v]`) ou descer por outro filho de `v`.

Guarde os dois maiores valores `1 + baixo[filho]` de cada nó para excluir o filho atual em `O(1)`. Assim cada aresta é processada um número constante de vezes e o total continua `O(n)`.

## Rerooting: receita geral

Use quando a pergunta pede uma resposta para **cada possível raiz**.

1. Faça uma DFS pós-ordem e calcule o estado que vem dos filhos.
2. Faça uma DFS pré-ordem para calcular o estado completo do pai e enviar a contribuição para cada filho.
3. Ao enviar a contribuição, remova a contribuição do filho atual. Prefixos/sufixos ou os dois melhores valores evitam recalcular todos os irmãos.
4. Defina cuidadosamente o estado vazio/identidade e o que significa cada direção.

Aplicações: soma das distâncias de cada vértice para todos os outros, excentricidade, contagem de colorações, número de caminhos, produto/soma de contribuições dos vizinhos e DP de árvore com restrições.

## DP em árvore vs DP em DAG

Árvore tem estrutura sem ciclos e uma única rota entre cada par; a raiz organiza subproblemas em subárvores. Em DAG, a mesma ideia de calcular estados em ordem topológica funciona, mas um estado pode receber contribuição de vários predecessores.

## Complexidade e cuidados

- Uma DFS com trabalho `O(1)` por aresta normalmente é `O(n)`.
- Se cada nó ordena filhos, pode aparecer `O(n log n)`.
- Uma árvore pode ser uma cadeia de `2e5` nós: a recursão pode estourar a pilha. Se isso ocorrer, use DFS iterativa com uma ordem de visita e processe a ordem ao contrário.
- Não esqueça de ignorar o pai; em árvore, `if (u == p) continue` basta. Em grafo geral, isso não basta para detectar ciclos.
- O estado deve conter informação suficiente para calcular o pai; se faltar informação, acrescente dimensão (por exemplo, escolhido/não escolhido) em vez de forçar uma transição incorreta.
