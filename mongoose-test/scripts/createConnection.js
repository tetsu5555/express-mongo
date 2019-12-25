const mongoose = require("mongoose");
const databaseUrl = process.env.MONGO_DATABASE;
const { Schema } = mongoose;
const conn = mongoose.createConnection(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const TankSchema = new Schema({ name: 'String', size: 'String' });
const Tank = conn.model('Tank', TankSchema);

const small = new Tank({name: 'Yasu3', size: 'large3'});

small.save(err => {
  if (err) console.error(err)
  console.log('saved')
  mongoose.disconnect();
});