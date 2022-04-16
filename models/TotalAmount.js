const Record = require('./record')

function getTotalAmountByUser(userId) {

  return Record.aggregate([{
    $group: {
      _id: "$userId",
      total: {
        $sum: "$amount"
      }
    }
  }])
    .append([{
      $match: {
        _id: userId
      }
    }])
}

module.exports = getTotalAmountByUser