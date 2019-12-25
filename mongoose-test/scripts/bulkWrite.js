const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseUrl = process.env.MONGO_DATABASE

// make a connection
mongoose.connect(databaseUrl, { useNewUrlParser: true,  useFindAndModify: false, useUnifiedTopology: true });
 
// get reference to database
const db = mongoose.connection;

const thingSchema = new Schema(
  {
    name: {
      type: String
    }
  },
  {
    timestamps: {

    }
  }
);

const Thing = mongoose.model('Thing', thingSchema);
 

db.on('error', console.error.bind(console, 'connection error:'));
 
db.once('open', async function() {

  Thing.bulkWrite([
    {
      insertOne: {
        document: {
          name: 'Eddard Stark',
          title: 'Warden of the North'
        }
      }
    },
    {
      updateOne: {
        filter: { name: 'Eddard Stark' },
        update: { name: 'Hand of the King' }
      }
    },
    {
      deleteOne: {
        filter: { name: 'Hand of the King' }
      }
    }
  ]).then(res => {
   // Prints "1 1 0"
   console.log(res.insertedCount, res.modifiedCount, res.deletedCount);
   console.log(res);
  })
});
 