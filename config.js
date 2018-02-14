module.exports = {
  urlHost: '', //сюда указать хост
  urlPath:'', //главный путь, по которому собираем дочерние ссылки
  fileName: './report.txt', // файл отчета
  linkSelector: 'div.catalog__link a' //селектор, по которому собираем адреса тестируемых страниц
                                            //document.querySelectorAll('div.catalog__link a') так можно выполнить заранее
                                            //в браузере, чтобы понять, че будем цеплять
};