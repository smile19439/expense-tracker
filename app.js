const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')

const routes = require('./routes')
const userPassport = require('./config/passport')
require('./config/mongoose')

const app = express()
const port = 3000

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'secretNestEGG',
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

userPassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`App is runing on http://localhost:${port}.`)
})