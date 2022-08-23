const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connect = async () => {
  console.log(MONGO_URI)
  await mongoose.connect(MONGO_URI)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};

const Schema=mongoose.Schema;

const dataSchema = new Schema({
  name:{
    type:String,
  },
  regex:{
    type:String,
  },
  country:{
    type:String,
  },
  sector:{
    type:String,
  },
  tag1:{
    type:String,
  },
  tag2:{
    type:String,
  },
  tag3:{
    type:String,
  },
});

const axios = require('axios');

const path="https://github.com/coastaldemigod/akto-test/blob/main/dummy-data.json"

var fpatharr =path.split("/")

var fpath="https://raw.githubusercontent.com"
for (var i in fpatharr)
{
    if(fpatharr[i]=="https:" || fpatharr[i]=="http:" || fpatharr[i]=="github.com" || fpatharr[i]=="" || fpatharr[i]=="blob" )
    {
        continue;
    }
    fpath+="/"+fpatharr[i]
}

async function pdata(data)
{
    const pii=mongoose.model("piidata",dataSchema)
    for(var i in data)
    {
        console.log(data[i]);
        await pii.updateOne(data[i],upsert=true);
        console.log("data updated")
    }
}

axios
  .get(fpath)
  .then(async res => {
    console.log(`statusCode: ${res.status}`);
    // console.log(res.data);
    await connect();
    await pdata(res.data);
  })
  .catch(error => {
    console.error(error);
  });