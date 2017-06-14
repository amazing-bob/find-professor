"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const axios_1 = require("axios");
const urls_1 = require("./urls");
const targetName = '고성택';
console.log(`-----------------START ------------------- totalCount:: ${urls_1.jejuUnivMajorUrls.length}`);
// url 로 html 페이지 가져오기
let getPage = (url, idx) => {
    console.log(url);
    return new Promise((resolve, reject) => {
        axios_1.default.get(url, { responseType: 'text' })
            .then(res => {
            console.log(`#${idx} [${res.status}] ${url}`);
            if (res && res.status === 200 && res.data) {
                let hasProfessorUrl = undefined;
                if (hasTargetProfessor(res.data, targetName)) {
                    hasProfessorUrl = url;
                }
                setTimeout(() => {
                    resolve(hasProfessorUrl);
                }, 1000);
            }
            else {
                setTimeout(() => {
                    reject(res);
                }, 1000);
            }
        })
            .catch(err => {
            console.error(`페이지 가져오기 실패!! [${idx}] ${url}`);
            console.error(err);
            reject(err);
        });
    });
};
// 대상 교수가 있는지 조회
let hasTargetProfessor = (body, targerName) => {
    let $ = cheerio.load(body);
    let professorsStr = $('div.professor_intro > dl > dt').text();
    console.log(professorsStr.indexOf(targetName) > -1);
    return (professorsStr.indexOf(targetName) > -1);
};
// async-await 로 각 url 순차적으로 호출
function getPages() {
    return __awaiter(this, void 0, void 0, function* () {
        let resultUrls = [];
        let url;
        for (let idx = 0; idx < urls_1.jejuUnivMajorUrls.length; idx++) {
            url = urls_1.jejuUnivMajorUrls[idx];
            try {
                let hasProfessorUrl = yield getPage(url, idx);
                if (hasProfessorUrl) {
                    resultUrls.push(hasProfessorUrl);
                }
            }
            catch (err) {
                console.error(err);
            }
        }
        console.log('-----------------END Result -------------------');
        console.log(`resultCount:: ${resultUrls.length}`);
        console.log(resultUrls);
        console.log('-----------------------------------------------');
    });
}
// 실행
getPages();
//# sourceMappingURL=app.js.map