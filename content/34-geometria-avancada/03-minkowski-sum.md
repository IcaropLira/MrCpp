---
title: Minkowski Sum de polígonos convexos
summary: Soma dois polígonos convexos somando vetorialmente suas arestas em ordem angular.
status: done
complexity: O(n + m) após normalização
tags: geometria, minkowski, convex hull, poligonos
---

## Quando usar

Para combinar regiões convexas, testar distância entre polígonos por diferença de Minkowski e resolver problemas de colisão.

## Ideia

Normalize os polígonos em ordem anti-horária e rotacione cada um para começar no vértice mais baixo (menor y, depois menor x). As arestas já ficam ordenadas por ângulo; mescle as duas sequências como merge.

## Observação de implementação

A implementação depende de uma rotina geométrica de ponto com soma, subtração, cross e comparação de ângulo. Em vez de esconder convenções num snippet incompleto, os invariantes essenciais são:

1. Remover vértices consecutivos repetidos e colineares intermediários.
2. Garantir orientação anti-horária.
3. Escolher o vértice inicial de menor y e depois menor x.
4. Mesclar vetores de arestas comparando cross(eA,eB); se cross=0, consumir ambas.
5. Acumular o ponto atual e remover o último ponto repetido.

~~~cpp
// Se A e B são convexos anti-horários e suas arestas estão em ordem angular:
vector<Point> minkowski(const vector<Point>& A, const vector<Point>& B) {
    vector<Point> ea, eb;
    for (int i = 0; i < (int)A.size(); i++)
        ea.push_back(A[(i+1)%A.size()] - A[i]);
    for (int i = 0; i < (int)B.size(); i++)
        eb.push_back(B[(i+1)%B.size()] - B[i]);

    int i = 0, j = 0;
    Point cur = A[0] + B[0];
    vector<Point> C{cur};
    while (i < (int)ea.size() || j < (int)eb.size()) {
        Point step;
        if (i == (int)ea.size()) step = eb[j++];
        else if (j == (int)eb.size()) step = ea[i++];
        else {
            long long cr = cross(ea[i], eb[j]);
            if (cr > 0) step = ea[i++];
            else if (cr < 0) step = eb[j++];
            else step = ea[i++] + eb[j++];
        }
        cur = cur + step;
        C.push_back(cur);
    }
    C.pop_back();
    return C;
}
~~~

## Cuidados

- A rotina acima exige que A[0] e B[0] sejam os vértices iniciais de menor y e depois menor x, e que ambos sejam convexos anti-horários sem arestas degeneradas.
- A função cross(ea,eb) deve usar tipo suficientemente largo.
- Polígonos degenerados (ponto ou segmento) exigem tratamento separado.
- Não aplique diretamente a polígonos côncavos.
