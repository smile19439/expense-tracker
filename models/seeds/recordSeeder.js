const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

const User = require('../user')
const Category = require('../category')
const Record = require('../record')

const SEED_USER = [{
  name: '廣志',
  accountId: 'user1',
  password: '1111'
}, {
  name: '小新',
  accountId: 'user2',
  password: '2222'
}]

db.once('open', () => {
  // 建立使用者種子資料
  return Promise.all(
    Array.from({ length: SEED_USER.length }, (_, i) => {
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(
          SEED_USER[i].password,
          salt
        ))
        .then(hash => User.create(
          Object.assign(SEED_USER[i], { password: hash })
        ))
        .then(user => {
          const userId = user._id
          return userId
        })
    })
  )
    // 建立支出紀錄種子資料
    .then(userId => {
      return Category.find()
        .then(category => {
          return Promise.all(
            Array.from({ length: category.length * userId.length }, (_, i) => Record.create({
              name: `name-${i}`,
              date: Date.now(),
              amount: (i + 1) * 10,
              userId: userId[Math.floor(i / 5)],
              categoryId: category[i % 5]._id
            }))
          )
        })
    })
    .then(() => {
      console.log('done!')
    })
    .catch(error => console.error(error))
    .finally(() => process.exit())
})