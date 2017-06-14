import { _ } from "lodash";
import * as cheerio from "cheerio";
import axios from "axios";
import request from "request";

import {  jejuUnivMajorUrls } from "./urls";

const targetName: string = '고성택';

console.log(`-----------------START ------------------- totalCount:: ${jejuUnivMajorUrls.length}`);


// url 로 html 페이지 가져오기
let getPage = (url: string, idx: number): Promise<any> => {
  console.log(url);

    return new Promise((resolve, reject) => {
      axios.get(url, {responseType: 'text'})
        .then(res => {
          console.log(`[${res.status}] ${url}`);
          if (res && res.status === 200 && res.data) {
            let hasProfessorUrl = undefined;
            if (hasTargetProfessor(res.data, targetName)) {
              hasProfessorUrl = url;
            }
            setTimeout(() => {
              resolve(hasProfessorUrl);
            }, 1000);

          } else {
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
let hasTargetProfessor = (body: string, targerName: string): boolean => {
  let $ = cheerio.load(body);
  let professorsStr = $('div.professor_intro > dl > dt').text();
  console.log(professorsStr.indexOf(targetName) > -1);
  return (professorsStr.indexOf(targetName) > -1);
};


// async-await 로 각 url 순차적으로 호출
async function getPages() {
  let resultUrls: Array<string> = [];
  let url;
  for (let idx = 0; idx < jejuUnivMajorUrls.length; idx++) {
    url = jejuUnivMajorUrls[idx];
    try {
      let hasProfessorUrl = await getPage(url, idx);
      if (hasProfessorUrl) {
        resultUrls.push(hasProfessorUrl);
      }

    } catch(err) {
      console.error(err);
    }
  }

  console.log('-----------------END Result -------------------');
  console.log(`resultCount:: ${resultUrls.length}`);
  console.log(resultUrls);
  console.log('-----------------------------------------------');
}

// 실행
getPages();
