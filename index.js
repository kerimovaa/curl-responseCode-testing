const rp = require('request-promise');
const cheerio = require('cheerio');
const assert = require('assert');
const fs = require('fs');
const config = require('./config.js');
const URL = require('url').URL;

let testUrls = [];
const urlHost = new URL(config.url).origin;

const options = {
    uri: config.url,
    transform: function (body) {
        return cheerio.load(body);
    }
};

const getBody = async function() {
  try {
    let $ = await rp(options);
    return $;
  } catch(err) {
    throw new Error('Не удалось получить тело страницы по урлу ' + options.uri);
  }
}

const getUrls = async function($) {
  try {
    await $(config.linkSelector).map(function(i, el) {
      let path = $(this).attr('href');
      if(path) {
        let testUrl = urlHost + path;
        testUrls == '' ? testUrls = [testUrl] : testUrls.push(testUrl);
      } else {
        throw new Error('0');
      }
    });
    return testUrls;
  } catch(err) {
    throw new Error('Некорректный селектор до гиперссылки, нет аттрибута href по селектору ' + config.linkSelector);
  }
}

const getStatusCode = async function(url) {
  try {
    let response = await rp({ uri: url, resolveWithFullResponse: true });
    return response.statusCode;
  } catch(e) {
    return null;
  }
}

const main = async function() {
  fs.writeFileSync(config.fileName, '');
  if(config.url && config.linkSelector) {
    var cheerio = await getBody();
    var urls = await getUrls(cheerio);
  }
  else
    throw new Error('Не указан адрес/селектор в конфиге');
  for (let url of urls) {
    let code = await getStatusCode(url);
    console.log(`${url} - ${code}`);
    if (code && code != 200) {
      fs.appendFile(config.fileName, `Не получили 200 статус на ${url}, получили код - ${code}\n`, 'utf-8', (err) => {
        if (err) throw err;
      });
    } else if (code == null){
      fs.appendFile(config.fileName, `На ${url} не смогли получить статус страницы\n`, 'utf-8', (err) => {
        if (err) throw err;
      });
    }
  }
  console.log(`\x1b[1;32mОтчет сохранен в корне проекта, файл report.txt\x1b[0m`);
};

main();

process.once('unhandledRejection', async error => {
  console.error(error);
  process.exit(-1);
});
