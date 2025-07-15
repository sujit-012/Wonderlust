const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) =>({...obj, owner:'68456e419e59ee200ca42217'}))
    await Listing.insertMany(initdata.data);
    console.log("Data was successfully initialized");
  } catch (err) {
    console.error("Initialization error:", err);
  } finally {
    mongoose.disconnect();
  }
};

initDB();