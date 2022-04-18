const bcrypt = require('bcryptjs')
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
  return Promise.all(
    Array.from({ length: SEED_USER.length }, (_, i) => {
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(
          SEED_USER[i].password,
          salt
        ))

        // 建立使用者種子資料
        .then(hash => User.create(
          Object.assign(SEED_USER[i], { password: hash })
        ))

        // 建立支出紀錄種子資料
        .then(user => {
          const userId = user._id
          return Category.find()
            .then(category => {
              return Promise.all(
                Array.from({ length: 5 }, (_, i) => Record.create({
                  name: `name-${i}`,
                  date: Date.now(),
                  amount: (i + 1) * 10,
                  userId,
                  categoryId: category[i]._id
                }))
              )
            })
        })
    })
  )
    .then(() => {
      console.log('done!')
    })
    .catch(console.log)
    .finally(() => process.exit())
})