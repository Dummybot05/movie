const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const wiki = require('wikipedia');
const data = require('./data.js');

app.set('view engine', 'ejs');
app.use(express.static('public'));

var links = data.links;
var actual = data.actual;

app.get('/', async (req, res) => {
  const data = [];
  const fetchDataPromises = links.map(async (itms) => {
    try {
      const page = await wiki.page(itms);
      const summary = await page.summary();
      const infobox = await page.infobox();
      return [itms, summary, infobox];
    } catch (error) {
      console.log(error);
      return [itms, 'Error fetching data', 'Error fetching data'];
    }
  });

  try {
    const results = await Promise.all(fetchDataPromises);
    res.render('index.ejs', { list: results });
  } catch (error) {
    console.log('Error processing data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/:index', async (req, res) => {
  try {
    const page = await wiki.page(req.params.index);
    const summary = await page.summary();
    const infobox = await page.infobox();
    let ddd = req.params.index;
    res.render('show.ejs', {
      actual: actual[ddd],
      path: req.params.index,
      summary: summary,
      infobox: infobox
    });
  } catch (error) {
    console.error('Error fetching page data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => { console.log("Started..."); });
