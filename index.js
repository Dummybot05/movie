const wiki = require('wikipedia');
const express = require('express');
const app = express();
const data = require('./data.js');
const path = require('path');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const renderData = [];
data.data.map(async (item) => {
  try {
    const page = await wiki.page(item[0]);
    const summary = await page.summary();
    const infobox = await page.infobox();
    renderData.push([item, summary, infobox]);
    console.log(renderData[renderData.length - 1][0]["Leo_(2023_Indian_film)"]);
  } catch (error) {
    console.log(error);
  }
})

app.get('/', (req, res) => {
  res.render('index.ejs', { data: renderData });
  
});

renderData.map((item) => {
  console.log(item);
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
      res.render('show.ejs', { summary: data[0], infobox: data[1], actual: renderData[req.params.index] });
    });
  } catch (error) {
    console.log(error);
  }
});



app.listen(PORT, () => { console.log("Started..."); });
