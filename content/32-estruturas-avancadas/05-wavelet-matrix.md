---
title: Wavelet Matrix
summary: Estrutura estática compacta para k-ésimo menor e contagem em intervalos por bits.
status: done
complexity: O(log sigma) por consulta; O(n log sigma) memória
tags: wavelet matrix, range kth, bitwise
---

## Quando usar

Como alternativa à Wavelet Tree para consultas estáticas de ordem estatística. A Wavelet Matrix particiona por bits e armazena prefixos de zeros em cada nível.

## Código

Valores não negativos menores que 2^LOG. Intervalos [l,r), k 1-based.

~~~cpp
struct WaveletMatrix {
    int n, LOG;
    vector<vector<int>> pref;
    vector<int> mid;

    WaveletMatrix(vector<int> a, int LOG) : n(a.size()), LOG(LOG) {
        pref.resize(LOG);
        mid.resize(LOG);
        for (int lv = 0; lv < LOG; lv++) {
            int bit = LOG - 1 - lv;
            pref[lv].assign(n + 1, 0);
            vector<int> zero, one;
            for (int i = 0; i < n; i++) {
                bool b = (a[i] >> bit) & 1;
                pref[lv][i + 1] = pref[lv][i] + !b;
                (b ? one : zero).push_back(a[i]);
            }
            mid[lv] = zero.size();
            zero.insert(zero.end(), one.begin(), one.end());
            a.swap(zero);
        }
    }

    int kth(int l, int r, int k) const {
        int ans = 0;
        for (int lv = 0; lv < LOG; lv++) {
            int zl = pref[lv][l], zr = pref[lv][r];
            int cnt0 = zr - zl;
            if (k <= cnt0) {
                l = zl; r = zr;
            } else {
                ans |= 1 << (LOG - 1 - lv);
                k -= cnt0;
                l = mid[lv] + (l - zl);
                r = mid[lv] + (r - zr);
            }
        }
        return ans;
    }

    int count_less(int l, int r, int x) const {
        if (x <= 0) return 0;
        if (x >= (1 << LOG)) return r - l;
        int ans = 0;
        for (int lv = 0; lv < LOG; lv++) {
            int bit = LOG - 1 - lv;
            int zl = pref[lv][l], zr = pref[lv][r];
            if ((x >> bit) & 1) {
                ans += zr - zl;
                l = mid[lv] + (l - zl);
                r = mid[lv] + (r - zr);
            } else {
                l = zl; r = zr;
            }
        }
        return ans;
    }
};
~~~

## Cuidados

- Todos os valores devem estar no intervalo [0, 2^LOG).
- kth exige 0 <= l < r <= n e 1 <= k <= r-l.
- count_less retorna quantos valores são estritamente menores que x.
- Para valores signed, faça uma transformação de ordem (por exemplo, inverter o bit de sinal) antes de construir.
- Estrutura estática: qualquer atualização exige reconstrução.
