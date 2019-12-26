// mongo
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
// mongoose.set('debug', true) // enable logging collection methods + arguments to the console
const databaseUrl = process.env.MONGO_DATABASE
mongoose.connect('mongodb://mongodb,mongodb2',  { useNewUrlParser: true, replicaSet: "rs0", useUnifiedTopology: true })


const schema1 = new Schema({
  name: {type: String},
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, m) => {
      delete m.__v
      return m
    },
  },
})

const User = mongoose.model('User', schema1)

const schema2 = new Schema({
  msg: {type: String, required: true},
}, {
  timestamps: true,
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
    transform: (doc, m) => {
      delete m.__v
      return m
    },
  },
})

const Chat = mongoose.model('Chat', schema2)


const insert = async function(isFail = false) {

  // session取得(Mongooseの場合はModel.startSessionで取得)
  const session = await User.startSession()


  try {
    await session.startTransaction()

    // テーブルがないと失敗するので注意
    await User.insertMany([{name: '次郎'}],  { session })
    await Chat.insertMany([{msg: 'こんにちわ'}],  { session })
    if (isFail) {
      throw new Error('保存失敗')
    }

    await session.commitTransaction() // コミット
    console.log('--------commit-----------')
  } catch (e) {
    await session.abortTransaction() // ロールバック
    console.log('--------abort-----------')
    console.error(e)
  } finally {
    await session.endSession()
  }

  // 状態確認
  const users = await User.find()
  console.log(users)
  const chats = await Chat.find()
  console.log(chats)
}


const update = async function(isFail = false) {

  // session取得(Mongooseの場合はModel.startSessionで取得)
  const session = await User.startSession()
  try {
    await session.startTransaction({readConcern: { level: 'snapshot' }, writeConcern: { w: 'majority' }})

    await User.findOneAndUpdate({name: '次郎'}, {$set: {name: '花子'}}, {session, runValidators: true, new: true})
    await Chat.findOneAndUpdate({msg: 'こんにちわ'}, {$set: {msg: 'こんばんわ'}}, {session, runValidators: true, new: true})
    if (isFail) {
      throw new Error('保存失敗')
    }

    await session.commitTransaction() // コミット
    console.log('--------commit-----------')
  } catch (e) {
    await session.abortTransaction() // ロールバック
    console.log('--------abort-----------')
    console.error(e)
  } finally {
    await session.endSession()
  }

  // 状態確認
  const users = await User.find()
  console.log(users)
  const chats = await Chat.find()
  console.log(chats)
}



async function main() {

  await mongoose.connection.dropDatabase()

  // テーブル作成
  await User.create({name: '太郎'})
  await Chat.create({msg: 'おはよう'})
  // 状態確認
  const users = await User.find()
  console.log(users)
  const chats = await Chat.find()
  console.log(chats)

//   await insert(true)
  await insert()
//   await update(true)
//   await update()

  await mongoose.disconnect()
}

main()