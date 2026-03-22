// userName = saikrishnabalusu97_db_user
// password = tfavZquAJXBk8Dhd
// const DB_CLUSTER_URL = "mongodb+srv://saikrishnabalusu97_db_user:CsVJG4wF3wCDHwPF@devtinder.rn2ecnl.mongodb.net/"
const DB_URL = "mongodb+srv://saikrishnabalusu97_db_user:CsVJG4wF3wCDHwPF@devtinder.rn2ecnl.mongodb.net/DevTinder"

const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(DB_URL)
}

module.exports = {
    connectDB
}




