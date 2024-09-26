const wiki = require('wikipedia');
const express = require('express');
const app = express();
const { dataMap, dataArray } = require('./data.js');
const path = require('path');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

const renderData = [];
dataArray.forEach(async item => {
  try {
    const page = await wiki.page(item.title);
    const summary = await page.summary();
    const infobox = await page.infobox();
    renderData.push([item, summary, infobox]);
 } catch (error) {
    console.log(error);
  }
})

app.get('/', (req, res) => {
  res.render('index.ejs', { data: renderData });
});


async function fetch2(index) {
  try {
    const page = await wiki.page(index);
    const summary = await page.summary();
    const infobox = await page.infobox();
    return [summary, infobox];
  } catch (error) {
    console.log(error);
  }
}


app.get('/:index', async (req, res) => {
  try {
    fetch2(req.params.index).then((data) => {
      res.render('show.ejs', { summary: data[0], infobox: data[1], actual: dataMap[req.params.index] });
    })
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => { console.log("Started..."); });
