const express = require("express")
const authRouter = express.Router();
const bcrypt = require("bcrypt")
const { validateLoginData } = require("../utils/validateLoginData.js")
const { validateSignupData } = require("../utils/validateSignupData.js")
const { User } = require("../models/userModel.js");

authRouter.post("/signUp", async (req, res) => { // user SignUp API

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

authRouter.post("/login", async (req, res) => {
    try {
        // validate req.body
        validateLoginData(req);
        const { email, password } = req.body;
        //check if email exists in DB
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("Invalid credentials")
        }
        //check the password match
        isPasswordValid = user.comparePassword(req);
        if (!isPasswordValid) {
            throw new Error("Invalid Credentials")
        }
        //Provide the Token 
        const token = await user.getJWT(); // need to provide this in await as this returns a promise.

        res.cookie("token", token)

        res.send("Login Successful...")
    }
    catch (error) {
        res.status(400).send("Something went wrong during login" + error.message)
    }

})

authRouter.post("/logout", (req, res) => {
    // when user loggedin he has got the access token and to logout we remove the token
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
        .send("Logout Sucessfull...")
})

module.exports = authRouter;