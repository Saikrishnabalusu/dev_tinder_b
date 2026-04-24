const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const requestRoute = express.Router();

connectionsRoute.post("/request/:type/:toUserId", userAuth, (req, res) => {
    //request can be either rejected / accepted 
    // for accepted requests, update the status in DB
    // 

})


module.exports = { requestRoute }