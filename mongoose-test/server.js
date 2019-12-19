var mongoose = require('mongoose');
var databaseUrl = process.env.MONGO_DATABASE || "mongodb://localhost/tutorialkart"

// make a connection
mongoose.connect(databaseUrl, { useNewUrlParser: true });
 
// get reference to database
var db = mongoose.connection;
 
db.on('error', console.error.bind(console, 'connection error:'));
 
db.once('open', function() {
    console.log("Connection Successful!");

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
      }
    )

    const Campaign = mongoose.model('Campaign', CampaignSchema)
    
    // define Schema
    const CampaignFolderSchema = new mongoose.Schema(
      {
        name: {
          type: String,
          default: ''
        },
        campaign: [{
          type: mongoose.Schema.Types.ObjectId
        }]
    });

    CampaignFolderSchema.add({ subFolders: [CampaignFolderSchema] })

    const CampaignFolder = mongoose.model('CampaignFolder', CampaignFolderSchema)
 
 
    // documents array
    const campaigns = [
      {name: 'campaign 1', type: 'chat'},
      {name: 'campaign 2', type: 'ticket'},
      {name: 'campaign 3', type: 'mail'},
    ]

    Campaign.insertMany(campaigns, (err, docs) => {
      if (err) return console.error(err)

      console.log('this is campaigns', docs)
      
      const firstCampaignObjectId = docs[0]._id
      const campaignFolder1 = new CampaignFolder({ name: 'folder for campaign 1', campaign: [firstCampaignObjectId] })

      campaignFolder1.save(function (err, folder) {
        if (err) return console.error(err)

        console.log('this is folder', folder);

        const campaignFolder2 = new CampaignFolder({ name: 'folder for campaign 2', subFolders: [folder] })
        campaignFolder2.save(function (err, folder) {
          if (err) return console.error(err)

          console.log('this is folder2', folder);
        })
      })
    })
});
 