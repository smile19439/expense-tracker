module.exports = {
  // 登入驗證
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    return res.redirect('/user/login')
  }
}