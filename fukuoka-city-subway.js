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
        
        var url = 'https://unkou.subway.city.fukuoka.lg.jp/unkou/PC_Kuhako.png';
        if (lineCode == 'N') url = 'https://unkou.subway.city.fukuoka.lg.jp/unkou/PC_Nanakuma.png';
        var image = await get_pixels(url);

        var map = [];
        var i = 0;
        for (var n = 0 ; n < image.shape[1]; n++) {
            map[n] = [];
        }
        for (var n = 0 ; n < image.shape[1]; n++) {
            for (var m = 0 ; m < image.shape[0]; m++) {
                map[n][m] = {
                    a: image.data[i + 3],
                    r: image.data[i],
                    g: image.data[i + 1],
                    b: image.data[i + 2]
                };
                i += 4;
            }
        }

        var stas = [];
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
            {s: '나카스카와바타', s_k: '中洲川端', u: [539, 152], d: [539, 36]},
            {s: '고후쿠마치', s_k: '呉服町', u: [598, 152], d: [598, 36]},
            {s: '치요켄쵸구치', s_k: '千代県庁口', u: [658, 152], d: [658, 36]},
            {s: '마이다시큐다이뵤인마에', s_k: '馬出九大病院前', u: [717, 152], d: [717, 36]},
            {s: '하코자키미야마에', s_k: '箱崎宮前', u: [776, 152], d: [776, 36]},
            {s: '하코자키큐다이마에', s_k: '箱崎九大前', u: [836, 152], d: [836, 36]},
            {s: '카이즈카', s_k: '貝塚', u: [895, 152], d: [895, 36]}   
        ];
        stas.N = [ //나나쿠마선
            {s: '하시모토', s_k: '橋本', u: [36, 320], d: [36, 205]},
            {s: '지로마루', s_k: '次郎丸', u: [88, 320], d: [88, 205]},
            {s: '카모', s_k: '賀茂', u: [141, 320], d: [141, 205]},
            {s: '노케', s_k: '野芥', u: [192, 320], d: [192, 205]},
            {s: '우메바야시', s_k: '梅林', u: [245, 320], d: [245, 205]},
            {s: '후쿠다이마에', s_k: '福大前', u: [297, 320], d: [297, 205]},
            {s: '나나쿠마', s_k: '七隈', u: [349, 320], d: [349, 205]},
            {s: '카나야마', s_k: '金山', u: [401, 320], d: [401, 205]},
            {s: '차야마', s_k: '茶山', u: [453, 320], d: [453, 205]},
            {s: '베후', s_k: '別府', u: [506, 320], d: [506, 205]},
            {s: '롯폰마츠', s_k: '六本松', u: [558, 320], d: [558, 205]},
            {s: '사쿠라자카', s_k: '桜坂', u: [611, 320], d: [611, 205]},
            {s: '야쿠인오도리', s_k: '薬院大通', u: [662, 320], d: [662, 205]},
            {s: '야쿠인', s_k: '薬院', u: [715, 320], d: [715, 205]},
            {s: '와타나베도리', s_k: '渡辺通', u: [767, 320], d: [767, 205]},
            {s: '텐진미나미', s_k: '天神南', u: [819, 320], d: [819, 205]},
            {s: '쿠시다진자마에', s_k: '櫛田神社前', u: [872, 320], d: [872, 205]},
            {s: '하카타', s_k: '博多', u: [923, 320], d: [923, 205]}
        ];

        var result = [];
        var result = [];
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

        console.log(JSON.stringify(result, null, 4));
        
        return result;
    }
    getTrainLocation('N');

    
    function isTrain(p) {
        if (p.r == 74 && p.g == 74 && p.b == 74) return true;
        if (p.r == 255 && p.g == 255 && p.b == 0) return true;
        return false;
    }

    module.export = getTrainLocation;
})();