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

    
    async function getTrainLocation() {
        var url = 'https://unkou.subway.city.fukuoka.lg.jp/unkou/PC_Kuhako.png';
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

        var stas = [
            //공항선
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

        var result = [];
        var result = [];
        stas.forEach((e, i) => {
            result[i] = {
                stn: {
                    ja: e.s,
                    ko: e.s_k
                },
                up: [],
                down: []
            }
        });
        stas.forEach((e, i) => {
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
    getTrainLocation();

    
    function isTrain(p) {
        if (p.r == 74 && p.g == 74 && p.b == 74) return true;
        if (p.r == 255 && p.g == 255 && p.b == 0) return true;
        return false;
    }

    module.export = getTrainLocation;
})();