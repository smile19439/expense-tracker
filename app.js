const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'Production') {
  require('dotenv').config()
}

const routes = require('./routes')
const userPassport = require('./config/passport')
require('./config/mongoose')

const app = express()
const port = process.env.PORT

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

userPassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.error = req.flash('error')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`App is runing on http://localhost:${port}.`)
})