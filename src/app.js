// console.log("hello world!!")

const express = require("express")
const bcrypt = require("bcrypt")
const { userAuth } = require("./middlewares/userAuth.js");
const { validateLoginData } = require("./utils/validateLoginData.js")
const { validateSignupData } = require("./utils/validateSignupData.js")


const app = express();
const { connectDB } = require("./config/database.js");
const { User } = require("./models/userModel.js");


connectDB().then(() => {
    console.log("Database connection established..."); app.listen(7777, () => {
        console.log("app listening successfully on port 7777...");
    })

}).catch(e => console.error("database connection failed!"));

app.use(express.json())

// app.use("/", userAuth);

app.get("/dashboard", (req, res, next) => {
    // logic to provide the Dashboard access / authenticate the user 1st to protect this data access
    res.send("This is the dashboard screen");

})

app.post("/signUp", async (req, res) => { // user SignUp API

    const userObj = req.body;

    try {
        //validate signup data
        validateSignupData(req);
        // hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log("hashed password:", hashedPassword);

        const user = new User({ ...userObj, password: hashedPassword });
        await user.save();
        res.send("User created successfully, try Login now!!")
    } catch (e) {
        res.status(500).send("User creation failed!!" + e)
    }
})

//User Login API -- To get the user detail using email, confirm password and vallidate the login
// app.get("/signin", async (req, res, next) => {
//     // get the email from the req, headers

//     const loginUser = await User.find({ email: req.headers.email });

//     console.log("age from DB", loginUser.age)
//     console.log("age from req", req.headers.age)
//     // validate login user creds
//     if (loginUser.age == req.headers.age) {
//         res.send("User details matched!!")
//     }
//     else res.send("Invalid User details")


//     // res.send(loginUser)
// })

app.get("/login", async (req, res) => {
    try {
        // validate req.body
        validateLoginData(req);
        const { email, password } = req.body;
        //check if email exists in DB
        const userDetail = await User.find({ email: email });

    }
    catch {
        res.status(400).send("Something went wrong during login")
    }

})

app.use("/", (err, req, res, next) => { // To handle error in any route 
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
