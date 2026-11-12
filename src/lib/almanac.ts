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

const extremos = String.raw`struct Node {
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
};`;

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
        if (p <= m) { int child = update(t[old].l,l,m,p,v); t[cur].l = child; }
        else { int child = update(t[old].r,m+1,r,p,v); t[cur].r = child; }
        t[cur].sum = t[t[cur].l].sum + t[t[cur].r].sum;
        return cur;
    }

    long long query(int x,long long l,long long r,long long a,long long b) {
        if (!x || b < l || r < a) return 0;
        if (a <= l && r <= b) return t[x].sum;
        int m = (l+r)/2;
        return query(t[x].l,l,m,a,b) + query(t[x].r,m+1,r,a,b);
    }

    // Versões de prefixo: retorna a posição do k-ésimo elemento em [l,r).
    int kth(int leftRoot,int rightRoot,int l,int r,long long k) const {
        if (l == r) return l;
        int m = (l+r)/2;
        long long left = t[t[rightRoot].l].sum - t[t[leftRoot].l].sum;
        if (k <= left)
            return kth(t[leftRoot].l,t[rightRoot].l,l,m,k);
        return kth(t[leftRoot].r,t[rightRoot].r,m+1,r,k-left);
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

    int kth(int l,int r,int k,const vector<int>& valores) {
        int lo = 0, hi = (int)valores.size()-1;
        while (lo < hi) {
            int m = (lo+hi)/2;
            if (count_le(l,r,valores[m],1,0,n-1) >= k) hi = m;
            else lo = m+1;
        }
        return valores[lo];
    }
};`;

const dynamic = String.raw`struct DynamicSegTree {
    struct Node { long long sum = 0; int l = 0, r = 0; };
    vector<Node> t = {Node()};
    static const long long LO = 0, HI = 1000000000000000000LL;

    int add(int x,long long l,long long r,long long p,long long v) {
        if (!x) { x = t.size(); t.push_back(Node()); }
        t[x].sum += v;
        if (l == r) return x;
        long long m = l + (r-l)/2;
        if (p <= m) {
            int child = add(t[x].l,l,m,p,v);
            t[x].l = child;
        } else {
            int child = add(t[x].r,m+1,r,p,v);
            t[x].r = child;
        }
        return x;
    }

    long long query(int x,long long l,long long r,long long a,long long b) {
        if (!x || b < l || r < a) return 0;
        if (a <= l && r <= b) return t[x].sum;
        long long m = l + (r-l)/2;
        return query(t[x].l,l,m,a,b)
             + query(t[x].r,m+1,r,a,b);
    }
};
// raiz começa em 0; raiz = add(raiz, LO, HI, pos, delta);`;

export const segmentTreeSheet: AlmanacSheet = {
  title: 'Segment Tree',
  subtitle: 'Consultas e atualizações em intervalos por decomposição hierárquica',
  facts: [
    'Construção: O(n) · consulta: O(log n) · atualização pontual: O(log n)',
    'Snippets C++ pressupõem #include <bits/stdc++.h> e using namespace std;',
    'Árvore recursiva: normalmente 4n posições; iterativa: 2n posições',
    'A operação de combinação deve ser associativa e possuir identidade para consultas iterativas',
    'Convenção desta ficha: índices zero-based e intervalos semiabertos [l,r), salvo indicação'
  ],
  formula: [
    'Pai: p · filhos: 2p e 2p+1 (árvore recursiva)',
    'Soma: combine(a,b)=a+b · identidade: 0',
    'Mínimo: combine(a,b)=min(a,b) · identidade: +∞',
    'Máximo: combine(a,b)=max(a,b) · identidade: −∞',
    'XOR: combine(a,b)=a XOR b · identidade: 0',
    'Prefixos: soma[l,r) = pref[r] − pref[l]',
    'Lazy + Soma: soma do nó += valor × comprimento do segmento',
    'Lazy + XOR: XOR do nó muda somente quando o comprimento é ímpar'
  ],
  entries: [
    { title:'Soma e consulta em intervalo', purpose:'Guardar a soma de cada segmento e responder consultas de soma.', complexity:'O(n) construção; O(log n) consulta e atualização pontual.', when:'Somas de intervalos com alterações pontuais.', notes:['Use 0 como identidade.','Para vetor estático, prefix sums respondem em O(1).'], code:soma },
    { title:'Mínimo/máximo com índice', purpose:'Retornar também a posição do mínimo e do máximo, não apenas seus valores.', complexity:'O(log n) por consulta.', when:'Encontrar índice do menor/maior elemento em um trecho.', notes:['Consulta e atualização usam intervalo inclusivo [l,r].','O merge preserva o primeiro índice em caso de empate.','query(l,r) retorna mínimo, máximo e as duas posições.'], code:extremos },
    { title:'XOR de intervalo', purpose:'Combinar os segmentos com XOR e atualizar um único elemento.', complexity:'O(log n) consulta e atualização pontual.', when:'XOR de intervalos com alterações pontuais.', notes:['Identidade: 0.','XOR de prefixos resolve consultas estáticas em O(1).'], code:xor },
    { title:'Lazy + Soma', purpose:'Adicionar v a todos os elementos de [l,r] e consultar a soma de qualquer intervalo.', complexity:'O(log n) por atualização e consulta.', when:'Range add + range sum.', notes:['Construa com st.build(a,1,0,n-1).','add(l,r,v) e query(l,r) usam [l,r] inclusivo.','Ao adicionar v em um nó de comprimento len, soma += v*len.','Tags de adição se compõem por soma.'], code:lazySoma },
    { title:'Lazy + XOR', purpose:'Aplicar XOR com uma máscara em todo o intervalo e consultar o XOR resultante.', complexity:'O(log n) por atualização e consulta.', when:'Inverter um ou vários bits em intervalo e consultar XOR.', notes:['Construa com st.build(a,1,0,n-1).','update(l,r,mask) e query(l,r) usam [l,r] inclusivo.','Se o tamanho do segmento é ímpar, seg ^= máscara.','Se é par, o XOR agregado não muda.','A tag se compõe por XOR.'], code:lazyXor },
    { title:'Persistente', purpose:'Criar uma nova raiz após cada atualização, preservando as versões anteriores por cópia dos nós alterados.', complexity:'O(log n) nós novos por atualização; O(log n) consulta.', when:'Consultas em versões anteriores, prefixos de versões ou comparar estados históricos.', notes:['Cada raiz identifica uma versão imutável.','update(raiz_antiga,0,n-1,pos,delta) devolve a nova raiz.','query(raiz,0,n-1,l,r) usa [l,r] inclusivo.','O exemplo soma deltas em uma posição; adapte a folha para atribuição quando necessário.'], code:persistente },
    { title:'Merge Sort Tree', purpose:'Guardar um vetor ordenado em cada nó para contar valores que satisfazem um limite dentro de [l,r].', complexity:'O(n log n) construção/memória; O(log² n) contagem; O(log U · log² n) k-ésimo valor.', when:'Contar elementos ≤ x ou encontrar o k-ésimo menor em um intervalo estático.', notes:['count_le(l,r,x,1,0,n-1) conta valores ≤ x em [l,r] inclusivo.','kth(l,r,k,valores) retorna o k-ésimo menor; k é 1-based e valores deve estar ordenado e sem duplicatas.','Cada consulta visita O(log n) nós e faz upper_bound em cada lista.','Atualizações não são baratas nesta estrutura.'], code:mergeSort },
    { title:'Dynamic', purpose:'Criar nós apenas nos caminhos efetivamente visitados, sem alocar toda a árvore do domínio.', complexity:'O(log U) por operação; memória proporcional aos nós criados.', when:'Domínio muito grande ou implícito, por exemplo coordenadas até 10⁹.', notes:['add(raiz,LO,HI,pos,delta) faz atualização pontual.','query(raiz,LO,HI,l,r) consulta [l,r] inclusivo.','Ajuste LO e HI ao domínio do problema.','Use índices de nós, não referências persistentes, para evitar invalidação por realocação do vector.'], code:dynamic }
  ]
};

const fenwickPoint = String.raw`struct Fenwick {
    int n;
    vector<long long> bit;

    Fenwick(int n) : n(n), bit(n+1,0) {}

    void add(int i,long long v) {
        for (++i; i <= n; i += i&-i) bit[i] += v;
    }

    long long sum(int i) {
        long long ans = 0;
        for (++i; i > 0; i -= i&-i) ans += bit[i];
        return ans;
    }

    long long query(int l,int r) {
        return sum(r) - (l ? sum(l-1) : 0);
    }
};`;

const fenwickKth = String.raw`struct Fenwick {
    int n;
    vector<int> bit;

    Fenwick(int n) : n(n), bit(n+1,0) {}

    void add(int i,int v) {
        for (++i; i <= n; i += i&-i) bit[i] += v;
    }

    int kth(int k) {
        int p = 0;
        for (int passo = 1 << (31-__builtin_clz(n)); passo; passo >>= 1) {
            int q = p + passo;
            if (q <= n && bit[q] < k) {
                p = q;
                k -= bit[q];
            }
        }
        return p; // índice zero-based do k-ésimo elemento
    }
};`;

const fenwickRangePoint = String.raw`struct Fenwick {
    int n;
    vector<long long> bit;

    Fenwick(int n) : n(n), bit(n+1,0) {}

    void add(int i,long long v) {
        for (++i; i <= n; i += i&-i) bit[i] += v;
    }

    long long sum(int i) {
        long long ans = 0;
        for (++i; i > 0; i -= i&-i) ans += bit[i];
        return ans;
    }

    void range_add(int l,int r,long long v) {
        add(l,v);
        if (r+1 < n) add(r+1,-v);
    }

    long long point(int i) { return sum(i); }
};`;

const fenwickRangeSum = String.raw`struct Fenwick {
    int n;
    vector<long long> bit;
    Fenwick(int n=0) : n(n), bit(n+1,0) {}
    void add(int i,long long v) {
        for (++i; i <= n; i += i&-i) bit[i] += v;
    }
    long long sum(int i) {
        long long s = 0;
        for (++i; i > 0; i -= i&-i) s += bit[i];
        return s;
    }
};

struct FenwickRange {
    int n;
    Fenwick b1, b2;
    FenwickRange(int n) : n(n), b1(n), b2(n) {}

    void add(int l,int r,long long v) {
        b1.add(l,v); b2.add(l,v*l);
        if (r+1 < n) {
            b1.add(r+1,-v);
            b2.add(r+1,-v*(r+1));
        }
    }

    long long prefix(int x) {
        if (x < 0) return 0;
        return b1.sum(x)*(x+1) - b2.sum(x);
    }

    long long query(int l,int r) {
        return prefix(r) - prefix(l-1);
    }
};`;

const fenwick2d = String.raw`struct Fenwick2D {
    int n,m;
    vector<vector<long long>> bit;

    Fenwick2D(int n,int m) : n(n),m(m),bit(n+1,vector<long long>(m+1)) {}

    void add(int x,int y,long long v) {
        for (int i=x+1;i<=n;i+=i&-i)
            for (int j=y+1;j<=m;j+=j&-j)
                bit[i][j] += v;
    }

    long long sum(int x,int y) {
        long long ans = 0;
        for (int i=x+1;i>0;i-=i&-i)
            for (int j=y+1;j>0;j-=j&-j)
                ans += bit[i][j];
        return ans;
    }

    long long query(int x1,int y1,int x2,int y2) {
        return sum(x2,y2)-sum(x1-1,y2)-sum(x2,y1-1)+sum(x1-1,y1-1);
    }
};`;

const sparseMin = String.raw`struct SparseTable {
    int n, LOG;
    vector<int> lg;
    vector<vector<int>> st;

    SparseTable(const vector<int>& a) {
        n = a.size();
        LOG = 32 - __builtin_clz(n);
        lg.assign(n+1,0);
        for (int i=2;i<=n;i++) lg[i]=lg[i/2]+1;
        st.assign(LOG,vector<int>(n));
        st[0]=a;
        for (int j=1;j<LOG;j++)
            for (int i=0;i+(1<<j)<=n;i++)
                st[j][i]=min(st[j-1][i],st[j-1][i+(1<<(j-1))]);
    }

    int query(int l,int r) { // [l,r] inclusivo
        int j=lg[r-l+1];
        return min(st[j][l],st[j][r-(1<<j)+1]);
    }
};`;

const disjointSparse = String.raw`template<class T,class F>
struct DisjointSparseTable {
    int n, LOG;
    vector<T> a;
    vector<vector<T>> st;
    F op;

    DisjointSparseTable(const vector<T>& a,F op) : n(a.size()),a(a),op(op) {
        LOG = n <= 1 ? 1 : 32-__builtin_clz(n-1);
        st.assign(LOG,vector<T>(n));
        for (int k=0;k<LOG;k++) {
            int len = 1<<(k+1), half = len>>1;
            for (int ini=0;ini<n;ini+=len) {
                int mid = min(ini+half,n), fim = min(ini+len,n);
                if (mid > ini) {
                    st[k][mid-1] = a[mid-1];
                    for (int i=mid-2;i>=ini;i--)
                        st[k][i] = op(a[i],st[k][i+1]);
                }
                if (mid < fim) {
                    st[k][mid] = a[mid];
                    for (int i=mid+1;i<fim;i++)
                        st[k][i] = op(st[k][i-1],a[i]);
                }
            }
        }
    }

    T query(int l,int r) {
        if (l==r) return a[l];
        int k = 31-__builtin_clz(l^r);
        return op(st[k][l],st[k][r]);
    }
};`;

const fenwickSheet: AlmanacSheet = {
  title: 'Fenwick Tree (BIT)',
  subtitle: 'Somas prefixadas com atualizações pontuais em tempo logarítmico',
  facts: [
    'Construção zerada: O(n) espaço; atualização e consulta de prefixo: O(log n)',
    'Snippets C++ pressupõem #include <bits/stdc++.h> e using namespace std;',
    'Índices externos zero-based; a árvore interna usa índices a partir de 1',
    'A operação clássica é soma, mas XOR também funciona com a mesma decomposição'
  ],
  formula: [
    'lowbit(i) = i & -i',
    'Atualização: i += lowbit(i)',
    'Consulta de prefixo: i -= lowbit(i)',
    'Soma[l,r] = prefix(r) − prefix(l−1)',
    'BIT de duas árvores: prefix(x) = sum(B1,x)·(x+1) − sum(B2,x)'
  ],
  entries: [
    { title:'Soma pontual e prefixo', purpose:'Adicionar valor em uma posição e consultar soma de prefixos ou intervalos.', complexity:'O(log n) por atualização e consulta.', when:'Soma dinâmica de intervalos com atualização pontual.', notes:['add(i,v) soma v em a[i].','query(l,r) usa intervalo inclusivo.','Se o vetor for estático, prefix sums são mais simples.'], code:fenwickPoint },
    { title:'K-ésimo elemento', purpose:'Encontrar a menor posição cujo prefixo acumulado alcança k.', complexity:'O(log n) por busca, usando descida binária na própria BIT.', when:'Frequências não negativas, seleção do k-ésimo elemento e ordem estatística.', notes:['k é 1-based e deve satisfazer 1 ≤ k ≤ soma total.','As frequências precisam ser não negativas.','O método retorna índice zero-based.'], code:fenwickKth },
    { title:'Atualização em intervalo e consulta pontual', purpose:'Adicionar v a todo [l,r] e recuperar o valor de uma posição.', complexity:'O(log n) por operação.', when:'Range add + point query.', notes:['Use um vetor de diferenças.','A atualização aplica +v em l e −v em r+1.','Intervalo inclusivo.'], code:fenwickRangePoint },
    { title:'Atualização e soma em intervalo', purpose:'Adicionar v em [l,r] e consultar a soma de qualquer intervalo.', complexity:'O(log n) por atualização e consulta, usando duas BITs.', when:'Range add + range sum.', notes:['B1 guarda diferenças; B2 guarda diferenças ponderadas pelo índice.','A fórmula do prefixo é B1(x)·(x+1)−B2(x).','Intervalos inclusivos.'], code:fenwickRangeSum },
    { title:'Fenwick 2D', purpose:'Atualizar uma célula e consultar soma de retângulos em uma matriz.', complexity:'O(log n · log m) por operação.', when:'Somas dinâmicas em submatrizes.', notes:['query(x1,y1,x2,y2) usa retângulo inclusivo.','Memória O(nm); para coordenadas esparsas, comprima ou use BIT 2D offline.'], code:fenwick2d }
  ]
};

const sparseTableSheet: AlmanacSheet = {
  title: 'Sparse Table',
  subtitle: 'Consultas estáticas por pré-processamento de blocos de potências de dois',
  facts: [
    'Construção: O(n log n) · memória: O(n log n)',
    'Sparse Table comum: O(1) para operações idempotentes como mínimo, máximo e gcd',
    'Não suporta atualização eficiente: qualquer alteração exige reconstrução',
    'Disjoint Sparse Table: O(1) para qualquer operação associativa, inclusive soma'
  ],
  formula: [
    'st[k][i] = op(st[k−1][i], st[k−1][i + 2^(k−1)])',
    'k = floor(log2(r−l+1))',
    'RMQ: min(st[k][l], st[k][r−2^k+1])',
    'DST: k = msb(l XOR r); resposta = op(st[k][l], st[k][r])'
  ],
  entries: [
    { title:'Mínimo/máximo estático', purpose:'Responder consultas de extremo em intervalos sem atualizações.', complexity:'O(n log n) construção; O(1) consulta.', when:'RMQ estática, mínimo, máximo ou gcd em muitos intervalos.', notes:['O código implementa mínimo; troque min por max ou gcd para outras operações idempotentes.','Consulta inclusiva [l,r].','Sobreposição dos blocos só é válida porque a operação é idempotente.'], code:sparseMin },
    { title:'Disjoint Sparse Table', purpose:'Responder consultas de qualquer operação associativa em intervalo estático.', complexity:'O(n log n) construção; O(1) consulta.', when:'Soma, XOR, concatenação ou outra operação associativa sem atualizações.', notes:['O intervalo é inclusivo [l,r].','A operação pode ser não comutativa; mantenha a ordem dos operandos.','Para n=1, query(0,0) retorna o próprio elemento.'], code:disjointSparse }
  ]
};


export const almanacSheets: AlmanacSheet[] = [segmentTreeSheet, fenwickSheet, sparseTableSheet];
