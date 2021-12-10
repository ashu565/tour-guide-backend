const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const guideSchema = new mongoose.Schema({
    userInformation: {
       type: ObjectId,
       ref: "User"
    },
    pic:String,
    description:{
        type:String,
        required:true
    },
    location: [{
      type:ObjectId,
      ref: "location"
    }]
},)

const Guide = mongoose.model("Guide",guideSchema)

module.exports = Guide
