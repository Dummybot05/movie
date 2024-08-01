const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const ejs = require('ejs');
const wiki = require('wikipedia');
const data = require('./data.js');

app.set('view engine', 'ejs');
app.use(express.static('public'));

var links = data.links;
var actual = data.actual;
/*
var links = [
    'Godzilla_x_Kong:_The_New_Empire',
    'Kushi_(2023_film)',
    'Leo_(2023_Indian_film)'
];
var actual = {
    'Godzilla_x_Kong:_The_New_Empire' : [
      'https://1024terabox.com/sharing/embed?surl=_SIjnDU0Cvi9d5Kg_gpkZw&resolution=720&autoplay=true&mute=false&uk=4398578630871&fid=660742023789616&slid=',
      'https://www.youtube.com/watch?v=qqrpMRDuPfc',
      'https://1024terabox.com/s/155qDWD_Me3OfL_XAElCKog'
    ],
    'Kushi_(2023_film)': [
      'https://1024terabox.com/sharing/embed?surl=7-X8PBOqWTrwj10-jgHnVw&resolution=1080&autoplay=true&mute=false&uk=4398578630871&fid=862428064770165&slid=',
      'https://www.youtube.com/watch?v=AsvGScyj4gw',
      'https://1024terabox.com/s/1ryHvko7Qmu5kNHAu2JqnCA'
    ],
    'Leo_(2023_Indian_film)': [
      'https://1024terabox.com/sharing/embed?surl=73BBkSwE6-uLo6djsCLbAw&resolution=1080&autoplay=true&mute=false&uk=4398578630871&fid=328192136908308&slid=',
      'https://www.youtube.com/watch?v=ozRCVFgsrbY',
      'https://1024terabox.com/s/1nFQnHjz_erzn7lsPGPKTmg'
    ]
};
*/
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
    console.log(actual[ddd])
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
