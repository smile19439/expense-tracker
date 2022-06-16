module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    req.flash('warning_msg', `${err}`)
    res.redirect('back')
    next(err)
  }
}