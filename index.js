const parseString = require('xml2js').parseString;
const request = require('request');
const secret = require('./secret.json');
const express = require('express');
const app = express();

function requestCovid(url, queryParams) {
    return new Promise(
        function(resolve, reject) {
            let header = '';
            let body = '';
            request.get(url+queryParams, (covidErr, covidRes, covidBody)=> {
                if(covidErr) {
                    console.log(`covidErr => ${covidErr}`)
                } else if(covidRes.statusCode == 200) {
                    parseString(covidBody, function(parseErr, parseRes) {
                        let response = parseRes.response;
                        header = response.header;
                        body = response.body;
                        resolve(body);
                    }); 
                }
            })
        }
    )
}

app.get('/', function(req, res) {
    let url = 'http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson'; /*URL*/
    let queryParams = '?' + encodeURIComponent('ServiceKey') + '='+secret.covid19; /*Service Key*/
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1'); /*페이지 번호*/
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('10'); /*한 페이지 결과 수*/
    queryParams += '&' + encodeURIComponent('startCreateDt') + '=' + encodeURIComponent('20200310'); /*데이터 생성일 시작범위*/
    queryParams += '&' + encodeURIComponent('endCreateDt') + '=' + encodeURIComponent('20200315'); /*데이터 생성일 종료범위*/

    let getCovid = async function() { 
        res.json( await requestCovid(url, queryParams));
    }
    getCovid();
});

var port = 3000;
app.listen(port, function(){
    console.log('server on! http://localhost:'+port);
});