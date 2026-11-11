export type AlmanacEntry = {
  title: string;
  purpose: string;
  complexity: string;
  when: string;
  notes: string[];
  code: string;
};

export type AlmanacSheet = {
  title: string;
  subtitle: string;
  facts: string[];
  formula: string[];
  entries: AlmanacEntry[];
};

const soma = String.raw`struct SegTree {
    int n;
    vector<long long> t;

    SegTree(const vector<long long>& a) {
        n = a.size();
        t.assign(2 * n, 0);
        for (int i = 0; i < n; i++) t[n+i] = a[i];
        for (int i = n-1; i; i--) t[i] = t[2*i] + t[2*i+1];
    }

    void set(int p, long long v) {
        for (t[p += n] = v; p > 1; p >>= 1)
            t[p>>1] = t[p] + t[p^1];
    }

    long long query(int l, int r) { // [l,r)
        long long ans = 0;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if (l & 1) ans += t[l++];
            if (r & 1) ans += t[--r];
        }
        return ans;
    }
};`;

const extremos = String.raw\`struct Node {
    long long mn, mx;
    int imn, imx;
};

Node merge(Node a, Node b) {
    Node c;
    if (a.mn <= b.mn) c.mn = a.mn, c.imn = a.imn;
    else c.mn = b.mn, c.imn = b.imn;
    if (a.mx >= b.mx) c.mx = a.mx, c.imx = a.imx;
    else c.mx = b.mx, c.imx = b.imx;
    return c;
}

struct SegTreeExtremos {
    int n;
    vector<Node> t;
    const long long INF = (1LL << 60);

    Node neutro() { return {INF, -INF, -1, -1}; }

    SegTreeExtremos(const vector<long long>& a) {
        n = a.size();
        t.assign(4*n, neutro());
        build(a,1,0,n-1);
    }

    void build(const vector<long long>& a,int x,int l,int r) {
        if (l == r) { t[x] = {a[l],a[l],l,l}; return; }
        int m = (l+r)/2;
        build(a,2*x,l,m);
        build(a,2*x+1,m+1,r);
        t[x] = merge(t[2*x],t[2*x+1]);
    }

    void set(int p,long long v,int x,int l,int r) {
        if (l == r) { t[x] = {v,v,l,l}; return; }
        int m = (l+r)/2;
        if (p <= m) set(p,v,2*x,l,m);
        else set(p,v,2*x+1,m+1,r);
        t[x] = merge(t[2*x],t[2*x+1]);
    }

    Node query(int a,int b,int x,int l,int r) {
        if (b < l || r < a) return neutro();
        if (a <= l && r <= b) return t[x];
        int m = (l+r)/2;
        return merge(query(a,b,2*x,l,m),
                     query(a,b,2*x+1,m+1,r));
    }

    void set(int p,long long v) { set(p,v,1,0,n-1); }
    Node query(int l,int r) { return query(l,r,1,0,n-1); }
};\`;

const xor = String.raw`struct SegTreeXor {
    int n;
    vector<int> t;

    SegTreeXor(const vector<int>& a) {
        n = a.size();
        t.assign(2*n, 0);
        for (int i = 0; i < n; i++) t[n+i] = a[i];
        for (int i = n-1; i; i--) t[i] = t[2*i] ^ t[2*i+1];
    }

    void set(int p, int v) {
        for (t[p += n] = v; p > 1; p >>= 1)
            t[p>>1] = t[p] ^ t[p^1];
    }

    int query(int l, int r) { // [l,r)
        int ans = 0;
        for (l += n, r += n; l < r; l >>= 1, r >>= 1) {
            if (l & 1) ans ^= t[l++];
            if (r & 1) ans ^= t[--r];
        }
        return ans;
    }
};`;

const lazySoma = String.raw`struct LazySum {
    int n;
    vector<long long> seg, lazy;

    LazySum(int n) : n(n), seg(4*n), lazy(4*n) {}

    void build(const vector<long long>& a, int x, int l, int r) {
        if (l == r) { seg[x] = a[l]; return; }
        int m = (l+r)/2;
        build(a, 2*x, l, m);
        build(a, 2*x+1, m+1, r);
        seg[x] = seg[2*x] + seg[2*x+1];
    }

    void apply(int x, int l, int r, long long v) {
        seg[x] += v * (r-l+1);
        lazy[x] += v;
    }

    void push(int x, int l, int r) {
        if (!lazy[x] || l == r) return;
        int m = (l+r)/2;
        apply(2*x, l, m, lazy[x]);
        apply(2*x+1, m+1, r, lazy[x]);
        lazy[x] = 0;
    }

    void add(int a, int b, long long v, int x, int l, int r) {
        if (b < l || r < a) return;
        if (a <= l && r <= b) { apply(x, l, r, v); return; }
        push(x, l, r);
        int m = (l+r)/2;
        add(a, b, v, 2*x, l, m);
        add(a, b, v, 2*x+1, m+1, r);
        seg[x] = seg[2*x] + seg[2*x+1];
    }

    long long query(int a, int b, int x, int l, int r) {
        if (b < l || r < a) return 0;
        if (a <= l && r <= b) return seg[x];
        push(x, l, r);
        int m = (l+r)/2;
        return query(a, b, 2*x, l, m) + query(a, b, 2*x+1, m+1, r);
    }

    void add(int l, int r, long long v) { add(l,r,v,1,0,n-1); }
    long long query(int l, int r) { return query(l,r,1,0,n-1); }
};`;

const lazyXor = String.raw`struct LazyXor {
    int n;
    vector<int> seg, lazy;

    LazyXor(int n) : n(n), seg(4*n), lazy(4*n) {}

    void build(const vector<int>& a, int x, int l, int r) {
        if (l == r) { seg[x] = a[l]; return; }
        int m = (l+r)/2;
        build(a,2*x,l,m);
        build(a,2*x+1,m+1,r);
        seg[x] = seg[2*x] ^ seg[2*x+1];
    }

    void apply(int x, int l, int r, int v) {
        if ((r-l+1)&1) seg[x] ^= v;
        lazy[x] ^= v;
    }

    void push(int x, int l, int r) {
        if (!lazy[x] || l == r) return;
        int m = (l+r)/2;
        apply(2*x,l,m,lazy[x]);
        apply(2*x+1,m+1,r,lazy[x]);
        lazy[x] = 0;
    }

    void update(int a, int b, int v, int x, int l, int r) {
        if (b < l || r < a) return;
        if (a <= l && r <= b) { apply(x,l,r,v); return; }
        push(x,l,r);
        int m = (l+r)/2;
        update(a,b,v,2*x,l,m);
        update(a,b,v,2*x+1,m+1,r);
        seg[x] = seg[2*x] ^ seg[2*x+1];
    }

    int query(int a, int b, int x, int l, int r) {
        if (b < l || r < a) return 0;
        if (a <= l && r <= b) return seg[x];
        push(x,l,r);
        int m = (l+r)/2;
        return query(a,b,2*x,l,m) ^ query(a,b,2*x+1,m+1,r);
    }

    void update(int l,int r,int v) { update(l,r,v,1,0,n-1); }
    int query(int l,int r) { return query(l,r,1,0,n-1); }
};`;

const persistente = String.raw`struct PersistentSegTree {
    struct Node { long long sum; int l, r; };
    vector<Node> t{{0,0,0}};
    int n;

    PersistentSegTree(int n) : n(n) {}

    int update(int old, int l, int r, int p, long long v) {
        int cur = t.size();
        t.push_back(t[old]);
        if (l == r) { t[cur].sum += v; return cur; }
        int m = (l+r)/2;
        if (p <= m) t[cur].l = update(t[old].l,l,m,p,v);
        else t[cur].r = update(t[old].r,m+1,r,p,v);
        t[cur].sum = t[t[cur].l].sum + t[t[cur].r].sum;
        return cur;
    }

    long long query(int x,int l,int r,int a,int b) {
        if (!x || b < l || r < a) return 0;
        if (a <= l && r <= b) return t[x].sum;
        int m = (l+r)/2;
        return query(t[x].l,l,m,a,b) + query(t[x].r,m+1,r,a,b);
    }
};
// raiz[0] = 0; raiz[i+1] = update(raiz[i], 0, n-1, pos, delta);`;

const mergeSort = String.raw`struct MergeSortTree {
    int n;
    vector<vector<int>> t;

    MergeSortTree(const vector<int>& a) {
        n = a.size();
        t.resize(4*n);
        build(a,1,0,n-1);
    }

    void build(const vector<int>& a,int x,int l,int r) {
        if (l == r) { t[x] = {a[l]}; return; }
        int m = (l+r)/2;
        build(a,2*x,l,m);
        build(a,2*x+1,m+1,r);
        merge(t[2*x].begin(),t[2*x].end(),
              t[2*x+1].begin(),t[2*x+1].end(),
              back_inserter(t[x]));
    }

    int count_le(int a,int b,int k,int x,int l,int r) {
        if (b < l || r < a) return 0;
        if (a <= l && r <= b)
            return upper_bound(t[x].begin(),t[x].end(),k)-t[x].begin();
        int m = (l+r)/2;
        return count_le(a,b,k,2*x,l,m)
             + count_le(a,b,k,2*x+1,m+1,r);
    }
};`;

const dynamic = String.raw\`struct DynamicSegTree {
    struct Node { long long sum = 0; int l = 0, r = 0; };
    vector<Node> t = {Node()};
    static const int LO = 0, HI = 1000000000;

    int add(int x,int l,int r,int p,long long v) {
        if (!x) { x = t.size(); t.push_back(Node()); }
        t[x].sum += v;
        if (l == r) return x;
        int m = l + (r-l)/2;
        if (p <= m) {
            int child = add(t[x].l,l,m,p,v);
            t[x].l = child;
        } else {
            int child = add(t[x].r,m+1,r,p,v);
            t[x].r = child;
        }
        return x;
    }

    long long query(int x,int l,int r,int a,int b) {
        if (!x || b < l || r < a) return 0;
        if (a <= l && r <= b) return t[x].sum;
        int m = l + (r-l)/2;
        return query(t[x].l,l,m,a,b)
             + query(t[x].r,m+1,r,a,b);
    }
};
// raiz começa em 0; raiz = add(raiz, LO, HI, pos, delta);\`;

export const segmentTreeSheet: AlmanacSheet = {
  title: 'Segment Tree',
  subtitle: 'Consultas e atualizações em intervalos por decomposição hierárquica',
  facts: [
    'Construção: O(n) · consulta: O(log n) · atualização pontual: O(log n)',
    'Árvore recursiva: normalmente 4n posições; iterativa: 2n posições',
    'A operação de combinação deve ser associativa e possuir identidade para consultas iterativas',
    'Convenção desta ficha: índices zero-based e intervalos semiabertos [l,r), salvo indicação'
  ],
  formula: [
    'Pai: p · filhos: 2p e 2p+1 (árvore recursiva)',
    'Soma: combine(a,b)=a+b · identidade: 0',
    'Mínimo: combine(a,b)=min(a,b) · identidade: +∞',
    'Máximo: combine(a,b)=max(a,b) · identidade: −∞',
    'XOR: combine(a,b)=a XOR b · identidade: 0'
  ],
  entries: [
    { title:'Soma', purpose:'Guardar a soma de cada segmento e responder consultas de soma.', complexity:'O(n) construção; O(log n) consulta e atualização pontual.', when:'Somas de intervalos com alterações pontuais.', notes:['Use 0 como identidade.','Para vetor estático, prefix sums respondem em O(1).'], code:soma },
    { title:'Soma em intervalo', purpose:'Consultar a soma em [l,r) combinando os nós que cobrem o intervalo.', complexity:'O(log n) por consulta.', when:'Muitas consultas de soma com atualizações pontuais.', notes:['O método query retorna a soma em [l,r), com r exclusivo.','set(p,v) faz atualização pontual.','Se não houver atualizações, prefira prefix sums.'], code:soma },
    { title:'Mínimo/máximo', purpose:'Substituir a soma por min ou max; o nó guarda o extremo do segmento.', complexity:'O(log n) consulta e atualização pontual.', when:'RMQ dinâmica ou consultas de máximo/mínimo.', notes:['Identidade do mínimo: +∞.','Identidade do máximo: −∞.'], code:extremos },
    { title:'Extremos de intervalo', purpose:'Retornar também a posição do mínimo e do máximo, não apenas seus valores.', complexity:'O(log n) por consulta.', when:'Encontrar índice do menor/maior elemento em um trecho.', notes:['Consulta e atualização usam intervalo inclusivo [l,r].','O merge preserva o primeiro índice em caso de empate.','query(l,r) retorna mínimo, máximo e as duas posições.'], code:extremos },
    { title:'XOR', purpose:'Combinar os segmentos com XOR e atualizar um único elemento.', complexity:'O(log n) consulta e atualização pontual.', when:'XOR de intervalos com alterações pontuais.', notes:['Identidade: 0.','XOR de prefixos resolve consultas estáticas em O(1).'], code:xor },
    { title:'XOR em intervalo', purpose:'Calcular XOR de todos os elementos de [l,r).', complexity:'O(log n) por consulta.', when:'Consultas XOR com atualizações pontuais.', notes:['O código usa intervalo semiaberto.','Não confunda com maximizar XOR entre dois valores; para isso, use Trie binária.'], code:xor },
    { title:'Lazy Propagation', purpose:'Adiar atualizações completas de segmentos até que seja necessário visitar seus filhos.', complexity:'O(log n) por atualização/consulta em operações compatíveis.', when:'Uma atualização afeta muitos elementos e consultas continuam sendo feitas.', notes:['Defina como a tag se compõe com outra tag.','Defina como a tag transforma o agregado do nó.'], code:lazySoma },
    { title:'Atualização em intervalo', purpose:'Aplicar uma alteração em todos os elementos de [l,r) sem visitar cada posição.', complexity:'O(log n) por operação com lazy propagation.', when:'Range add, range assign ou outras atualizações que admitem composição.', notes:['O exemplo implementa adição em intervalo inclusivo [l,r].','A função apply atualiza o agregado e a tag pendente.','A tag deve representar uma transformação que possa ser composta.'], code:lazySoma },
    { title:'Lazy + Soma', purpose:'Adicionar v a todos os elementos de [l,r) e consultar a soma de qualquer intervalo.', complexity:'O(log n) por atualização e consulta.', when:'Range add + range sum.', notes:['Construa com st.build(a,1,0,n-1).','add(l,r,v) e query(l,r) usam [l,r] inclusivo.','Ao adicionar v em um nó de comprimento len, soma += v*len.','Tags de adição se compõem por soma.'], code:lazySoma },
    { title:'Lazy + XOR', purpose:'Aplicar XOR com uma máscara em todo o intervalo e consultar o XOR resultante.', complexity:'O(log n) por atualização e consulta.', when:'Inverter um ou vários bits em intervalo e consultar XOR.', notes:['Construa com st.build(a,1,0,n-1).','update(l,r,mask) e query(l,r) usam [l,r] inclusivo.','Se o tamanho do segmento é ímpar, seg ^= máscara.','Se é par, o XOR agregado não muda.','A tag se compõe por XOR.'], code:lazyXor },
    { title:'Persistente', purpose:'Criar uma nova raiz após cada atualização, preservando as versões anteriores por cópia dos nós alterados.', complexity:'O(log n) nós novos por atualização; O(log n) consulta.', when:'Consultas em versões anteriores, prefixos de versões ou comparar estados históricos.', notes:['Cada raiz identifica uma versão imutável.','update(raiz_antiga,0,n-1,pos,delta) devolve a nova raiz.','query(raiz,0,n-1,l,r) usa [l,r] inclusivo.','O exemplo soma deltas em uma posição; adapte a folha para atribuição quando necessário.'], code:persistente },
    { title:'Merge Sort Tree', purpose:'Guardar um vetor ordenado em cada nó para contar valores que satisfazem um limite dentro de [l,r].', complexity:'O(n log n) construção e memória; O(log² n) consulta.', when:'Contar elementos ≤ x, k-ésimo valor (com busca binária) ou estatísticas de ordem em intervalo estático.', notes:['count_le(l,r,x,1,0,n-1) conta valores ≤ x em [l,r] inclusivo.','Cada consulta visita O(log n) nós e faz upper_bound em cada lista.','Atualizações não são baratas nesta estrutura.'], code:mergeSort },
    { title:'Dynamic', purpose:'Criar nós apenas nos caminhos efetivamente visitados, sem alocar toda a árvore do domínio.', complexity:'O(log U) por operação; memória proporcional aos nós criados.', when:'Domínio muito grande ou implícito, por exemplo coordenadas até 10⁹.', notes:['add(raiz,LO,HI,pos,delta) faz atualização pontual.','query(raiz,LO,HI,l,r) consulta [l,r] inclusivo.','Ajuste LO e HI ao domínio do problema.','Use índices de nós, não referências persistentes, para evitar invalidação por realocação do vector.'], code:dynamic }
  ]
};
