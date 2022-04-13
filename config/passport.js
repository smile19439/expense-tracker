const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({ usernameField: 'accountId' }, (accountId, password, done) => {
    User.findOne({ accountId })
      .then(user => {
        if (!user) {
          return done(null, false, { message: '查無此帳號，請確認有無輸入錯誤！' })
        }

        return bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return done(null, false, { message: '密碼錯誤！' })
            }
            return done(null, user)
          })
      })
      .catch(err => done(err))
  }))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        done(null, user)
      })
      .catch(err => done(err))
  })
}
