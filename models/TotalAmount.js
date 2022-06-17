const Category = require('./category')
const Record = require('./record')

function getTotalAmount(userId, categoryName) {
  if (categoryName !== undefined && categoryName !== '所有類別') {
    return Category.findOne({ name: categoryName })
      .then(category => {
        return Record.aggregate([{
          $group: {
            _id: {
              userId: '$userId',
              categoryId: '$categoryId'
            },
            total: {
              $sum: '$amount'
            }
          }
        }, {
          $match: {
            _id: {
              userId,
              categoryId: category._id
            }
          }
        }])
      })
  }

  return Record.aggregate([{
    $group: {
      _id: '$userId',
      total: {
        $sum: '$amount'
      }
    }
  }, {
    $match: {
      _id: userId
    }
  }])
}

module.exports = getTotalAmount