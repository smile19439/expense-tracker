const express = require('express')
const router = express.Router()
const moment = require('moment')

const Record = require('../../models/record')
const Category = require('../../models/category')

// 修改
router.get('/:recordId/edit', (req, res) => {
  const recordId = req.params.recordId

  return Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categorys => {
      return Record.findOne({ _id: recordId })
        .populate('categoryId')
        .lean()
        .then(record => {
          record.date = moment(record.date).format("YYYY-MM-DD") //格式化日期

          // 將類別陣列中，與record相同類別名稱的項目加上isSelected
          categorys.map(category => {
            if (category.name === record.categoryId.name) {
              category.isSelected = true
            }
          })

          return res.render('edit', { record, categorys })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

router.put('/:recordId', (req, res) => {
  const _id = req.params.recordId
  const { category, date, name, amount } = req.body

  if (!category || !date || !name || !amount) {
    const errors = ['所有欄位都必填喔！']
    record = { _id, category, date, name, amount }
    return Category.find()
      .lean()
      .sort({ _id: 'asc' })
      .then(categorys => {
        categorys.map(category => {
          if (category.name === record.category) {
            category.isSelected = true
          }
        })
        return res.render('edit', { record, errors, categorys })
      })
      .catch(error => console.log(error))
  }

  return Category.findOne({ name: category })
    .then(category => {
      return Record.findById(_id)
        .then(record => {
          record = Object.assign(record, {
            name, date, categoryId: category._id, amount
          })
          return record.save()
        })
        .then(() => res.redirect('/'))
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

// 刪除
router.delete('/:recordId', (req, res) => {
  const id = req.params.recordId

  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router