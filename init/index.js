const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
    console.log("connected to DataBase");
})
.catch(()=>{
    console.log(err);
})

  async function main() {
    await mongoose.connect(MONGO_URL);
  }

  // Here we initilizing the Data into DataBase.
  const initDB = async () => {
    await Listing.deleteMany({});  // To delete unneccessay data. If present in DB.
    initData.data=initData.data.map((obj)=>({...obj,owner:"6766e8b1bc5c21e8e2ebb065"}));   // Here i am adding the owner of all listing in DB
    await Listing.insertMany(initData.data); // Here we adding our data to DataBase.
    console.log("data was initialized");
  }

  initDB();