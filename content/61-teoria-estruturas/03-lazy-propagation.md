---
title: Lazy Propagation — teoria
summary: Adiar atualizações em intervalo com o array lazy[]; push, os 3 casos, fórmula do nó e composição de pendências.
status: done
complexity: O(log n) por update e query
tags: lazy, segtree, range update, push, teoria
---

## Motivação

Somar `v` em `[i, j]` com segtree normal = `j - i + 1` updates pontuais → **O(n log n)** por operação: muito lento (q até 10⁶).

## O que é

Técnica que **adia** a atualização dos nós até o momento em que seus valores são necessários. A alteração pendente fica em `lazy[]`; o trabalho de aplicá-la aos filhos só é feito quando uma busca passa por eles ("propagar do pai para os filhos só quando necessário").

## Update [L, R] com valor V — 3 casos

1. Nó **totalmente disjunto** de `[L, R]` → não faz nada (retorna ao pai).
2. Nó **totalmente contido** → atualiza o `lazy` do nó e para (não desce).
3. **Parte contida, parte disjunta** → `push`, quebra nos dois filhos e recalcula o nó.

## Query [L, R]

Mesmos 3 casos, **sempre aplicando a pendência** (push) do nó antes de usar o valor.

## Push (soma em intervalo)

```
valor_novo = valor_antigo + lazy · (r - l + 1)
lazy[filho_esq] += lazy;  lazy[filho_dir] += lazy;  lazy[v] = 0   // desmarca
```

Exemplo da aula: nó `[5, 6]` com valor 5 e lazy 10 → `5 + 10·(6 - 5 + 1) = 25`.

## Significado do lazy

`lazy[v] = 10` quer dizer: "da próxima vez que passarmos por `v`, o valor guardado precisa ser corrigido por +10 em cada posição, e os filhos ainda não sabem".

## Duas convenções (escolha uma e seja consistente)

- **A**: o valor do nó já inclui a própria pendência; `lazy` vale só para os filhos (o código "Intervals"/"Danil" das aulas).
- **B**: o valor do nó ainda não inclui; `push` aplica no nó e passa adiante (o código de soma da aula).

## Tabela de pendências

| Update | Query | Aplicar no nó de tamanho `len` | Compor `lazy` antigo com novo |
|---|---|---|---|
| `+x` | soma | `+= x·len` | `lz += x` |
| `+x` | mín/máx | `+= x` | `lz += x` |
| `= x` | soma | `= x·len` | substitui |
| `= x` | mín/máx | `= x` | substitui |
| `·k + c` (afim) | soma | `= k·s + c·len` | `(k1,c1)` depois `(k2,c2)` = `(k2·k1, k2·c1 + c2)` |
| inverter 0/1 | contar 1s | `= len - cnt` | `lz ^= 1` |
| `^= x` | soma | por bit b: `cnt_b = len - cnt_b` | `lz ^= x` |

## Complexidade

- Query: igual à segtree normal → O(log n).
- Update: desce no máximo a altura da árvore em ≤ 2 caminhos de "quebra" → O(log n).
