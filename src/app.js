// console.log("hello world!!")

const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const { userAuth } = require("./middlewares/userAuth.js");
const { validateLoginData } = require("./utils/validateLoginData.js")
const { validateSignupData } = require("./utils/validateSignupData.js")
const { connectDB } = require("./config/database.js");
const { User } = require("./models/userModel.js");

const app = express();

app.use(express.json())
app.use(cookieParser())

connectDB().then(() => {
    console.log("Database connection established..."); app.listen(7777, () => {
        console.log("app listening successfully on port 7777...");
    })

}).catch(e => console.error("database connection failed!"));



app.post("/signUp", async (req, res) => { // user SignUp API

    const userObj = req.body;

    try {
        //validate signup data
        validateSignupData(req);
        // hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // console.log("hashed password:", hashedPassword);

        const user = new User({ ...userObj, password: hashedPassword });
        await user.save();
        res.send("User created successfully, try Login now!!")
    } catch (error) {
        res.status(500).send("User creation failed!!" + error.message)
    }
})



app.get("/profile", userAuth, (req, res, next) => {
    try {
        res.send("Login user profile is :" + req.loginUser.firstName + "  " + req.loginUser.lastName)


    } catch (e) {
        res.status(400).send("Error in getting Profile :" + e);
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

app.post("/login", async (req, res) => {
    try {
        // validate req.body
        validateLoginData(req);
        const { email, password } = req.body;
        //check if email exists in DB
        const userDetail = await User.find({ email: email });

        if (!userDetail) {
            throw new Error("Invalid credentials")
        }
        //check the password match
        isPasswordValid = await bcrypt.compare(password, userDetail[0].password)
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials")
        }
        //Provide the Token 
        const token = await jwt.sign({ _id: userDetail[0]._id }, "JWT_SECRET")

        res.cookie("token", token)

        res.send("Login Successful...")
    }
    catch (error) {
        res.status(400).send("Something went wrong during login" + error.message)
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
