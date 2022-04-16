const express = require('express')
const router = express.Router()
const moment = require('moment')  //格式化日期

const Record = require('../../models/record')
require('../../models/category')
const getTotalAmountByUser = require('../../models/TotalAmount')

router.get('/', (req, res) => {
  const userId = req.user._id

  Promise.resolve(getTotalAmountByUser(userId))
    .then(totalAmount => {
      const totalValue = totalAmount[0].total

      return Record.find({ userId })
        .populate('categoryId')
        .lean()
        .then(records => {
          records.map(record => {
            record.date = moment(record.date).format("YYYY/MM/DD")
          })
          return res.render('index', { records, totalValue })
        })
        .catch(error => console.log(error))
    })
    .catch(error => console.log(error))
})

module.exports = router