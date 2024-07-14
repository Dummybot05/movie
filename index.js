const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/movies', (req, res) => {
    res.render('movies')
})

app.listen(PORT, () => console.log('Started..'))
