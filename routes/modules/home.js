const express = require('express')
const router = express.Router()
const moment = require('moment')  //格式化日期

const Record = require('../../models/record')
const Category = require('../../models/category')
const getTotalAmount = require('../../models/TotalAmount')

router.get('/', (req, res, next) => {
  const userId = req.user._id
  const categoryName = req.query.category

  return Category.find({ name: categoryName })
    .then(categoryId => {
      return Promise.all([
        Category.find() // 取得所有類別 
          .lean()
          .sort({ _id: 'asc' }),
        getTotalAmount(userId, categoryName), //取得金額總和
        Record.find(categoryId[0] ? { userId, categoryId } : { userId }) //取得record資料
          .populate('categoryId')
          .lean()
          .sort({ date: 'asc' })
      ])
    })
    .then(([categories, totalAmount, records]) => {
      // 將選取的類別加入isSelected
      categories.forEach(category => {
        if (category.name === categoryName) {
          category.isSelected = true
        }
      })

      if (totalAmount.length === 0) {
        const totalValue = 0
        return res.render('index', { categories, totalValue })
      }
      const totalValue = totalAmount[0].total

      records.forEach(record => {
        record.date = moment(record.date).format("YYYY/MM/DD")
      })
      return res.render('index', { records, totalValue, categories })
    })
    .catch(error => next(error))
})

module.exports = router
