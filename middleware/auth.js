module.exports = {
  // 登入驗證
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', '登入後才能使用喔！')
    return res.redirect('/user/login')
  },
  // 確認登入頁面輸入值
  checkLoginValue: (req, res, next) => {
    const { accountId, password } = req.body
    if (!accountId || !password) {
      req.flash('warning_msg', '請輸入帳號及密碼!')
      return res.render('login', { accountId, password })
    }
    return next()
  }
}