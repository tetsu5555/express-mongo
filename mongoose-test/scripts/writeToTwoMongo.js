const mongoose = require('mongoose');
const { Schema } = mongoose;
const databaseUrl = process.env.MONGO_DATABASE
const databaseUrl2 = process.env.MONGO_DATABASE2



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

const CampaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: {
      createdAt: 'created_at'
    }
  }
)

const Campaign = mongoose.model('Campaign', CampaignSchema)
 

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
    // {
    //   deleteOne: {
    //     filter: { name: 'Hand of the King' }
    //   }
    // }
  ]).then(res => {
   // Prints "1 1 0"
   console.log(res.insertedCount, res.modifiedCount, res.deletedCount);
   console.log(res);


  //  mongodb2に繋ぐ
   mongoose.connect(databaseUrl2, { useNewUrlParser: true });
   const db = mongoose.connection;
    
   db.on('error', console.error.bind(console, 'connection error:'));
    
   db.once('open', function() {
       console.log("Connection Successful!"); 
       // documents array
       const campaigns = [
         {name: 'campaign 1', type: 'chat'},
         {name: 'campaign 2', type: 'ticket'},
         {name: 'campaign 3', type: 'mail'},
       ]
   
       Campaign.insertMany(campaigns, (err, docs) => {
        if (err) return console.error(err)
        console.log('this is campaigns', docs)
       })
   });
  })
});
 