const express = require("express")
const cookieParser = require("cookie-parser")
const { connectDB } = require("./config/database.js");
const authRouter = require("./routes/authRoute.js")
const profileRouter = require("./routes/profileRoute.js")
const { connectionRoute } = require("./routes/connectionRoute.js")
const cors = require("cors")


const app = express();
app.use(express.json()) // to parse the incoming request body in json format and make it available in req.body
app.use(cookieParser()) // to parse the incoming request cookies and make it available in req.cookies
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent in cross-origin requests
};
app.use(cors(corsOptions)) // to allow cross-origin requests from the frontend to the backend

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRoute);

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
        console.log("app listening successfully on port 7777...");
    })

}).catch(e => console.error("database connection failed! with error: " + e.message));


app.use("/", (err, req, res, next) => { // To handle error in any route 
    if (err) {
        res.status(500).send("something Went wrong" + err);
    }
})



