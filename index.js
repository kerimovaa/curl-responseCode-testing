const rp = require('request-promise');
const cheerio = require('cheerio');
const assert = require('assert');
const fs = require('fs');

const urlHost = 'http://profi.ru/';
const urlPath = 'services/repetitor/'; //главный адрес, по которому собираем дочерние ссылки
const file = './report.txt'; // файл отчета
const linkSelector = 'div.catalog__link a'; //селектор, по которому собираем адреса тестируемых страниц
                                            //document.querySelectorAll('div.catalog__link a') так можно выполнить заранее
                                            //в браузере, чтобы понять, че будем цеплять
let testUrls = [];

const options = {
    uri: urlHost + urlPath,
    transform: function (body) {
        return cheerio.load(body);
    }
};

const getUrls = async function() {
  try {
    let $ = await rp(options);
    await $(linkSelector).map(function(i, el) {
      let testUrl = urlHost + $(this).attr('href');
      testUrls == '' ? testUrls = [testUrl] : testUrls.push(testUrl);
    });
    return testUrls;
  } catch(err) {
    throw new Error('Не удалось получить тело страницы по урлу ' + options.uri);
  }
}

const getStatusCode = async function(url) {
  try {
    let response = await rp({ uri: url, resolveWithFullResponse: true });
    let statusCode = response.statusCode;
    return statusCode;
  } catch(err) {
    throw new Error('Не удалось получить ответ на запрос по урлу ' + url);
  }
}

async function main() {
  fs.writeFileSync(file, '');
  let urls = await getUrls();
  for (let url of urls) {
    let code = await getStatusCode(url);
    console.log(`${url} - ${code}`);
    if (code != 100) {
      fs.appendFile(file, `Не получили 200 статус на ${url}, получили код - ${code}\n`, 'utf-8', (err) => {
        if (err) throw err;
      });
    }
  }
  console.log(`\x1b[1;32mОтчет сохранен в корне проекта, файл report.txt\x1b[0m`);
};

main();
