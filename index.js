const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync('./templates/overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/product.html', 'utf-8');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const cardsHtml = dataObj.map((obj) => replaceTemplate(tempCard, obj)).join('');
const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');

  const { query, pathname } = url.parse(req.url, true);

  switch (pathname) {
    case '/':
      res.end(output);
      break;
    case '/product':
      const product = dataObj[query.id];
      const outputTemp = replaceTemplate(tempProduct, product);
      res.end(outputTemp);
      break;
    case '/api':
      res.writeHead(200, {
        'Content-Type': 'application/json',
      });
      res.end(data);
      break;
    default:
      res.statusCode = 404;
      res.end('<h1>Page Not Found</h1>');
      break;
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is listening..');
});
