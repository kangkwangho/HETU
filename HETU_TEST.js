const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 7777;

app.set('view engine', 'pug');
app.set('views', './src/pug');

app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.locals.pretty = true;

app.get('/', (req, res) => {
    res.render('HETU_P');
});
app.listen(PORT, () => {
    console.log(PORT + " START!!");
});

//movePod
function movePod(value, value2) {
    let now = Date.now();

    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, ''); //단순 시간

    //TES control, 엘레베이터 가능
    const options_status = {
        hostname: '192.168.0.10',
        path: '/tes/apiv2/newMovePodTask',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    //json data send
    let request_movePod = {
        WarehouseID: "HETU",
        RequestID: `${now}`,
        RequestTime: `${formattedDate}`,
        ClientCode: 'BIZ',
        RobotID:101,
        SrcType: 1,
        PodID: `${value}`,
        DesType: 7,
        extParams: { 'unLoad': 1 },
        candidateStorageIDs: `${value2}`,
        //desStationCodes: "1.14"
        //desStorageID: `${value2}`                   //DesType: 2
        //desZoneCode: `${value2}`,             //XD5
        //desNodeID: `${value2}`
    }
    /*
    //개인 컨트롤, 같은 맵만 가능(엘레베이터 안됨)
        const options_status = {
            hostname: '192.168.0.10',
            path: '/tes/apiv2/movePod',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            }
        }
    
        //json data send
        let request_movePod = {
            WarehouseID: "HETU", //첫글자 대문자 구분해야함...
            requestID: `${now}`,
            requestTime: `${formattedDate}`, 
            ClientCode: 'SUPER',
            RobotID: '101',
            SrcType: 1,
            podID: `${value}`,
            extParams: { "unLoad": 1 },
            DesType: 1,
            desNodeID: '1.13',
            //AutoToRest: 1
        }
    */
    let req = http.request(options_status, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
            responseData += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('요청이 성공하였습니다. 상태 코드:');
                console.log('메시지:');
                console.log(responseData);
            } else {
                console.log('요청이 실패하였습니다. 상태 코드:', res.statusCode);
                console.log('에러 메시지:');
                console.log(responseData);
            }
        });
    });

    req.on('error', (error) => {
        console.error('요청 중 오류가 발생하였습니다:', error);
    });
    req.write(JSON.stringify(request_movePod));
    req.end();
}

app.post('/movePod', (req, res) => {
    let podID = req.body.podID;
    let andPoint = req.body.andPoint;
    console.log(andPoint);
    movePod(podID, andPoint);
});