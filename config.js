module.exports = {
  url: '', //пишем сюда, откуда будем тыкать на гиперссылки
  linkSelector: '', //селектор, по которому будут все нужные гиперссылки ('<a href="ololo">')
                                            //document.querySelectorAll('div.catalog__link a') так можно выполнить заранее
                                            //в браузере, чтобы понять, че будем цеплять
  fileName: './report.txt' // файл отчета
};