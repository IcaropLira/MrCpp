export type AlmanacDiagram = { key: string; caption: string; tikz: string };

// Diagramas vetoriais reutilizados do AlmanaqueDaProgramacaoCompetitiva.
export const almanacDiagrams: AlmanacDiagram[] = [
  {
    "key": "24-matrizes-e-algebra/04-fft-e-ntt",
    "caption": "Convolução de polinômios",
    "tikz": "\\begin{tikzpicture}[\n    >=stealth,\n    caixa/.style={\n        draw=blue!80!black,\n        minimum width=0.9cm,\n        minimum height=0.75cm,\n        align=center\n    }\n]\n\n% --- Vetor A ---\n\\node[anchor=east] at (-1.8, 1.4) {\\textbf{A:}};\n\\node[caixa] at (-1.0, 1.4) {$1$};\n\\node[caixa] at (0.0, 1.4) {$2$};\n\\node[caixa] at (1.0, 1.4) {$3$};\n\n% --- Vetor B ---\n\\node[anchor=east] at (-1.8, 0.3) {\\textbf{B:}};\n\\node[caixa] at (-0.5, 0.3) {$4$};\n\\node[caixa] at (0.5, 0.3) {$5$};\n\n% Seta de indicação\n\\draw[->, thick, blue!80!black] (1.8, 0.85) -- (2.8, 0.85);\n\n% --- Vetor C (Resultado) ---\n\\node[anchor=south] at (5.0, 2.0) {\\textbf{C = A * B}};\n\\node[caixa] at (3.5, 1.4) {$4$};\n\\node[caixa] at (4.5, 1.4) {$13$};\n\\node[caixa] at (5.5, 1.4) {$22$};\n\\node[caixa] at (6.5, 1.4) {$15$};\n\n\\end{tikzpicture}"
  },
  {
    "key": "24-matrizes-e-algebra/04-fft-e-ntt",
    "caption": "Fluxo da FFT e FFT inversa",
    "tikz": "\\begin{tikzpicture}[\n    >=stealth,\n    bloco/.style={\n        draw=blue!80!black,\n        rounded corners=2pt,\n        minimum width=3.2cm,\n        minimum height=0.8cm,\n        align=center\n    },\n    seta/.style={->, thick, blue!80!black}\n]\n\n\\node[bloco] (a) at (0,0) {Coeficientes de $A$};\n\\node[bloco] (b) at (0,-1.8) {$\\operatorname{FFT}(A)$};\n\n\\node[bloco] (c) at (5,0) {Coeficientes de $B$};\n\\node[bloco] (d) at (5,-1.8) {$\\operatorname{FFT}(B)$};\n\n\\node[bloco] (e) at (2.5,-3.6) {Multiplicação ponto a ponto};\n\\node[bloco] (f) at (2.5,-5.2) {$\\operatorname{FFT}^{-1}$};\n\\node[bloco] (g) at (2.5,-6.8) {Coeficientes de $A \\cdot B$};\n\n\\draw[seta] (a) -- (b);\n\\draw[seta] (c) -- (d);\n\\draw[seta] (b) -- (e);\n\\draw[seta] (d) -- (e);\n\\draw[seta] (e) -- (f);\n\\draw[seta] (f) -- (g);\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/01-numeros-complexos-como-pontos",
    "caption": "Representação de pontos e vetor",
    "tikz": "\\begin{tikzpicture}[scale=0.8, >=stealth]\n\n    \\draw[->] (-0.5,0) -- (7,0) node[right] {$x$};\n    \\draw[->] (0,-0.5) -- (0,5) node[above] {$y$};\n\n    \\draw[->, thick, blue!80!black] (2,1) -- (6,4);\n\n    \\fill[blue!80!black] (2,1) circle (2.5pt);\n    \\fill[orange!90!black] (6,4) circle (2.5pt);\n\n    \\node[below left] at (2,1) {$A=(2,1)$};\n    \\node[above right] at (6,4) {$B=(6,4)$};\n\n    \\node[blue!80!black] at (4.5,2.2) {$\\overrightarrow{AB}=(4,3)$};\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/02-cross",
    "caption": "Produto escalar e vetores perpendiculares",
    "tikz": "\\begin{tikzpicture}[scale=0.7, >=stealth]\n\n    \\draw[->] (-1,0) -- (4,0);\n    \\draw[->] (0,-3) -- (0,3);\n\n    \\draw[->, very thick, blue!80!black] (0,0) -- (3,2);\n    \\draw[->, very thick, orange!90!black] (0,0) -- (2,-3);\n\n    \\node[above right] at (3,2) {$u=(3,2)$};\n    \\node[below right] at (2,-3) {$v=(2,-3)$};\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/02-cross",
    "caption": "Produto vetorial e orientação",
    "tikz": "\\begin{tikzpicture}[scale=0.75, >=stealth]\n\n    % Eixos\n    \\draw[->] (-0.5,0) -- (7,0);\n    \\draw[->] (0,-0.5) -- (0,5);\n\n    % Pontos\n    \\fill[blue!80!black] (1,1) circle (2.5pt);\n    \\fill[blue!80!black] (5,1) circle (2.5pt);\n    \\fill[orange!90!black] (4,4) circle (2.5pt);\n\n    % Vetores\n    \\draw[->, thick] (1,1) -- (5,1);\n    \\draw[->, thick] (1,1) -- (4,4);\n\n    \\node[below left] at (1,1) {$A$};\n    \\node[below right] at (5,1) {$B$};\n    \\node[above] at (4,4) {$C$};\n\n    \\node at (3,0.45) {$\\overrightarrow{AB}$};\n    \\node at (2.1,2.8) {$\\overrightarrow{AC}$};\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/02-cross",
    "caption": "Sinal do cross: esquerda ou direita",
    "tikz": "\\begin{tikzpicture}[scale=0.75, >=stealth]\n\n    % Esquerda\n    \\fill[blue!80!black] (0,0) circle (2pt);\n    \\fill[blue!80!black] (2,0) circle (2pt);\n    \\fill[orange!90!black] (3.5,1.5) circle (2pt);\n\n    \\draw[->, thick] (0,0) -- (2,0);\n    \\draw[->, thick] (2,0) -- (3.5,1.5);\n\n    \\node at (1,-0.4) {$A \\rightarrow B$};\n    \\node at (3.7,0.9) {Esquerda ($>0$)};\n\n    % Direita\n    \\fill[blue!80!black] (6,0) circle (2pt);\n    \\fill[blue!80!black] (8,0) circle (2pt);\n    \\fill[orange!90!black] (9.5,-1.5) circle (2pt);\n\n    \\draw[->, thick] (6,0) -- (8,0);\n    \\draw[->, thick] (8,0) -- (9.5,-1.5);\n\n    \\node at (7,-0.4) {$A \\rightarrow B$};\n    \\node at (9.7,-0.8) {Direita ($<0$)};\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/03-area",
    "caption": "Polígono e fórmula de Shoelace",
    "tikz": "\\begin{tikzpicture}[scale=0.8, >=stealth]\n\n    \\fill[blue!10] (1,1) -- (5,1) -- (6,4) -- (3,5) -- (1,3) -- cycle;\n    \\draw[thick, blue!80!black] (1,1) -- (5,1) -- (6,4) -- (3,5) -- (1,3) -- cycle;\n\n    \\fill[orange!90!black] (1,1) circle (2.5pt);\n    \\fill[orange!90!black] (5,1) circle (2.5pt);\n    \\fill[orange!90!black] (6,4) circle (2.5pt);\n    \\fill[orange!90!black] (3,5) circle (2.5pt);\n    \\fill[orange!90!black] (1,3) circle (2.5pt);\n\n    \\node[below left] at (1,1) {$P_1$};\n    \\node[below right] at (5,1) {$P_2$};\n    \\node[right] at (6,4) {$P_3$};\n    \\node[above] at (3,5) {$P_4$};\n    \\node[left] at (1,3) {$P_5$};\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/03-area",
    "caption": "Área de um retângulo",
    "tikz": "\\begin{tikzpicture}[scale=0.8, >=stealth]\n\n    \\fill[blue!10] (1,1) rectangle (5,4);\n    \\draw[thick, blue!80!black] (1,1) rectangle (5,4);\n\n    \\draw[<->] (1,0.5) -- (5,0.5);\n    \\draw[<->] (0.5,1) -- (0.5,4);\n\n    \\node at (3,0.15) {$4$};\n    \\node[rotate=90] at (0.15,2.5) {$3$};\n\n    \\fill[orange!90!black] (1,1) circle (2pt);\n    \\fill[orange!90!black] (5,1) circle (2pt);\n    \\fill[orange!90!black] (5,4) circle (2pt);\n    \\fill[orange!90!black] (1,4) circle (2pt);\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/05-fecho",
    "caption": "Pontos internos e fecho convexo",
    "tikz": "\\begin{tikzpicture}[scale=0.7, >=stealth]\n\n    % Pontos internos (cinza)\n    \\fill[gray!60] (2,2) circle (2.5pt);\n    \\fill[gray!60] (3,2.5) circle (2.5pt);\n    \\fill[gray!60] (4,1.8) circle (2.5pt);\n    \\fill[gray!60] (2.5,3.5) circle (2.5pt);\n    \\fill[gray!60] (4.5,3) circle (2.5pt);\n\n    % Pontos da fronteira (laranja)\n    \\fill[orange!90!black] (1,2) circle (3pt) node[left] {$P_1$};\n    \\fill[orange!90!black] (2,1) circle (3pt) node[below] {$P_2$};\n    \\fill[orange!90!black] (5,1) circle (3pt) node[below right] {$P_3$};\n    \\fill[orange!90!black] (6,3) circle (3pt) node[right] {$P_4$};\n    \\fill[orange!90!black] (4,4.5) circle (3pt) node[above] {$P_5$};\n    \\fill[orange!90!black] (1.5,4) circle (3pt) node[above left] {$P_6$};\n\n    % PolÃ­gono do Fecho\n    \\draw[thick, blue!80!black, dashed] (1,2) -- (2,1) -- (5,1) -- (6,3) -- (4,4.5) -- (1.5,4) -- cycle;\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/05-fecho",
    "caption": "Giro à esquerda e giro à direita",
    "tikz": "\\begin{tikzpicture}[scale=0.8, >=stealth]\n\n    % Curva Ã  esquerda (VÃ¡lida)\n    \\draw[->, thick, blue!80!black] (0,0) node[below] {$A$} -- (2,0) node[below] {$B$};\n    \\draw[->, thick, blue!80!black] (2,0) -- (3,1.5) node[above] {$C$};\n    \\node at (1.5,-0.8) {\\small Giro Ã  Esquerda ($\\text{cross} > 0$)};\n\n    % Separador\n    \\draw[gray!30, dashed] (4.5,-1) -- (4.5,2);\n\n    % Curva Ã  direita (InvÃ¡lida)\n    \\draw[->, thick, red!80!black] (6,1.5) node[above] {$A$} -- (7.5,0.8) node[above] {$B$};\n    \\draw[->, thick, red!80!black] (7.5,0.8) -- (9,0) node[below] {$C$};\n    \\node at (7.5,-0.8) {\\small Giro Ã  Direita ($\\text{cross} < 0$)};\n\n\\end{tikzpicture}"
  },
  {
    "key": "28-sweep-line/02-intersecao-de-segmentos",
    "caption": "Interseção estrita e toque em extremidade",
    "tikz": "\\begin{tikzpicture}[scale=0.85, >=stealth]\n\n    % InterseÃ§Ã£o adequada\n    \\draw[thick, blue!80!black] (0,0) node[below left] {$A$} -- (4,3) node[above right] {$B$};\n    \\draw[thick, orange!90!black] (0,3) node[above left] {$C$} -- (4,0) node[below right] {$D$};\n    \\fill[red!80!black] (2,1.5) circle (2.5pt);\n    \\node at (2,-0.8) {\\small (a) InterseÃ§Ã£o Estrita};\n\n    % Separador\n    \\draw[gray!30, dashed] (5.5,-0.5) -- (5.5,3.5);\n\n    % Casos degenerados/colineares\n    \\draw[thick, blue!80!black] (7,0) node[below left] {$A$} -- (9,1.5) node[above] {$B$};\n    \\draw[thick, orange!90!black] (9,1.5) -- (11,3) node[above right] {$C$};\n    \\fill[orange!90!black] (9,1.5) circle (2.5pt);\n    \\node at (9,-0.8) {\\small (b) Toque em extremidade (Colinear)};\n\n\\end{tikzpicture}"
  },
  {
    "key": "28-sweep-line/01-par-de-pontos-mais-proximos",
    "caption": "Faixa central (strip)",
    "tikz": "\\begin{tikzpicture}[scale=0.8, >=stealth]\n\n    % Linha divisÃ³ria\n    \\draw[dashed, red!80!black, thick] (4,-0.5) -- (4,4.5) node[above] {$x = x_m$};\n    \n    % RegiÃ£o da Faixa (Strip)\n    \\fill[orange!15] (2.5,-0.5) rectangle (5.5,4.5);\n    \\draw[dotted, orange!90!black] (2.5,-0.5) -- (2.5,4.5) node[above] {$x_m - d$};\n    \\draw[dotted, orange!90!black] (5.5,-0.5) -- (5.5,4.5) node[above] {$x_m + d$};\n\n    % Pontos fora da faixa\n    \\fill[gray!60] (0.8,1) circle (2.5pt);\n    \\fill[gray!60] (1.5,3.5) circle (2.5pt);\n    \\fill[gray!60] (6.8,0.5) circle (2.5pt);\n    \\fill[gray!60] (7.2,3) circle (2.5pt);\n\n    % Pontos na faixa\n    \\fill[blue!80!black] (3.2,1.2) circle (3pt) node[left] {$P$};\n    \\fill[blue!80!black] (4.8,2.1) circle (3pt) node[right] {$Q$};\n    \\draw[thick, blue!80!black] (3.2,1.2) -- (4.8,2.1);\n\n\\end{tikzpicture}"
  },
  {
    "key": "28-sweep-line/01-par-de-pontos-mais-proximos",
    "caption": "Limite de pontos na faixa",
    "tikz": "\\begin{tikzpicture}[scale=0.75]\n\n    % RetÃ¢ngulo de busca d x 2d\n    \\draw[thick, blue!80!black, fill=blue!5] (0,0) rectangle (4,2);\n    \\draw[dashed, gray!60] (2,0) -- (2,2);\n    \n    \\node[below] at (1,0) {$d$};\n    \\node[below] at (3,0) {$d$};\n    \\node[left] at (0,1) {$d$};\n\n    % Grid de pontos mostrando a densidade mÃ¡xima\n    \\fill[red!80!black] (0.5,0.5) circle (2.5pt);\n    \\fill[red!80!black] (0.5,1.5) circle (2.5pt);\n    \\fill[red!80!black] (1.5,0.5) circle (2.5pt);\n    \\fill[red!80!black] (1.5,1.5) circle (2.5pt);\n\n    \\fill[blue!80!black] (2.5,0.5) circle (2.5pt);\n    \\fill[blue!80!black] (2.5,1.5) circle (2.5pt);\n    \\fill[blue!80!black] (3.5,0.5) circle (2.5pt);\n    \\fill[blue!80!black] (3.5,1.5) circle (2.5pt);\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/04-distancias",
    "caption": "Distância de ponto a reta",
    "tikz": "\\begin{tikzpicture}[scale=0.85, >=stealth]\n\n    % Reta R\n    \\draw[thick, gray!70, <->] (-0.5,-0.2) -- (6.5,2.6) node[above right] {$r$};\n    \n    % Pontos A e B\n    \\fill[blue!80!black] (1,0.4) circle (2.5pt) node[below right] {$A$};\n    \\fill[blue!80!black] (5,2.0) circle (2.5pt) node[below right] {$B$};\n    \\draw[thick, blue!80!black] (1,0.4) -- (5,2.0);\n\n    % Ponto P\n    \\fill[orange!90!black] (2.5,2.8) circle (3pt) node[above] {$P$};\n\n    % ProjeÃ§Ã£o Q\n    \\fill[red!80!black] (3.16,1.26) circle (2.5pt) node[below right] {$Q$};\n    \\draw[dashed, red!80!black, thick] (2.5,2.8) -- (3.16,1.26);\n\n    % SÃ­mbolo de Ã‚ngulo Reto\n    \\draw[gray!80] (3.0,1.58) -- (3.32,1.42) -- (3.48,1.1);\n\n    \\node[red!80!black, left] at (2.8,2.0) {$d$};\n\n\\end{tikzpicture}"
  },
  {
    "key": "27-geometria-computacional/04-distancias",
    "caption": "Distância de ponto a segmento",
    "tikz": "\\begin{tikzpicture}[scale=0.75, >=stealth]\n\n    % Segmento AB\n    \\draw[very thick, blue!80!black] (0,0) node[below left] {$A (t=0)$} -- (4,0) node[below right] {$B (t=1)$};\n    \\fill[blue!80!black] (0,0) circle (3pt);\n    \\fill[blue!80!black] (4,0) circle (3pt);\n\n    % Caso 1: t < 0\n    \\fill[orange!90!black] (-1.5,2) circle (2.5pt) node[above] {$P_1$};\n    \\draw[dashed, gray!80] (-1.5,2) -- (-1.5,0);\n    \\draw[thick, red!80!black] (-1.5,2) -- (0,0);\n    \\node[red!80!black, left] at (-0.7,1) {\\small $t < 0 \\to A$};\n\n    % Caso 2: 0 <= t <= 1\n    \\fill[orange!90!black] (2.5,2) circle (2.5pt) node[above] {$P_2$};\n    \\draw[thick, red!80!black] (2.5,2) -- (2.5,0);\n    \\fill[red!80!black] (2.5,0) circle (2.5pt) node[below] {$Q$};\n    \\node[red!80!black, right] at (2.5,1) {\\small $0 \\le t \\le 1$};\n\n    % Caso 3: t > 1\n    \\fill[orange!90!black] (5.5,2) circle (2.5pt) node[above] {$P_3$};\n    \\draw[dashed, gray!80] (5.5,2) -- (5.5,0);\n    \\draw[thick, red!80!black] (5.5,2) -- (4,0);\n    \\node[red!80!black, right] at (4.7,1) {\\small $t > 1 \\to B$};\n\n\\end{tikzpicture}"
  },
  {
    "key": "28-sweep-line/02-intersecao-de-segmentos",
    "caption": "Interseção entre retas",
    "tikz": "\\begin{tikzpicture}[scale=0.85, >=stealth]\n\n    % Retas\n    \\draw[thick, blue!80!black] (-0.5,0.2) -- (5.5,3.2) node[above right] {$r_1$};\n    \\draw[thick, orange!90!black] (0.5,3.5) -- (4.5,-0.5) node[below right] {$r_2$};\n\n    % Pontos de definiÃ§Ã£o\n    \\fill[blue!80!black] (0,0.45) circle (2.5pt) node[below left] {$P_1$};\n    \\fill[blue!80!black] (4.5,2.7) circle (2.5pt) node[above left] {$P_2$};\n    \\fill[orange!90!black] (1,3) circle (2.5pt) node[above right] {$P_3$};\n    \\fill[orange!90!black] (4,0) circle (2.5pt) node[below left] {$P_4$};\n\n    % Ponto de InterseÃ§Ã£o\n    \\fill[red!80!black] (2.62,1.76) circle (3pt) node[above=2pt] {$P$};\n\n\\end{tikzpicture}"
  }
,
  { key: "08-consultas-em-intervalo/04-segment-tree", caption: "Agregados dos intervalos em uma árvore", tikz: "\\begin{tikzpicture}[level distance=1.05cm,sibling distance=2.4cm,every node/.style={draw=navy,rounded corners=2pt,fill=paleblue,minimum width=8mm,minimum height=5mm,font=\\small},edge from parent/.style={draw=navylight,thick}]\n\\node {10}\n child {node {3}\n   child {node {1}}\n   child {node {2}}}\n child {node {7}\n   child {node {3}}\n   child {node {4}}};\n\\node[draw=none,fill=none] at (0,-3.35) {\\scriptsize $[0,3]$};\n\\end{tikzpicture}" },
  { key: "08-consultas-em-intervalo/03-fenwick", caption: "Cada posição representa um bloco de tamanho lowbit(i)", tikz: "\\begin{tikzpicture}[x=0.78cm,y=0.65cm]\n\\foreach \\i in {1,...,8} {\n  \\draw[fill=paleblue,draw=navy] (\\i,0) rectangle +(0.72,0.55);\n  \\node[font=\\scriptsize] at (\\i+0.36,0.28) {\\i};\n}\n\\foreach \\i/\\j in {1/1,2/2,3/1,4/4,5/1,6/2,7/1,8/8} {\n  \\draw[gold,very thick] (\\i,-0.15) -- (\\i+\\j-0.28,-0.15);\n  \\draw[gold,very thick] (\\i,-0.15) -- (\\i,-0.32);\n  \\draw[gold,very thick] (\\i+\\j-0.28,-0.15) -- (\\i+\\j-0.28,-0.32);\n}\n\\node[draw=none,fill=none,font=\\scriptsize] at (4.6,-1) {$\\mathrm{lowbit}(i)=i\\ \\&\\ (-i)$};\n\\end{tikzpicture}" },
  { key: "08-consultas-em-intervalo/02-sparse-table", caption: "RMQ: dois blocos de tamanho 2^k cobrem [l,r]", tikz: "\\begin{tikzpicture}[x=0.72cm,y=0.65cm]\n\\foreach \\i/\\v in {0/5,1/2,2/7,3/1,4/4,5/3,6/8,7/6} {\n  \\draw[fill=paleblue,draw=navy] (\\i,0) rectangle +(0.68,0.52);\n  \\node[font=\\scriptsize] at (\\i+0.34,0.26) {\\v};\n}\n\\draw[blue!75!black,very thick] (1,-0.15) -- (5.7,-0.15);\n\\draw[orange!85!black,very thick] (1,-0.35) -- (4.7,-0.35);\n\\draw[orange!85!black,very thick] (2,-0.55) -- (5.7,-0.55);\n\\node[draw=none,fill=none,font=\\scriptsize] at (3.7,-1.05) {$\\min(st[k][l],st[k][r-2^k+1])$};\n\\end{tikzpicture}" },
  { key: "09-segment-tree-avancada/01-lazy", caption: "Tag pendente é aplicada aos filhos somente quando necessário", tikz: "\\begin{tikzpicture}[level distance=1.0cm,sibling distance=2.8cm,every node/.style={draw=navy,rounded corners=2pt,fill=paleblue,minimum width=12mm,minimum height=6mm,font=\\scriptsize},edge from parent/.style={draw=navylight,thick}]\n\\node[fill=cream] {$\\Sigma,\\ +5$}\n child {node {$\\Sigma_L$}}\n child {node {$\\Sigma_R$}};\n\\draw[->,gold,thick] (-0.35,-0.65) -- (-1.45,-1.2);\n\\draw[->,gold,thick] (0.35,-0.65) -- (1.45,-1.2);\n\\node[draw=none,fill=none,font=\\scriptsize] at (0,-2.0) {push: propagar a tag};\n\\end{tikzpicture}" },
  { key: "09-segment-tree-avancada/04-segment-tree-persistente", caption: "Versões compartilham subárvores não alteradas", tikz: "\\begin{tikzpicture}[level distance=0.9cm,sibling distance=2.2cm,every node/.style={draw=navy,rounded corners=2pt,fill=paleblue,minimum width=8mm,minimum height=5mm,font=\\scriptsize},edge from parent/.style={draw=navylight,thick}]\n\\node[fill=cream] {$v_0$}\n child {node {$A$}\n   child {node {$1$}}\n   child {node {$2$}}}\n child {node {$B$}\n   child {node {$3$}}\n   child {node {$4$}}};\n\\node[fill=cream] at (5,0) {$v_1$};\n\\node[fill=paleblue] at (4,-1) {$A'$};\n\\node at (6,-1) {$B$};\n\\draw[navylight,thick] (5,0) -- (4,-1);\n\\draw[navylight,thick] (5,0) -- (6,-1);\n\\draw[navylight,thick] (4,-1) -- (3,-2);\n\\draw[navylight,thick] (4,-1) -- (4.8,-2);\n\\draw[dashed,gold,thick] (6,-1) -- (6.8,-2);\n\\node[draw=none,fill=none,font=\\scriptsize] at (5,-2.7) {copia apenas o caminho alterado};\n\\end{tikzpicture}" }
];
