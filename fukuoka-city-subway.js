(function() {
    const getPixels = require('get-pixels');
    function get_pixels(url) {  //콜백을 동기로 변경
        return new Promise((resolve, reject) => {
            getPixels(url, (err, pixels) => {
                if (err) reject(err);
                else resolve(pixels);
            });
        });
    }

    
    async function getTrainLocation(lineCode) {
        //A 공항선, H 하코자키선, N 나나쿠마선
        
        let url = 'https://unkou.subway.city.fukuoka.lg.jp/unkou/PC_Kuhako.png';
        if (lineCode == 'N') url = 'https://unkou.subway.city.fukuoka.lg.jp/unkou/PC_Nanakuma.png';
        const image = await get_pixels(url);

        const map = [];
        let i = 0;
        for (let n = 0 ; n < image.shape[1]; n++) {
            map[n] = [];
        }
        for (let n = 0 ; n < image.shape[1]; n++) {
            for (let m = 0 ; m < image.shape[0]; m++) {
                map[n][m] = {
                    a: image.data[i + 3],
                    r: image.data[i],
                    g: image.data[i + 1],
                    b: image.data[i + 2]
                };
                i += 4;
            }
        }

        const stas = [];
        stas.A = [ //공항선
            {s: '姪浜', s_k: '메이노하마', u: [128, 712], d: [128, 430]},
            {s: '室見', s_k: '무로미', u: [248, 712], d: [248, 430]},
            {s: '藤崎', s_k: '후지사키', u: [366, 712], d: [366, 430]},
            {s: '西新', s_k: '니시진', u: [485, 712], d: [485, 430]},
            {s: '唐人町', s_k: '토진마치', u: [603, 712], d: [603, 430]},
            {s: '大濠公園', s_k: '오호리코엔', u: [722, 712], d: [722, 430]},
            {s: '赤坂', s_k: '아카사카', u: [840, 712], d: [840, 430]},
            {s: '天神', s_k: '텐진', u: [959, 712], d: [959, 430]},
            {s: '中洲川端', s_k: '나카스카와바타', u:[1078, 712], d: [1078, 430]},
            {s: '祇園', s_k: '기온', u: [1179, 712], d: [1179, 430]},
            {s: '博多', s_k: '하카타', u: [1315, 712], d: [1315, 430]},
            {s: '東比恵', s_k: '히가시히에', u: [1434, 712], d: [1434, 430]},
            {s: '福岡空港', s_k: '후쿠오카 공항', u: [1552, 712], d: [1552, 430]},
        ];
        stas.H = [ //하코자키선
            {s: '中洲川端', s_k: '나카스카와바타', u: [1078, 301], d: [1078, 19]},
            {s: '呉服町', s_k: '고후쿠마치', u: [1179, 301], d: [1179, 19]},
            {s: '千代県庁口', s_k: '치요켄쵸구치', u: [1315, 301], d: [1315, 19]},
            {s: '馬出九大病院前', s_k: '마이다시큐다이뵤인마에', u: [1434, 301], d: [1434, 19]},
            {s: '箱崎宮前', s_k: '하코자키미야마에', u: [1552, 301], d: [1552, 19]},
            {s: '箱崎九大前', s_k: '하코자키큐다이마에', u: [1671, 301], d: [1671, 19]},
            {s: '貝塚', s_k: '카이즈카', u: [1790, 301], d: [1790, 19]}
        ];
        stas.N = [ //나나쿠마선
            {s: '橋本', s_k: '하시모토', u: [71, 712], d: [71, 430]},
            {s: '次郎丸', s_k: '지로마루', u: [176, 712], d: [176, 430]},
            {s: '賀茂', s_k: '카모', u: [350, 712], d: [350, 430]},
            {s: '野芥', s_k: '노케', u: [384, 712], d: [384, 430]},
            {s: '梅林', s_k: '우메바야시', u: [489, 712], d: [489, 430]},
            {s: '福大前', s_k: '후쿠다이마에', u: [594, 712], d: [594, 430]},
            {s: '七隈', s_k: '나나쿠마', u: [698, 712], d: [698, 430]},
            {s: '金山', s_k: '카나야마', u: [803, 712], d: [803, 430]},
            {s: '茶山', s_k: '차야마', u: [907, 712], d: [907, 430]},
            {s: '別府', s_k: '베후', u: [1012, 712], d: [1012, 430]},
            {s: '六本松', s_k: '롯폰마츠', u: [1116, 712], d: [1116, 430]},
            {s: '桜坂', s_k: '사쿠라자카', u: [1220, 712], d: [1220, 430]},
            {s: '薬院大通', s_k: '야쿠인오도리', u: [1325, 712], d: [1325, 430]},
            {s: '薬院', s_k: '야쿠인', u: [1429, 712], d: [1429, 430]},
            {s: '渡辺通', s_k: '와타나베도리', u: [1534, 712], d: [1534, 430]},
            {s: '天神南', s_k: '텐진미나미', u: [1638, 712], d: [1638, 430]},
            {s: '櫛田神社前', s_k: '쿠시다진자마에', u: [1743, 712], d: [1743, 430]},
            {s: '博多', s_k: '하카타', u: [1847, 712], d: [1847, 205]}
        ];

        if (!stas[lineCode]) return [];

        const diff = {
            A: 64,
            H: 64,
            N: 56
        };

        const result = [];
        stas[lineCode].forEach((e, i) => {
            result[i] = {
                stn: {
                    ja: e.s,
                    ko: e.s_k
                },
                up: [],
                down: []
            }
        });
        stas[lineCode].forEach((e, i) => {
            if (isTrain(map[e.u[1]][e.u[0]])) {
                if (result[i]['up'] == undefined) result[i]['up'] = [];
                result[i]['up'].push({
                    sts: '도착',
                    type: 0
                });
            }
            if (isTrain(map[e.u[1]][e.u[0] + diff[lineCode]])) {
                if (result[i]['up'] == undefined) result[i]['up'] = [];
                result[i]['up'].push({
                    sts: '접근',
                    type: 0
                });
            }
        
            if (isTrain(map[e.d[1]][e.d[0]])) {
                if (result[i]['dn'] == undefined) result[i]['dn'] = [];
                result[i]['dn'].push({
                    sts: '도착',
                    type: 0
                });
            }
            if (isTrain(map[e.d[1]][e.d[0] - diff[lineCode]])) {
                if (result[i]['dn'] == undefined) result[i]['dn'] = [];
                result[i]['dn'].push({
                    sts: '접근',
                    type: 0
                });
            }
        });

        // console.log(JSON.stringify(result, null, 4));
        
        return result;
    }

    
    function isTrain(p) {
        if (p.r == 74 && p.g == 74 && p.b == 74) return true;
        if (p.r == 255 && p.g == 255 && p.b == 0) return true;
        return false;
    }

    module.exports = getTrainLocation;
})();
