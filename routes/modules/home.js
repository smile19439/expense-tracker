const express = require('express')
const router = express.Router()
const moment = require('moment')  //格式化日期

const Record = require('../../models/record')
const Category = require('../../models/category')
const getTotalAmount = require('../../models/TotalAmount')

router.get('/', (req, res) => {
  const userId = req.user._id
  const categoryName = req.query.category

  return Category.find() // 取得所有類別
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      // 將選取的類別加入isSelected
      categories.map(category => {
        if (category.name === categoryName) {
          category.isSelected = true
        }
      })

      Promise.resolve(getTotalAmount(userId, categoryName)) //取得金額總和
        .then(totalAmount => {
          if (totalAmount.length === 0) {
            const totalValue = 0
            return res.render('index', { categories, totalValue })
          }

          const totalValue = totalAmount[0].total
          if (categoryName === undefined || categoryName === '所有類別') {
            return Record.find({ userId })
              .populate('categoryId')
              .lean()
              .sort({ date: 'asc' })
              .then(records => {
                records.map(record => {
                  record.date = moment(record.date).format("YYYY/MM/DD")
                })
                return res.render('index', { records, totalValue, categories })
              })
              .catch(error => console.log(error))
          }

          // 選取的類別
          const categoryId = categories.find(element => {
            return element.name === categoryName
          })

          // 依使用者id及類別取得record資料
          return Record.find({ userId, categoryId })
            .populate('categoryId')
            .lean()
            .sort({ date: 'asc' })
            .then(records => {
              records.map(record => {
                record.date = moment(record.date).format("YYYY/MM/DD")
              })
              return res.render('index', { records, totalValue, categories })
            })
            .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

module.exports = router