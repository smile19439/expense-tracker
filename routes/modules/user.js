const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const passport = require('passport')

const { checkLoginValue } = require('../../middleware/auth')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', checkLoginValue, passport.authenticate('local', {
  successRedirect: '/',
  failureFlash: true,
  failureRedirect: '/user/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, accountId, password, ConfirmPassword } = req.body
  const errors = []

  if (!name || !accountId || !password || !ConfirmPassword) {
    errors.push('所有欄位都必須填寫喔!')
  }
  if (password !== ConfirmPassword) {
    errors.push('密碼及確認密碼不相符喔！')
  }
  if (errors.length > 0) {
    return res.render('register', { name, accountId, password, ConfirmPassword, errors })
  }

  User.findOne({ accountId })
    .then(user => {
      if (user) {
        errors.push('這個帳號已經被註冊過，請換一個喔!')
        return res.render('register', { name, accountId, password, ConfirmPassword, errors })
      }

      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ name, accountId, password: hash }))
        .then(() => {
          req.flash('success_msg', '恭喜註冊成功! 登入後就可以開始使用囉!')
          return res.redirect('/user/login')
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '成功登出！')
  res.redirect('/user/login')
})

module.exports = router