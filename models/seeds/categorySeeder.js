if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Category = require('../category')

const CATEGORY = [{
  name: '家居物業',
  iconClassName: 'fa-solid fa-house'
}, {
  name: '交通出行',
  iconClassName: 'fa-solid fa-van-shuttle',
}, {
  name: '休閒娛樂',
  iconClassName: 'fa-solid fa-face-grin-beam',
}, {
  name: '餐飲食品',
  iconClassName: 'fa-solid fa-utensils',
}, {
  name: '其他',
  iconClassName: 'fa-solid fa-pen'
}]

db.once('open', () => {
  return Promise.all(
    Array.from({ length: CATEGORY.length }, (_, i) => {
      return Category.create(CATEGORY[i])
    })
  )
    .then(() => {
      console.log('done!')
    })
    .catch(error => console.error(error))
    .finally(() => process.exit())
})
