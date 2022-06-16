const express = require('express')
const router = express.Router()
const moment = require('moment')

const Record = require('../../models/record')
const Category = require('../../models/category')

// 新增
router.get('/create', (req, res, next) => {
  return Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      return res.render('create', { categories })
    })
    .catch(error => next(error))
})

router.post('/create', (req, res, next) => {
  const userId = req.user._id
  const { category, date, name, amount } = req.body

  if (!category || !date || !name || !amount) {
    const errors = ['所有欄位都必填喔！']
    return Category.find()
      .lean()
      .sort({ _id: 'asc' })
      .then(categories => {
        categories.map(element => {
          if (element.name === category) {
            element.isSelected = true
          }
        })
        return res.render('create', { category, date, name, amount, errors, categories })
      })
      .catch(error => next(error))
  }
  return Category.findOne({ name: category })
    .then(category => {
      return Record.create({ name, date, amount, categoryId: category, userId})
    })
    .then(() => res.redirect('/'))
    .catch(error => next(error))
})

// 修改
router.get('/:recordId/edit', (req, res, next) => {
  const recordId = req.params.recordId

  return Category.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      return Record.findOne({ _id: recordId })
        .populate('categoryId')
        .lean()
        .then(record => {
          record.date = moment(record.date).format("YYYY-MM-DD") //格式化日期

          // 將類別陣列中，與record相同類別名稱的項目加上isSelected
          categories.map(category => {
            if (category.name === record.categoryId.name) {
              category.isSelected = true
            }
          })

          return res.render('edit', { record, categories })
        })
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

router.put('/:recordId', (req, res, next) => {
  const _id = req.params.recordId
  const { category, date, name, amount } = req.body

  if (!category || !date || !name || !amount) {
    const errors = ['所有欄位都必填喔！']
    record = { _id, category, date, name, amount }
    return Category.find()
      .lean()
      .sort({ _id: 'asc' })
      .then(categories => {
        categories.map(category => {
          if (category.name === record.category) {
            category.isSelected = true
          }
        })
        return res.render('edit', { record, errors, categories })
      })
      .catch(error => next(error))
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
        .catch(error => next(error))
    })
    .catch(error => next(error))
})

// 刪除
router.delete('/:recordId', (req, res, next) => {
  const id = req.params.recordId

  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => next(error))
})

module.exports = router