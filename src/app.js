// console.log("hello world!!")

const express = require("express")
const { userAuth } = require("./middlewares/userAuth.js");


const app = express();
const { connectDB } = require("./config/database.js");
const { User } = require("./models/userModel.js");


connectDB().then(() => {
    console.log("Database connection established..."); app.listen(7777, () => {
        console.log("app listening successfully on port 7777...");
    })

}).catch(e => console.error("database connection failed!"));



// app.use("/", userAuth);

app.get("/dashboard", (req, res, next) => {
    // logic to provide the Dashboard access / authenticate the user 1st to protect this data access
    res.send("This is the dashboard screen");

})

app.post("/signUp", async (req, res, next) => {
    const userObj = {
        firstName: "balusu",
        lastName: "sai",
        gender: "Male",
        email: "apbsk923@gmail.com",
        age: 23
    };
    try {
        const user = new User(userObj);
        await user.save();
        res.send("User created successfully, try Login now!!")
    } catch {
        res.status(500).send("User creation failed!!")
    }
})

app.use("/", (err, req, res, next) => {
    if (err) {
        res.status(500).send("something Went wrong");
    }
})


// app.get("/user/:userID/:reqNo", (req,res)=>{
//     // console.log(req._parsedUrl.query);
//     console.log("userId = ",req.params.userID);
//     console.log("reqNo. =",req.params.reqNo);
//     res.send({firstName:"kittu3", lastName:"Balusu" })
// })

// app.use("/kittu",(req,res)=>{
//     res.send("Hi kittu from the server!!")
// })



// app.use("/test",(req,res)=>{
//     res.send("Hi test nodemon from the server!!")
// })
//  // order of execution matters and hence placed in the last
// app.use("/",(req,res)=>{
//     res.send("Hi home from the server!!")
// })
