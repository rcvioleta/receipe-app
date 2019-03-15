const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')

const app = express()

const port = process.env.PORT || 3000

const file = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'myreceipe.json'
)

app.set('view engine', 'ejs')
app.set('views', 'view')

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/store', (req, res) => {
  const name = req.body.name
  const ingredients = req.body.ingredients
  const newReceipe = {
    name,
    ingredients
  }

  fs.readFile(file, (err, data) => {
    let receipe = []
    if (!err) {
      receipe = JSON.parse(data)
    }
    receipe.push(newReceipe)
    fs.writeFile(file, JSON.stringify(receipe), err => {
      if (!err) {
        res.status(200).json({
          message: 'Success'
        })
      }
    })
  })
})

app.get('/receipes', (req, res) => {
  fs.readFile(file, (err, data) => {
    if (!err) {
      res.status(200).json({
        body: JSON.parse(data)
      })
    }
  })
})

app.listen(port)