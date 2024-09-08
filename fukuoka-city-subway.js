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
            {s: '姪浜', s_k: '메이노하마', u: [64, 357], d: [64, 240]},
            {s: '室見', s_k: '무로미', u: [124, 357], d: [124, 240]},
            {s: '藤崎', s_k: '후지사키', u: [184, 357], d: [184, 240]},
            {s: '西新', s_k: '니시진', u: [243, 357], d: [243, 240]},
            {s: '唐人町', s_k: '토진마치', u: [301, 357], d: [301, 240]},
            {s: '大濠公園', s_k: '오호리코엔', u: [360, 357], d: [360, 240]},
            {s: '赤坂', s_k: '아카사카', u: [420, 357], d: [420, 240]},
            {s: '天神', s_k: '텐진', u: [480, 357], d: [480, 240]},
            {s: '中洲川端', s_k: '나카스카와바타', u:[539, 357], d: [539, 240]},
            {s: '祇園', s_k: '기온', u: [600, 357], d: [600, 240]},
            {s: '博多', s_k: '하카타', u: [658, 357], d: [658, 240]},
            {s: '東比恵', s_k: '히가시히에', u: [716, 357], d: [716, 240]},
            {s: '福岡空港', s_k: '후쿠오카 공항', u: [777, 357], d: [777, 240]},
        ];
        stas.H = [ //하코자키선
            {s: '中洲川端', s_k: '나카스카와바타', u: [539, 152], d: [539, 36]},
            {s: '呉服町', s_k: '고후쿠마치', u: [598, 152], d: [598, 36]},
            {s: '千代県庁口', s_k: '치요켄쵸구치', u: [658, 152], d: [658, 36]},
            {s: '馬出九大病院前', s_k: '마이다시큐다이뵤인마에', u: [717, 152], d: [717, 36]},
            {s: '箱崎宮前', s_k: '하코자키미야마에', u: [776, 152], d: [776, 36]},
            {s: '箱崎九大前', s_k: '하코자키큐다이마에', u: [836, 152], d: [836, 36]},
            {s: '貝塚', s_k: '카이즈카', u: [895, 152], d: [895, 36]}
        ];
        stas.N = [ //나나쿠마선
            {s: '橋本', s_k: '하시모토', u: [36, 320], d: [36, 205]},
            {s: '次郎丸', s_k: '지로마루', u: [88, 320], d: [88, 205]},
            {s: '賀茂', s_k: '카모', u: [141, 320], d: [141, 205]},
            {s: '野芥', s_k: '노케', u: [192, 320], d: [192, 205]},
            {s: '梅林', s_k: '우메바야시', u: [245, 320], d: [245, 205]},
            {s: '福大前', s_k: '후쿠다이마에', u: [297, 320], d: [297, 205]},
            {s: '七隈', s_k: '나나쿠마', u: [349, 320], d: [349, 205]},
            {s: '金山', s_k: '카나야마', u: [401, 320], d: [401, 205]},
            {s: '茶山', s_k: '차야마', u: [453, 320], d: [453, 205]},
            {s: '別府', s_k: '베후', u: [506, 320], d: [506, 205]},
            {s: '六本松', s_k: '롯폰마츠', u: [558, 320], d: [558, 205]},
            {s: '桜坂', s_k: '사쿠라자카', u: [611, 320], d: [611, 205]},
            {s: '薬院大通', s_k: '야쿠인오도리', u: [662, 320], d: [662, 205]},
            {s: '薬院', s_k: '야쿠인', u: [715, 320], d: [715, 205]},
            {s: '渡辺通', s_k: '와타나베도리', u: [767, 320], d: [767, 205]},
            {s: '天神南', s_k: '텐진미나미', u: [819, 320], d: [819, 205]},
            {s: '櫛田神社前', s_k: '쿠시다진자마에', u: [872, 320], d: [872, 205]},
            {s: '博多', s_k: '하카타', u: [923, 320], d: [923, 205]}
        ];

        if (!stas[lineCode]) return [];

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
            if (isTrain(map[e.u[1]][e.u[0] + 32])) {
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
            if (isTrain(map[e.d[1]][e.d[0] - 32])) {
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
